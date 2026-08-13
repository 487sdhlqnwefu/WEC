import { LICENCE_AMOUNT_MINOR, LICENCE_CURRENCY, PRODUCT_TYPE, RULES_VERSION, SIGNED_URL_TTL_SECONDS } from "./domain/constants";
import { newId, normalizeEmail, randomToken, sha256Hex, slugify } from "./domain/crypto";
import { badRequest, forbidden, notFound, unauthorized } from "./domain/errors";
import { generateSingleElimination, roundDisplayName } from "./domain/bracket";
import { generateBlindMapping, physicalPlacementHint, presentationOrder, resolveLoserEntry, resolveWinnerEntry } from "./domain/blindness";
import { assertEventTransition } from "./domain/event-state";
import { assertCanStartHeat, assertHeatTransition } from "./domain/heat-state";
import {
  assertOfficialPanelSize,
  feedbackQualityFlags,
  judgingPrompt,
  majorityWinner,
  officialPanelComplete,
  openMemberNeedsTiebreak,
  openMemberShouldClose,
  tallyBlindVotes,
  validateFeedback,
} from "./domain/judging";
import { applyRefund, applyWebhookStatus, assertPaidEntitlement, LICENCE_LINE } from "./domain/payments";
import { assertCanRedraw, drawPattern } from "./domain/patterns";
import { assertImageUpload, bothPhotosReady, hashFilename, mimeToExt, safeObjectKey, sniffImageMime } from "./domain/photos";
import { releasePolicy } from "./domain/release";
import { assertRestartEligible, restartVoids } from "./domain/restarts";
import {
  assertExactlyOneBlindSteward,
  assertRoleCompatible,
  canOperateTimer,
  canViewBlindMapping,
  isOrganiser,
  judgeHasHeatConflict,
  mergeCoachPermissions,
  mergeTeamPermissions,
  organiserJudgeWarning,
} from "./domain/roles";
import { assignSequentialStarts, scheduleCannotFit } from "./domain/schedule";
import { canLockRoster, validateSetup, type SetupSnapshot } from "./domain/setup";
import { assertTiming, timingPreset } from "./domain/timing";
import {
  finishRun,
  pauseRun,
  resumeRun,
  startRun,
  toTimerDisplay,
  type TimerRunSnapshot,
} from "./domain/timer";
import type {
  BlindEntry,
  CompetitionFormat,
  EventRole,
  HeatState,
  IdentityProvider,
  JudgingDeliveryMode,
  ParticipationStructure,
  RestartReasonType,
  StaffCapability,
  TimerPhase,
  VotingModel,
} from "./domain/types";
import type { MemoryStore } from "./store/memory";
import type {
  AuditEvent,
  Ballot,
  BallotRound,
  BracketNode,
  Entry,
  EventConflict,
  Heat,
  Member,
  ShotTask,
  TimerRun,
  WlatEvent,
  WebhookEvent,
} from "./store/models";

export type Identity = {
  provider: IdentityProvider;
  subject: string;
  email?: string | null;
  name?: string | null;
  avatarUrl?: string | null;
  authUserId?: number | null;
};

export type Actor = {
  member: Member;
  isPlatformAdmin: boolean;
  requestId: string;
  sessionFingerprint?: string;
  mappingReauthedAt?: Date | null;
};

const MAGIC_LINKS = new Map<string, { email: string; expiresAt: number }>();
const DEV_LINKS = new Map<string, string>();

function timerSnap(run: TimerRun): TimerRunSnapshot {
  return { ...run };
}

export class WlatEngine {
  private readonly store: MemoryStore;
  private readonly secrets: { appSecret: string; mappingHmac: string };

  constructor(store: MemoryStore, secrets: { appSecret: string; mappingHmac: string }) {
    this.store = store;
    this.secrets = secrets;
  }

  audit(partial: Omit<AuditEvent, "id" | "createdAt">): void {
    this.store.audits.push({
      ...partial,
      id: newId(),
      createdAt: new Date(),
    });
  }

  upsertMember(identity: Identity): Member {
    const subject = identity.subject;
    const existing = [...this.store.members.values()].find(
      (m) =>
        (m.identityProvider === identity.provider && m.externalSubject === subject) ||
        (identity.email && m.emailNormalized === normalizeEmail(identity.email)),
    );
    const now = new Date();
    if (existing) {
      existing.lastIdentitySyncAt = now;
      existing.updatedAt = now;
      if (identity.authUserId) existing.authUserId = identity.authUserId;
      if (identity.avatarUrl) existing.avatarPath = identity.avatarUrl;
      if (identity.name && !existing.displayName) existing.displayName = identity.name;
      this.store.members.set(existing.id, existing);
      return existing;
    }
    const member: Member = {
      id: newId(),
      authUserId: identity.authUserId ?? null,
      identityProvider: identity.provider,
      externalSubject: subject,
      externalMemberId: null,
      lastIdentitySyncAt: now,
      emailNormalized: identity.email ? normalizeEmail(identity.email) : null,
      displayName: identity.name?.trim() || identity.email?.split("@")[0] || "WEC Member",
      givenName: null,
      familyName: null,
      countryCode: null,
      city: null,
      preferredLanguage: "en",
      avatarPath: identity.avatarUrl ?? null,
      publicBio: null,
      affiliationName: null,
      publicProfileConsent: false,
      profileCompletedAt: null,
      suspendedAt: null,
      createdAt: now,
      updatedAt: now,
    };
    this.store.put(this.store.members, member);
    return member;
  }

  createMagicLink(email: string): { token: string; expiresAt: Date } {
    const token = randomToken();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
    MAGIC_LINKS.set(sha256Hex(token), { email: normalizeEmail(email), expiresAt: expiresAt.getTime() });
    return { token, expiresAt };
  }

  consumeMagicLink(token: string): Member {
    const row = MAGIC_LINKS.get(sha256Hex(token));
    if (!row || row.expiresAt < Date.now()) {
      throw badRequest("INVALID_LINK", "This sign-in link is invalid or expired.");
    }
    MAGIC_LINKS.delete(sha256Hex(token));
    return this.upsertMember({
      provider: "magic_link",
      subject: row.email,
      email: row.email,
      name: row.email.split("@")[0],
    });
  }

  devLogin(email: string, enabled: boolean): Member {
    if (!enabled) throw forbidden("DEV_AUTH_DISABLED", "Dev sign-in is disabled.");
    const normalized = normalizeEmail(email);
    DEV_LINKS.set(normalized, normalized);
    return this.upsertMember({
      provider: "dev",
      subject: normalized,
      email: normalized,
      name: normalized.split("@")[0],
    });
  }

  requireActor(actor: Actor | null): Actor {
    if (!actor) throw unauthorized();
    if (actor.member.suspendedAt) throw forbidden("SUSPENDED", "This member is suspended.");
    return actor;
  }

  getEvent(eventId: string): WlatEvent {
    const event = this.store.events.get(eventId);
    if (!event) throw notFound("EVENT", "Event not found.");
    return event;
  }

  getEventBySlug(slug: string): WlatEvent {
    const event = [...this.store.events.values()].find((e) => e.slug === slug);
    if (!event) throw notFound("EVENT", "Event not found.");
    return event;
  }

  rolesFor(eventId: string, memberId: string): EventRole[] {
    return this.store
      .eventRoles(eventId, memberId)
      .filter((r) => r.status === "accepted")
      .map((r) => r.role);
  }

  capabilitiesFor(eventId: string, memberId: string): StaffCapability[] {
    return this.store.eventRoles(eventId, memberId).flatMap((r) => r.capabilities);
  }

  assertOrganiser(actor: Actor, event: WlatEvent): void {
    if (actor.isPlatformAdmin) return;
    const roles = this.rolesFor(event.id, actor.member.id);
    if (!isOrganiser(roles) && event.ownerMemberId !== actor.member.id) {
      throw forbidden("ORGANISER_ONLY", "Only organisers can do that.");
    }
  }

  paymentFor(eventId: string) {
    return [...this.store.payments.values()].find((p) => p.eventId === eventId);
  }

  createDraftEvent(actor: Actor, input: { name?: string }): WlatEvent {
    this.requireActor(actor);
    const now = new Date();
    const baseName = input.name?.trim() || "Untitled Throwdown";
    let slug = slugify(baseName);
    let n = 1;
    while ([...this.store.events.values()].some((e) => e.slug === slug)) {
      n += 1;
      slug = `${slugify(baseName)}-${n}`;
    }
    const event: WlatEvent = {
      id: newId(),
      productType: PRODUCT_TYPE,
      name: baseName,
      slug,
      description: null,
      ownerMemberId: actor.member.id,
      organisationName: null,
      venueName: null,
      city: null,
      countryCode: null,
      timezone: "UTC",
      startsAt: null,
      endsAt: null,
      status: "draft",
      fieldSize: 8,
      competitionFormat: "freestyle",
      judgingDeliveryMode: "physical",
      votingModel: "official_panel",
      officialJudgeCount: 3,
      participationStructure: "solo",
      equipmentMode: "central_shot_service",
      rulesVersion: RULES_VERSION,
      openMemberEligibility: "approved_invitees",
      openMemberTargetBallots: 21,
      openMemberMinimumBallots: 11,
      openMemberWindowSeconds: 900,
      openMemberPreapprovedOnly: true,
      patternSubmitterPolicy: "both",
      patternRepeatsAllowed: false,
      patternsVisibleBeforeEvent: true,
      patternApprovalRequired: true,
      voteSplitPublic: true,
      heroImagePath: null,
      privateNotes: null,
      equipmentNotes: {},
      coachPermissions: mergeCoachPermissions(),
      teamPermissions: mergeTeamPermissions(),
      wizard: {},
      rosterLockedAt: null,
      bracketLockedAt: null,
      completedAt: null,
      publishedAt: null,
      createdAt: now,
      updatedAt: now,
    };
    this.store.put(this.store.events, event);
    this.store.put(this.store.roles, {
      id: newId(),
      eventId: event.id,
      memberId: actor.member.id,
      role: "lead_organiser",
      capabilities: [],
      status: "accepted",
      invitedByMemberId: actor.member.id,
      acceptedAt: now,
      revokedAt: null,
    });
    const stationId = newId();
    this.store.put(this.store.stations, {
      id: stationId,
      eventId: event.id,
      name: "Station 1",
      ordinal: 1,
      status: "enabled",
      isEnabled: true,
      createdAt: now,
    });
    this.store.locks.set(event.id, {
      eventId: event.id,
      stationId,
      activeHeatId: null,
      activeTimerRunId: null,
      version: 0,
    });
    this.store.put(this.store.timings, {
      id: newId(),
      eventId: event.id,
      version: 1,
      ...timingPreset("central_shot_service"),
    });
    this.store.put(this.store.payments, {
      id: newId(),
      eventId: event.id,
      provider: "stripe",
      status: "unpaid",
      amountMinor: LICENCE_AMOUNT_MINOR,
      currency: LICENCE_CURRENCY,
      stripeCustomerId: null,
      stripeCheckoutSessionId: null,
      stripePaymentIntentId: null,
      stripeChargeId: null,
      paidAt: null,
      refundedAmountMinor: 0,
      createdAt: now,
      updatedAt: now,
    });
    this.audit({
      eventId: event.id,
      heatId: null,
      actorMemberId: actor.member.id,
      actorType: "member",
      action: "event.create",
      entityType: "event",
      entityId: event.id,
      beforeJson: null,
      afterJson: { name: event.name, slug: event.slug },
      reason: null,
      requestId: actor.requestId,
    });
    return event;
  }

  saveWizard(actor: Actor, eventId: string, patch: Partial<WlatEvent> & { timing?: ReturnType<typeof timingPreset>; days?: { localDate: string; opensAt: string; closesAt: string; notes?: string }[] }): WlatEvent {
    const event = this.getEvent(eventId);
    this.assertOrganiser(actor, event);
    if (event.bracketLockedAt && (patch.competitionFormat || patch.fieldSize)) {
      throw badRequest("LOCKED", "Format and field size are locked with the bracket.");
    }
    const next = { ...event, ...patch, updatedAt: new Date() };
    if (patch.coachPermissions) next.coachPermissions = mergeCoachPermissions(patch.coachPermissions);
    if (patch.teamPermissions) next.teamPermissions = mergeTeamPermissions(patch.teamPermissions);
    if (patch.equipmentMode && patch.equipmentMode !== event.equipmentMode && !patch.timing) {
      const timing = [...this.store.timings.values()].find((t) => t.eventId === event.id);
      if (timing) {
        Object.assign(timing, timingPreset(patch.equipmentMode));
      }
    }
    if (patch.timing) {
      const timing = [...this.store.timings.values()].find((t) => t.eventId === event.id);
      if (timing) Object.assign(timing, assertTiming(patch.timing), { version: timing.version + 1 });
    }
    if (patch.days) {
      for (const [id, day] of this.store.days) {
        if (day.eventId === event.id) this.store.days.delete(id);
      }
      for (const day of patch.days) {
        this.store.put(this.store.days, {
          id: newId(),
          eventId: event.id,
          localDate: day.localDate,
          opensAt: new Date(day.opensAt),
          closesAt: new Date(day.closesAt),
          notes: day.notes ?? null,
        });
      }
    }
    if (next.officialJudgeCount) assertOfficialPanelSize(next.officialJudgeCount);
    this.store.events.set(event.id, next);
    return next;
  }

  setupWarnings(eventId: string) {
    const event = this.getEvent(eventId);
    const payment = this.paymentFor(eventId);
    const timing = [...this.store.timings.values()].find((t) => t.eventId === eventId)!;
    const days = [...this.store.days.values()].filter((d) => d.eventId === eventId);
    const stewardCount = this.store.eventRoles(eventId).filter((r) => r.role === "blind_steward" && r.status === "accepted").length;
    const judges = this.store.eventRoles(eventId).filter((r) => r.role === "judge" && r.status === "accepted").length;
    const tiebreak = this.store.eventRoles(eventId).filter((r) => r.role === "tiebreak_judge" && r.status === "accepted").length;
    const snapshot: SetupSnapshot = {
      name: event.name,
      slug: event.slug,
      fieldSize: event.fieldSize,
      competitionFormat: event.competitionFormat,
      judgingDelivery: event.judgingDeliveryMode,
      votingModel: event.votingModel,
      officialJudgeCount: event.officialJudgeCount,
      openMemberTarget: event.openMemberTargetBallots,
      openMemberMinimum: event.openMemberMinimumBallots,
      participation: event.participationStructure,
      equipmentMode: event.equipmentMode,
      timing,
      paymentStatus: payment?.status ?? "unpaid",
      eventState: event.status,
      blindStewardCount: stewardCount,
      assignedJudgeCount: judges,
      tiebreakJudgeCount: tiebreak,
      approvedPatternCount: [...this.store.patterns.values()].filter((p) => p.eventId === eventId && p.status === "approved").length,
      patternRepeatsAllowed: event.patternRepeatsAllowed,
      completeEntries: this.store.eventEntries(eventId).filter((e) => e.status === "complete" || e.status === "checked_in").length,
      unresolvedJudgeConflicts: [...this.store.conflicts.values()].filter((c) => c.eventId === eventId && !c.resolvedAt).length,
      days,
      shotBaristaAssigned: this.store.eventRoles(eventId).some((r) => r.role === "shot_barista" && r.status === "accepted"),
    };
    const warnings = validateSetup(snapshot);
    if (days.length && scheduleCannotFit(event.fieldSize, days, timing)) {
      // already included
    }
    const roles = this.rolesFor(eventId, event.ownerMemberId);
    const judgeWarn = organiserJudgeWarning(roles);
    if (judgeWarn) warnings.push({ code: "ORGANISER_JUDGE", message: judgeWarn, blocking: false });
    return { snapshot, warnings, canLock: canLockRoster(warnings) };
  }

  markCheckoutCreated(eventId: string, sessionId: string): void {
    const payment = this.paymentFor(eventId);
    if (!payment) throw notFound("PAYMENT", "Payment record missing.");
    payment.status = "checkout_created";
    payment.stripeCheckoutSessionId = sessionId;
    payment.updatedAt = new Date();
    const event = this.getEvent(eventId);
    if (event.status === "draft") {
      assertEventTransition(event.status, "awaiting_payment");
      event.status = "awaiting_payment";
      event.updatedAt = new Date();
    }
  }

  applyPaymentWebhook(params: {
    providerEventId: string;
    eventType: string;
    payloadHash: string;
    checkoutSessionId?: string | null;
    paymentIntentId?: string | null;
    chargeId?: string | null;
    sessionStatus?: string;
    paymentIntentStatus?: string | null;
    eventId?: string | null;
  }): { duplicate: boolean; status: string } {
    const existing = [...this.store.webhooks.values()].find((w) => w.providerEventId === params.providerEventId);
    if (existing) return { duplicate: true, status: existing.processingStatus };
    const webhook: WebhookEvent = {
      id: newId(),
      providerEventId: params.providerEventId,
      eventType: params.eventType,
      payloadHash: params.payloadHash,
      processingStatus: "processed",
      processedAt: new Date(),
      errorMessage: null,
    };
    this.store.put(this.store.webhooks, webhook);
    const payment = [...this.store.payments.values()].find(
      (p) =>
        (params.checkoutSessionId && p.stripeCheckoutSessionId === params.checkoutSessionId) ||
        (params.eventId && p.eventId === params.eventId),
    );
    if (!payment) {
      webhook.processingStatus = "failed";
      webhook.errorMessage = "No matching payment";
      return { duplicate: false, status: "failed" };
    }
    payment.status = applyWebhookStatus({
      current: payment.status,
      stripeSessionStatus: params.sessionStatus ?? "",
      paymentIntentStatus: params.paymentIntentStatus,
    });
    if (params.paymentIntentId) payment.stripePaymentIntentId = params.paymentIntentId;
    if (params.chargeId) payment.stripeChargeId = params.chargeId;
    if (payment.status === "paid") {
      payment.paidAt = new Date();
      const event = this.getEvent(payment.eventId);
      if (event.status === "draft" || event.status === "awaiting_payment") {
        event.status = "setup";
        event.updatedAt = new Date();
      }
    }
    payment.updatedAt = new Date();
    this.audit({
      eventId: payment.eventId,
      heatId: null,
      actorMemberId: null,
      actorType: "webhook",
      action: "payment.webhook",
      entityType: "payment",
      entityId: payment.id,
      beforeJson: null,
      afterJson: { status: payment.status, type: params.eventType },
      reason: null,
      requestId: params.providerEventId,
    });
    return { duplicate: false, status: payment.status };
  }

  adminRefund(actor: Actor, eventId: string, amountMinor: number, reason: string) {
    if (!actor.isPlatformAdmin) throw forbidden("ADMIN_ONLY", "Platform Admin only.");
    const payment = this.paymentFor(eventId);
    if (!payment) throw notFound("PAYMENT", "Missing payment.");
    payment.refundedAmountMinor += amountMinor;
    payment.status = applyRefund({
      current: payment.status,
      amountMinor: payment.amountMinor,
      refundedMinor: payment.refundedAmountMinor,
    });
    payment.updatedAt = new Date();
    this.audit({
      eventId,
      heatId: null,
      actorMemberId: actor.member.id,
      actorType: "member",
      action: "payment.refund",
      entityType: "payment",
      entityId: payment.id,
      beforeJson: null,
      afterJson: { amountMinor, status: payment.status },
      reason,
      requestId: actor.requestId,
    });
    return payment;
  }

  assignRole(actor: Actor, input: { eventId: string; memberId: string; role: EventRole; capabilities?: StaffCapability[] }) {
    const event = this.getEvent(input.eventId);
    this.assertOrganiser(actor, event);
    const existing = this.rolesFor(event.id, input.memberId);
    assertRoleCompatible(existing, input.role);
    if (input.role === "blind_steward") {
      const current = this.store.eventRoles(event.id).filter((r) => r.role === "blind_steward" && r.status === "accepted");
      if (current.length >= 1) {
        throw badRequest("STEWARD_EXISTS", "Exactly one Blind Steward may be active.");
      }
    }
    const row = {
      id: newId(),
      eventId: event.id,
      memberId: input.memberId,
      role: input.role,
      capabilities: input.capabilities ?? [],
      status: "accepted" as const,
      invitedByMemberId: actor.member.id,
      acceptedAt: new Date(),
      revokedAt: null,
    };
    this.store.put(this.store.roles, row);
    this.audit({
      eventId: event.id,
      heatId: null,
      actorMemberId: actor.member.id,
      actorType: "member",
      action: "role.assign",
      entityType: "event_role",
      entityId: row.id,
      beforeJson: null,
      afterJson: { role: input.role },
      reason: null,
      requestId: actor.requestId,
    });
    return row;
  }

  invite(actor: Actor, input: {
    eventId: string;
    email: string;
    role: EventRole;
    entryId?: string | null;
    capabilities?: StaffCapability[];
    memberId?: string | null;
  }) {
    const event = this.getEvent(input.eventId);
    this.assertOrganiser(actor, event);
    const email = normalizeEmail(input.email);
    const existingRoles = input.memberId ? this.rolesFor(event.id, input.memberId) : [];
    assertRoleCompatible(existingRoles, input.role);
    if (input.role === "blind_steward") {
      const current = this.store.eventRoles(event.id).filter((r) => r.role === "blind_steward" && r.status === "accepted");
      if (current.length >= 1) {
        throw badRequest("STEWARD_EXISTS", "Exactly one Blind Steward may be active.");
      }
    }
    const token = randomToken();
    const invitation = {
      id: newId(),
      eventId: event.id,
      emailNormalized: email,
      memberId: input.memberId ?? null,
      role: input.role,
      entryId: input.entryId ?? null,
      tokenHash: sha256Hex(token),
      expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      acceptedAt: null,
      revokedAt: null,
    };
    this.store.put(this.store.invitations, invitation);
    this.audit({
      eventId: event.id,
      heatId: null,
      actorMemberId: actor.member.id,
      actorType: "member",
      action: "role.invite",
      entityType: "invitation",
      entityId: invitation.id,
      beforeJson: null,
      afterJson: { role: input.role, email },
      reason: null,
      requestId: actor.requestId,
    });
    return { invitation, token };
  }

  acceptInvite(actor: Actor, token: string) {
    const hash = sha256Hex(token);
    const invitation = [...this.store.invitations.values()].find((i) => i.tokenHash === hash);
    if (!invitation || invitation.revokedAt || invitation.acceptedAt || invitation.expiresAt < new Date()) {
      throw badRequest("INVITE", "Invitation is invalid or expired.");
    }
    if (invitation.emailNormalized && actor.member.emailNormalized && invitation.emailNormalized !== actor.member.emailNormalized) {
      throw forbidden("INVITE_EMAIL", "Sign in with the invited email address.");
    }
    const existing = this.rolesFor(invitation.eventId, actor.member.id);
    assertRoleCompatible(existing, invitation.role);
    invitation.acceptedAt = new Date();
    invitation.memberId = actor.member.id;
    this.store.put(this.store.roles, {
      id: newId(),
      eventId: invitation.eventId,
      memberId: actor.member.id,
      role: invitation.role,
      capabilities: [],
      status: "accepted",
      invitedByMemberId: null,
      acceptedAt: new Date(),
      revokedAt: null,
    });
    if (invitation.entryId) {
      const entry = this.store.entries.get(invitation.entryId);
      if (entry) {
        this.store.put(this.store.entryMembers, {
          id: newId(),
          entryId: entry.id,
          memberId: actor.member.id,
          entryRole:
            invitation.role === "coach"
              ? "coach"
              : invitation.role === "team_member"
                ? "team_member"
                : "competitor",
          permissions: {},
          acceptedAt: new Date(),
        });
        this.refreshEntryStatus(entry);
      }
    }
    return invitation;
  }

  addEntry(actor: Actor, eventId: string, displayName: string, memberIds: string[], coachMemberId?: string) {
    const event = this.getEvent(eventId);
    this.assertOrganiser(actor, event);
    if (event.rosterLockedAt) throw badRequest("ROSTER_LOCKED", "Roster is locked.");
    const entry: Entry = {
      id: newId(),
      eventId,
      entryType: event.participationStructure === "team" ? "team" : "solo",
      displayName,
      seed: null,
      status: "invited",
      checkedInAt: null,
      rulesAcknowledgedAt: null,
      createdAt: new Date(),
    };
    this.store.put(this.store.entries, entry);
    for (const memberId of memberIds) {
      this.store.put(this.store.entryMembers, {
        id: newId(),
        entryId: entry.id,
        memberId,
        entryRole: event.participationStructure === "team" ? "team_member" : "competitor",
        permissions: event.teamPermissions,
        acceptedAt: new Date(),
      });
      this.store.put(this.store.roles, {
        id: newId(),
        eventId,
        memberId,
        role: event.participationStructure === "team" ? "team_member" : "competitor",
        capabilities: [],
        status: "accepted",
        invitedByMemberId: actor.member.id,
        acceptedAt: new Date(),
        revokedAt: null,
      });
    }
    if (coachMemberId) {
      this.store.put(this.store.entryMembers, {
        id: newId(),
        entryId: entry.id,
        memberId: coachMemberId,
        entryRole: "coach",
        permissions: event.coachPermissions,
        acceptedAt: new Date(),
      });
      this.store.put(this.store.roles, {
        id: newId(),
        eventId,
        memberId: coachMemberId,
        role: "coach",
        capabilities: [],
        status: "accepted",
        invitedByMemberId: actor.member.id,
        acceptedAt: new Date(),
        revokedAt: null,
      });
    }
    this.refreshEntryStatus(entry);
    return entry;
  }

  private refreshEntryStatus(entry: Entry): void {
    const members = this.store.membersOfEntry(entry.id).filter((m) => m.entryRole !== "coach");
    const accepted = members.filter((m) => m.acceptedAt);
    const event = this.getEvent(entry.eventId);
    const needed = event.participationStructure === "team" ? 2 : 1;
    if (accepted.length >= needed) entry.status = entry.checkedInAt ? "checked_in" : "complete";
  }

  acknowledgeRules(actor: Actor, eventId: string, entryId: string) {
    const entry = this.store.entries.get(entryId);
    if (!entry || entry.eventId !== eventId) throw notFound("ENTRY", "Entry not found.");
    const linked = this.store.membersOfEntry(entryId).some((m) => m.memberId === actor.member.id);
    if (!linked) throw forbidden("NOT_ENTRY", "You are not on this entry.");
    entry.rulesAcknowledgedAt = new Date();
    return entry;
  }

  checkInEntry(actor: Actor, eventId: string, entryId: string) {
    this.getEvent(eventId);
    const roles = this.rolesFor(eventId, actor.member.id);
    const caps = this.capabilitiesFor(eventId, actor.member.id);
    if (!actor.isPlatformAdmin && !isOrganiser(roles) && !caps.includes("roster_desk")) {
      const linked = this.store.membersOfEntry(entryId).some((m) => m.memberId === actor.member.id);
      if (!linked) throw forbidden("CHECKIN", "Cannot check in this entry.");
    }
    const entry = this.store.entries.get(entryId);
    if (!entry) throw notFound("ENTRY", "Entry not found.");
    if (entry.status !== "complete" && entry.status !== "checked_in") {
      throw badRequest("ENTRY_INCOMPLETE", "Entry members must accept before check-in.");
    }
    entry.status = "checked_in";
    entry.checkedInAt = new Date();
    return entry;
  }

  declareConflict(actor: Actor, input: {
    eventId: string;
    relatedMemberId?: string | null;
    relatedEntryId?: string | null;
    affiliationName?: string | null;
    conflictType: EventConflict["conflictType"];
    notes?: string;
  }) {
    const row = {
      id: newId(),
      eventId: input.eventId,
      memberId: actor.member.id,
      relatedMemberId: input.relatedMemberId ?? null,
      relatedEntryId: input.relatedEntryId ?? null,
      affiliationName: input.affiliationName ?? null,
      conflictType: input.conflictType,
      notes: input.notes ?? null,
      declaredAt: new Date(),
      resolvedAt: null,
      resolvedByMemberId: null,
    };
    this.store.put(this.store.conflicts, row);
    this.audit({
      eventId: input.eventId,
      heatId: null,
      actorMemberId: actor.member.id,
      actorType: "member",
      action: "conflict.declare",
      entityType: "conflict",
      entityId: row.id,
      beforeJson: null,
      afterJson: { type: input.conflictType },
      reason: input.notes ?? null,
      requestId: actor.requestId,
    });
    return row;
  }

  lockRoster(actor: Actor, eventId: string) {
    const event = this.getEvent(eventId);
    this.assertOrganiser(actor, event);
    const payment = this.paymentFor(eventId);
    assertPaidEntitlement(payment?.status ?? "unpaid", "locking the roster");
    const { warnings, canLock } = this.setupWarnings(eventId);
    if (!canLock) {
      throw badRequest("ROSTER_LOCK_BLOCKED", warnings.filter((w) => w.blocking).map((w) => w.message).join(" "));
    }
    assertExactlyOneBlindSteward(
      this.store.eventRoles(eventId).filter((r) => r.role === "blind_steward" && r.status === "accepted").length,
    );
    event.rosterLockedAt = new Date();
    event.status = "roster_locked";
    event.updatedAt = new Date();
    this.audit({
      eventId,
      heatId: null,
      actorMemberId: actor.member.id,
      actorType: "member",
      action: "roster.lock",
      entityType: "event",
      entityId: eventId,
      beforeJson: null,
      afterJson: { lockedAt: event.rosterLockedAt },
      reason: null,
      requestId: actor.requestId,
    });
    return event;
  }

  unlockRoster(actor: Actor, eventId: string, reason: string) {
    if (!actor.isPlatformAdmin) {
      this.assertOrganiser(actor, this.getEvent(eventId));
    }
    const event = this.getEvent(eventId);
    if (event.status === "live") throw badRequest("LIVE", "Do not silently regenerate a live bracket.");
    event.rosterLockedAt = null;
    event.bracketLockedAt = null;
    event.status = "setup";
    this.audit({
      eventId,
      heatId: null,
      actorMemberId: actor.member.id,
      actorType: "member",
      action: "roster.unlock",
      entityType: "event",
      entityId: eventId,
      beforeJson: null,
      afterJson: null,
      reason,
      requestId: actor.requestId,
    });
    return event;
  }

  submitPattern(actor: Actor, eventId: string, input: { title: string; description?: string; storagePath: string; hash: string }) {
    const event = this.getEvent(eventId);
    const roles = this.rolesFor(eventId, actor.member.id);
    const organiser = isOrganiser(roles) || actor.isPlatformAdmin;
    const competitor = roles.includes("competitor") || roles.includes("team_member");
    if (event.patternSubmitterPolicy === "organiser_only" && !organiser) throw forbidden("PATTERN", "Only organisers may submit patterns.");
    if (event.patternSubmitterPolicy === "competitors_only" && !competitor && !organiser) {
      throw forbidden("PATTERN", "Only competitors may submit patterns.");
    }
    const row = {
      id: newId(),
      eventId,
      submittedByMemberId: actor.member.id,
      sourceType: organiser ? ("organiser" as const) : ("competitor" as const),
      title: input.title,
      description: input.description ?? null,
      originalStoragePath: input.storagePath,
      judgingDerivativePath: input.storagePath,
      contentHash: input.hash,
      status: event.patternApprovalRequired && !organiser ? ("pending" as const) : ("approved" as const),
      difficultyLabel: null,
      approvedByMemberId: organiser ? actor.member.id : null,
      approvedAt: event.patternApprovalRequired && !organiser ? null : new Date(),
      rejectionReason: null,
      createdAt: new Date(),
    };
    this.store.put(this.store.patterns, row);
    return row;
  }

  approvePattern(actor: Actor, patternId: string) {
    const pattern = this.store.patterns.get(patternId);
    if (!pattern) throw notFound("PATTERN", "Pattern not found.");
    this.assertOrganiser(actor, this.getEvent(pattern.eventId));
    pattern.status = "approved";
    pattern.approvedAt = new Date();
    pattern.approvedByMemberId = actor.member.id;
    return pattern;
  }

  generateBracket(actor: Actor, eventId: string, method: "random" | "manual" | "imported", manualOrder?: string[]) {
    const event = this.getEvent(eventId);
    this.assertOrganiser(actor, event);
    const payment = this.paymentFor(eventId);
    assertPaidEntitlement(payment?.status ?? "unpaid", "generating a bracket");
    if (!event.rosterLockedAt) throw badRequest("ROSTER", "Lock the roster before generating a bracket.");
    const entries = this.store.eventEntries(eventId).filter((e) => e.status === "complete" || e.status === "checked_in");
    if (entries.length !== event.fieldSize) {
      throw badRequest("FIELD", `Need exactly ${event.fieldSize} complete entries.`);
    }
    const enabledStations = [...this.store.stations.values()].filter((s) => s.eventId === eventId && s.isEnabled);
    if (enabledStations.length !== 1) {
      throw badRequest("STATION", "v1 requires exactly one enabled station.");
    }
    const station = enabledStations[0]!;
    const plan = generateSingleElimination(event.fieldSize);
    const ordered =
      method === "random"
        ? [...entries].sort(() => 0.5 - Math.random())
        : manualOrder
          ? manualOrder.map((id) => entries.find((e) => e.id === id)!).filter(Boolean)
          : [...entries].sort((a, b) => a.displayName.localeCompare(b.displayName));
    if (ordered.length !== entries.length) throw badRequest("SEEDS", "Seed order must include every entry.");
    ordered.forEach((entry, i) => {
      entry.seed = i + 1;
    });
    const seedToEntry = new Map(ordered.map((e, i) => [i + 1, e.id]));
    const bracket = {
      id: newId(),
      eventId,
      version: ([...this.store.brackets.values()].filter((b) => b.eventId === eventId).length || 0) + 1,
      generationMethod: method,
      lockedAt: new Date(),
      createdByMemberId: actor.member.id,
    };
    this.store.put(this.store.brackets, bracket);
    const keyToId = new Map<string, string>();
    for (const node of plan.nodes) {
      keyToId.set(node.key, newId());
    }
    const timing = [...this.store.timings.values()].find((t) => t.eventId === eventId)!;
    const days = [...this.store.days.values()].filter((d) => d.eventId === eventId);
    const actualHeatCount = event.fieldSize - 1;
    const slots = assignSequentialStarts(
      actualHeatCount,
      days.length
        ? days
        : [{ localDate: "2026-01-01", opensAt: new Date(), closesAt: new Date(Date.now() + 86400000 * 3) }],
      timing,
    );
    let heatNumber = 0;
    const createdHeats: Heat[] = [];
    for (const node of plan.nodes) {
      const id = keyToId.get(node.key)!;
      const entryAId = node.seedA ? seedToEntry.get(node.seedA) ?? null : null;
      const entryBId = node.seedB ? seedToEntry.get(node.seedB) ?? null : null;
      const byeEntryId = node.byeSeed ? seedToEntry.get(node.byeSeed) ?? null : null;
      let heatId: string | null = null;
      if (node.needsHeat || (node.roundNumber > 1 && !node.isBye)) {
        if (!(node.roundNumber === 1 && node.isBye)) {
          heatNumber += 1;
          const slot = slots[createdHeats.length];
          const heat: Heat = {
            id: newId(),
            eventId,
            stationId: station.id,
            bracketNodeId: id,
            heatNumber,
            scheduledAt: slot?.estimatedStart ?? null,
            state: "scheduled",
            stateVersion: 0,
            restartNumber: 0,
            patternDrawId: null,
            activeTimerRunId: null,
            judgingRound: "official",
            winnerBlindEntry: null,
            winnerEntryId: null,
            pausedFromState: null,
            finalizedAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          this.store.put(this.store.heats, heat);
          createdHeats.push(heat);
          heatId = heat.id;
        }
      }
      const row: BracketNode = {
        id,
        bracketId: bracket.id,
        roundNumber: node.roundNumber,
        matchNumber: node.matchNumber,
        sourceNodeAId: node.sourceKeyA ? keyToId.get(node.sourceKeyA)! : null,
        sourceNodeBId: node.sourceKeyB ? keyToId.get(node.sourceKeyB)! : null,
        entryAId,
        entryBId,
        winnerEntryId: byeEntryId,
        byeEntryId,
        heatId,
        status: byeEntryId ? "bye" : heatId ? "ready" : "pending",
      };
      this.store.put(this.store.nodes, row);
    }
    this.advanceByes(bracket.id);
    event.bracketLockedAt = new Date();
    event.status = "bracket_ready";
    event.updatedAt = new Date();
    this.audit({
      eventId,
      heatId: null,
      actorMemberId: actor.member.id,
      actorType: "member",
      action: "bracket.lock",
      entityType: "bracket",
      entityId: bracket.id,
      beforeJson: null,
      afterJson: { heats: createdHeats.length, method },
      reason: null,
      requestId: actor.requestId,
    });
    return { bracket, heats: createdHeats.length };
  }

  private advanceByes(bracketId: string) {
    const nodes = [...this.store.nodes.values()].filter((n) => n.bracketId === bracketId);
    for (const node of nodes.filter((n) => n.status === "bye" && n.byeEntryId)) {
      this.placeWinner(node, node.byeEntryId!);
    }
  }

  private placeWinner(node: BracketNode, winnerEntryId: string) {
    node.winnerEntryId = winnerEntryId;
    node.status = node.status === "bye" ? "bye" : "complete";
    const parent = [...this.store.nodes.values()].find(
      (n) => n.sourceNodeAId === node.id || n.sourceNodeBId === node.id,
    );
    if (!parent) return;
    if (parent.sourceNodeAId === node.id) parent.entryAId = winnerEntryId;
    if (parent.sourceNodeBId === node.id) parent.entryBId = winnerEntryId;
    if (parent.entryAId && parent.entryBId) parent.status = "ready";
  }

  enabledStation(eventId: string) {
    const stations = [...this.store.stations.values()].filter((s) => s.eventId === eventId && s.isEnabled);
    if (stations.length !== 1) throw badRequest("STATION", "v1 requires exactly one enabled station.");
    return stations[0]!;
  }

  startHeat(actor: Actor, heatId: string) {
    const heat = this.store.heats.get(heatId);
    if (!heat) throw notFound("HEAT", "Heat not found.");
    const event = this.getEvent(heat.eventId);
    this.assertOrganiser(actor, event);
    const payment = this.paymentFor(event.id);
    assertPaidEntitlement(payment?.status ?? "unpaid", "starting a heat");
    return this.store.withLock(`event:${event.id}`, () => {
      const lock = this.store.locks.get(event.id)!;
      assertCanStartHeat({ existingActiveHeatId: lock.activeHeatId, nextHeatId: heat.id });
      const node = this.store.nodes.get(heat.bracketNodeId)!;
      if (!node.entryAId || !node.entryBId) {
        throw badRequest("FEEDER", "This heat cannot start until both entries are known.");
      }
      assertHeatTransition(heat.state, "check_in", { format: event.competitionFormat });
      heat.state = "check_in";
      heat.stateVersion += 1;
      heat.updatedAt = new Date();
      lock.activeHeatId = heat.id;
      lock.version += 1;
      const mapping = generateBlindMapping([node.entryAId, node.entryBId]);
      this.store.put(this.store.mappings, {
        id: newId(),
        heatId: heat.id,
        mappingVersion: mapping.mappingVersion,
        entryAId: mapping.entryAId,
        entryBId: mapping.entryBId,
        generatedAt: new Date(),
        voidedAt: null,
      });
      if (event.equipmentMode === "central_shot_service") {
        for (const entryId of [node.entryAId, node.entryBId]) {
          this.store.put(this.store.shots, {
            id: newId(),
            heatId: heat.id,
            entryId,
            status: "queued",
            updatedAt: new Date(),
          });
        }
      }
      if (event.status === "bracket_ready") event.status = "live";
      this.audit({
        eventId: event.id,
        heatId: heat.id,
        actorMemberId: actor.member.id,
        actorType: "member",
        action: "heat.start",
        entityType: "heat",
        entityId: heat.id,
        beforeJson: null,
        afterJson: { state: heat.state },
        reason: null,
        requestId: actor.requestId,
      });
      return heat;
    });
  }

  transitionHeat(actor: Actor, heatId: string, to: HeatState) {
    const heat = this.store.heats.get(heatId);
    if (!heat) throw notFound("HEAT", "Heat not found.");
    const event = this.getEvent(heat.eventId);
    this.assertOrganiser(actor, event);
    const node = this.store.nodes.get(heat.bracketNodeId)!;
    const photos = this.store.activePhotos(heat.id);
    const mapping = this.store.activeMapping(heat.id);
    const bothChecked =
      Boolean(this.store.entries.get(node.entryAId ?? "")?.checkedInAt) &&
      Boolean(this.store.entries.get(node.entryBId ?? "")?.checkedInAt);
    assertHeatTransition(heat.state, to, {
      format: event.competitionFormat,
      bothCheckedIn: bothChecked || heat.state !== "check_in",
      patternDrawn: Boolean(heat.patternDrawId),
      bothPhotosSubmitted: mapping
        ? bothPhotosReady(photos, [mapping.entryAId, mapping.entryBId])
        : bothPhotosReady(photos, [node.entryAId!, node.entryBId!]),
      requiredBallotsComplete: true,
      unresolvedIncident: [...this.store.incidents.values()].some(
        (i) => i.heatId === heat.id && i.status === "open",
      ),
    });
    if (to === "pattern_reveal") this.drawForHeat(actor, heat, event);
    if (to === "judging_open") this.openJudging(actor, heat, event);
    if (heat.state !== "paused" && to === "paused") heat.pausedFromState = heat.state;
    if (heat.state === "paused" && to !== "paused") heat.pausedFromState = null;
    heat.state = to;
    heat.stateVersion += 1;
    heat.updatedAt = new Date();
    return heat;
  }

  private drawForHeat(actor: Actor, heat: Heat, event: WlatEvent) {
    if (event.competitionFormat !== "match_pattern") return;
    if (heat.patternDrawId) return;
    const approved = [...this.store.patterns.values()].filter((p) => p.eventId === event.id && p.status === "approved");
    const previous = [...this.store.draws.values()]
      .filter((d) => d.eventId === event.id && !d.voidedAt)
      .map((d) => d.selectedPatternSubmissionId);
    const result = drawPattern({
      approvedPatternIds: approved.map((p) => p.id),
      previouslySelectedIds: previous,
      allowRepeat: event.patternRepeatsAllowed,
    });
    const draw = {
      id: newId(),
      eventId: event.id,
      heatId: heat.id,
      eligiblePatternIdsSnapshot: result.eligiblePatternIds,
      selectedPatternSubmissionId: result.selectedPatternId,
      randomDrawVersion: result.randomDrawVersion,
      drawnAt: new Date(),
      drawnByMemberId: actor.member.id,
      voidedAt: null,
      voidReason: null,
    };
    this.store.put(this.store.draws, draw);
    heat.patternDrawId = draw.id;
    this.audit({
      eventId: event.id,
      heatId: heat.id,
      actorMemberId: actor.member.id,
      actorType: "member",
      action: "pattern.draw",
      entityType: "pattern_draw",
      entityId: draw.id,
      beforeJson: { eligible: result.eligiblePatternIds.length },
      afterJson: { selected: true },
      reason: null,
      requestId: actor.requestId,
    });
  }

  redrawPattern(actor: Actor, heatId: string, reason: string) {
    const heat = this.store.heats.get(heatId);
    if (!heat) throw notFound("HEAT", "Heat not found.");
    this.assertOrganiser(actor, this.getEvent(heat.eventId));
    assertCanRedraw(reason);
    const existing = heat.patternDrawId ? this.store.draws.get(heat.patternDrawId) : null;
    if (existing) {
      existing.voidedAt = new Date();
      existing.voidReason = reason;
    }
    heat.patternDrawId = null;
    this.drawForHeat(actor, heat, this.getEvent(heat.eventId));
    return heat;
  }

  operateTimer(actor: Actor, heatId: string, action: "start" | "pause" | "resume" | "finish", phase: TimerPhase, version: number, reason?: string) {
    const heat = this.store.heats.get(heatId);
    if (!heat) throw notFound("HEAT", "Heat not found.");
    const event = this.getEvent(heat.eventId);
    const roles = this.rolesFor(event.id, actor.member.id);
    const caps = this.capabilitiesFor(event.id, actor.member.id);
    if (!actor.isPlatformAdmin && !canOperateTimer(roles, caps) && !isOrganiser(roles)) {
      throw forbidden("TIMER", "Not authorised to operate the timer.");
    }
    return this.store.withLock(`timer:${event.id}`, () => {
      const lock = this.store.locks.get(event.id)!;
      if (lock.activeHeatId && lock.activeHeatId !== heat.id) {
        throw badRequest("ONE_ACTIVE_HEAT", "Another heat holds the timer lease.");
      }
      const timing = [...this.store.timings.values()].find((t) => t.eventId === event.id)!;
      const now = new Date();
      let run = heat.activeTimerRunId ? this.store.timers.get(heat.activeTimerRunId) : undefined;
      if (action === "start") {
        if (run && run.status === "running") throw badRequest("TIMER", "Timer already running.");
        run = {
          id: newId(),
          heatId: heat.id,
          phase,
          status: "pending",
          startedAt: null,
          expectedEndAt: null,
          pausedAt: null,
          accumulatedPauseMs: 0,
          endedAt: null,
          version: 0,
          operatedByMemberId: actor.member.id,
          voidedAt: null,
          voidReason: null,
        };
        const started = startRun(timerSnap(run), now, timing[`${phase}Seconds` as const] * 1000, 0);
        Object.assign(run, started);
        this.store.put(this.store.timers, run);
        heat.activeTimerRunId = run.id;
        lock.activeTimerRunId = run.id;
        lock.activeHeatId = heat.id;
      } else {
        if (!run) throw badRequest("TIMER", "No timer run.");
        const snap = timerSnap(run);
        const next =
          action === "pause"
            ? pauseRun(snap, now, version)
            : action === "resume"
              ? resumeRun(snap, now, version)
              : finishRun(snap, now, version);
        Object.assign(run, next);
        if (action === "pause" && (!reason || reason.trim().length < 4)) {
          throw badRequest("PAUSE_REASON", "Pausing requires a reason.");
        }
      }
      this.audit({
        eventId: event.id,
        heatId: heat.id,
        actorMemberId: actor.member.id,
        actorType: "member",
        action: `timer.${action}`,
        entityType: "timer_run",
        entityId: run!.id,
        beforeJson: { version },
        afterJson: { status: run!.status, phase: run!.phase },
        reason: reason ?? null,
        requestId: actor.requestId,
      });
      return run!;
    });
  }

  timerDisplay(heatId: string) {
    const heat = this.store.heats.get(heatId);
    if (!heat?.activeTimerRunId) return null;
    const run = this.store.timers.get(heat.activeTimerRunId);
    if (!run) return null;
    return toTimerDisplay(timerSnap(run), new Date());
  }

  revealMapping(actor: Actor, heatId: string, reason: string) {
    const heat = this.store.heats.get(heatId);
    if (!heat) throw notFound("HEAT", "Heat not found.");
    const roles = this.rolesFor(heat.eventId, actor.member.id);
    if (!canViewBlindMapping(roles, actor.isPlatformAdmin)) {
      throw forbidden("MAPPING", "Only the Blind Steward or Platform Admin may view the mapping.");
    }
    if (!actor.isPlatformAdmin) {
      const last = actor.mappingReauthedAt;
      if (!last || Date.now() - last.getTime() > 15 * 60 * 1000) {
        throw forbidden("REAUTH", "Re-authenticate before revealing a mapping on this device.");
      }
    }
    const mapping = this.store.activeMapping(heat.id);
    if (!mapping) throw notFound("MAPPING", "No mapping for this heat.");
    this.store.put(this.store.mappingLogs, {
      id: newId(),
      heatBlindMappingId: mapping.id,
      memberId: actor.member.id,
      accessedAt: new Date(),
      accessReason: reason,
      sessionFingerprint: actor.sessionFingerprint ?? null,
    });
    this.audit({
      eventId: heat.eventId,
      heatId: heat.id,
      actorMemberId: actor.member.id,
      actorType: "member",
      action: "mapping.reveal",
      entityType: "heat_blind_mapping",
      entityId: mapping.id,
      beforeJson: null,
      afterJson: { accessed: true },
      reason,
      requestId: actor.requestId,
    });
    const placement = physicalPlacementHint(mapping.mappingVersion, heat.id);
    return {
      heatId: heat.id,
      entryAId: mapping.entryAId,
      entryBId: mapping.entryBId,
      placement,
      blindnessChecklist: [
        "Screens facing the audience must not show competitor names beside A/B.",
        "Do not announce who poured which cup.",
        "Deliver cups without walking a predictable left-to-right identity order.",
        "Judge seating must not face the stage in a way that reveals pourers.",
        "File names and camera previews stay off judge devices.",
        "Photography backdrops must not include names, flags, or affiliations.",
      ],
    };
  }

  reportBreach(actor: Actor, heatId: string, description: string) {
    const heat = this.store.heats.get(heatId);
    if (!heat) throw notFound("HEAT", "Heat not found.");
    const incident = {
      id: newId(),
      eventId: heat.eventId,
      heatId: heat.id,
      incidentType: "blindness_breach" as const,
      severity: "high" as const,
      status: "open" as const,
      description,
      reportedByMemberId: actor.member.id,
      resolvedByMemberId: null,
      resolution: null,
      createdAt: new Date(),
      resolvedAt: null,
    };
    this.store.put(this.store.incidents, incident);
    this.audit({
      eventId: heat.eventId,
      heatId: heat.id,
      actorMemberId: actor.member.id,
      actorType: "member",
      action: "incident.blindness_breach",
      entityType: "incident",
      entityId: incident.id,
      beforeJson: null,
      afterJson: null,
      reason: description,
      requestId: actor.requestId,
    });
    return incident;
  }

  beginPhotoUpload(actor: Actor, heatId: string, entryId: string, filename: string, mimeType: string, byteLength: number) {
    assertImageUpload({ mimeType, byteLength, originalFilename: filename });
    const heat = this.store.heats.get(heatId);
    if (!heat) throw notFound("HEAT", "Heat not found.");
    if (heat.state !== "photography" && heat.state !== "awaiting_uploads") {
      throw badRequest("PHOTO_PHASE", "Photography is not open.");
    }
    const linked = this.store.membersOfEntry(entryId).some((m) => m.memberId === actor.member.id);
    const roles = this.rolesFor(heat.eventId, actor.member.id);
    const caps = this.capabilitiesFor(heat.eventId, actor.member.id);
    if (!linked && !caps.includes("photo_support") && !isOrganiser(roles) && !actor.isPlatformAdmin) {
      throw forbidden("PHOTO", "You cannot upload for this entry.");
    }
    const existing = this.store.activePhotos(heat.id).find((p) => p.entryId === entryId);
    if (existing) {
      existing.voidedAt = new Date();
      existing.replacedAt = new Date();
      existing.voidReason = "replaced_during_photography";
    }
    const id = newId();
    const ext = mimeToExt(mimeType);
    const path = safeObjectKey({ eventId: heat.eventId, heatId: heat.id, kind: "original", id, ext });
    const photo = {
      id,
      heatId: heat.id,
      entryId,
      uploadedByMemberId: actor.member.id,
      originalStoragePath: path,
      judgingStoragePath: null,
      publicStoragePath: null,
      originalFilenameHash: hashFilename(filename),
      contentHash: null,
      mimeType,
      width: null,
      height: null,
      processingStatus: "pending" as const,
      submissionStatus: "pending_upload" as const,
      submittedAt: null,
      replacedAt: null,
      voidedAt: null,
      voidReason: null,
      restartNumber: heat.restartNumber,
    };
    this.store.put(this.store.photos, photo);
    return { photo, uploadPath: path, expiresIn: SIGNED_URL_TTL_SECONDS };
  }

  completePhotoUpload(_actor: Actor, photoId: string, bytes: Uint8Array) {
    const photo = this.store.photos.get(photoId);
    if (!photo) throw notFound("PHOTO", "Upload not found.");
    const sniffed = sniffImageMime(bytes);
    if (!sniffed || sniffed !== photo.mimeType) {
      throw badRequest("IMAGE_CONTENT", "File content does not match the declared type.");
    }
    photo.contentHash = sha256Hex(Buffer.from(bytes));
    photo.processingStatus = "ready";
    photo.submissionStatus = "submitted";
    photo.submittedAt = new Date();
    photo.judgingStoragePath = photo.originalStoragePath?.replace("/original/", "/judging/") ?? null;
    return photo;
  }

  private openJudging(_actor: Actor, heat: Heat, event: WlatEvent) {
    const mapping = this.store.activeMapping(heat.id);
    if (!mapping) throw badRequest("MAPPING", "Mapping required before judging.");
    const photos = this.store.activePhotos(heat.id);
    if (!bothPhotosReady(photos, [mapping.entryAId, mapping.entryBId])) {
      throw badRequest("PHOTOS", "Both entries must submit a verified photograph.");
    }
    const existing = [...this.store.rounds.values()].find((r) => r.heatId === heat.id && r.status !== "closed");
    if (existing) return existing;
    const official = event.votingModel === "official_panel";
    const round = {
      id: newId(),
      heatId: heat.id,
      roundType: official ? ("official" as const) : ("open_member" as const),
      status: "open" as const,
      targetBallots: official ? event.officialJudgeCount : event.openMemberTargetBallots,
      minimumBallots: official ? event.officialJudgeCount : event.openMemberMinimumBallots,
      opensAt: new Date(),
      closesAt: official ? null : new Date(Date.now() + event.openMemberWindowSeconds * 1000),
      closedAt: null,
      resultBlindEntry: null,
    };
    this.store.put(this.store.rounds, round);
    if (official) {
      const judges = this.store.eventRoles(event.id).filter((r) => r.role === "judge" && r.status === "accepted");
      for (const judge of judges) {
        this.store.put(this.store.assignments, {
          id: newId(),
          eventId: event.id,
          heatId: heat.id,
          memberId: judge.memberId,
          assignmentType: "official",
          status: "assigned",
          conflictCheckedAt: new Date(),
        });
      }
    }
    return round;
  }

  judgeBallotDto(actor: Actor, heatId: string) {
    const heat = this.store.heats.get(heatId);
    if (!heat) throw notFound("HEAT", "Heat not found.");
    if (heat.state !== "judging_open") throw badRequest("NOT_OPEN", "Judging is not open.");
    const event = this.getEvent(heat.eventId);
    const round = [...this.store.rounds.values()].find((r) => r.heatId === heat.id && r.status === "open");
    if (!round) throw badRequest("ROUND", "No open ballot round.");
    const mapping = this.store.activeMapping(heat.id)!;
    const photos = this.store.activePhotos(heat.id);
    const order = presentationOrder(this.secrets.mappingHmac, heat.id, round.id, actor.member.id);
    const photoFor = (entryId: string) => photos.find((p) => p.entryId === entryId && p.submissionStatus === "submitted");
    const draw = heat.patternDrawId ? this.store.draws.get(heat.patternDrawId) : null;
    const pattern = draw ? this.store.patterns.get(draw.selectedPatternSubmissionId) : null;
    return {
      heatId: heat.id,
      roundId: round.id,
      prompt: judgingPrompt(event.competitionFormat),
      format: event.competitionFormat,
      presentationOrder: order,
      closesAt: round.closesAt,
      referencePattern: pattern
        ? { id: pattern.id, title: "Reference pattern", imagePath: pattern.judgingDerivativePath }
        : null,
      entries: order.map((label) => ({
        label,
        imagePath:
          event.judgingDeliveryMode === "online"
            ? photoFor(label === "A" ? mapping.entryAId : mapping.entryBId)?.judgingStoragePath ?? null
            : null,
        alt: `Latte art Entry ${label}`,
      })),
    };
  }

  submitBallot(actor: Actor, input: { heatId: string; roundId: string; choice: BlindEntry; feedback: string }) {
    const heat = this.store.heats.get(input.heatId);
    if (!heat) throw notFound("HEAT", "Heat not found.");
    if (heat.state !== "judging_open") throw badRequest("NOT_OPEN", "Judging is not open.");
    const event = this.getEvent(heat.eventId);
    const round = this.store.rounds.get(input.roundId);
    if (!round || round.heatId !== heat.id || round.status !== "open") {
      throw badRequest("ROUND", "Ballot round is not open.");
    }
    const feedback = validateFeedback(input.feedback);
    const roles = this.rolesFor(event.id, actor.member.id);
    if (roles.includes("blind_steward")) throw forbidden("STEWARD_VOTE", "The Blind Steward cannot vote.");
    if (round.roundType === "official" || round.roundType === "tiebreak") {
      const needed = round.roundType === "tiebreak" ? "tiebreak_judge" : "judge";
      if (!roles.includes(needed) && !roles.includes("judge")) {
        throw forbidden("NOT_JUDGE", "You are not assigned to this ballot.");
      }
      const node = this.store.nodes.get(heat.bracketNodeId)!;
      const heatMemberIds = [node.entryAId, node.entryBId].flatMap((id) =>
        id ? this.store.membersOfEntry(id).map((m) => m.memberId) : [],
      );
      const coached = this.store.eventRoles(event.id).some((r) => r.memberId === actor.member.id && r.role === "coach");
      const coachedEntries = [...this.store.entryMembers.values()]
        .filter((m) => m.memberId === actor.member.id && m.entryRole === "coach")
        .map((m) => m.entryId);
      if (
        judgeHasHeatConflict({
          judgeMemberId: actor.member.id,
          heatEntryMemberIds: heatMemberIds,
          coachedEntryIds: coached ? coachedEntries : [],
          heatEntryIds: [node.entryAId, node.entryBId].filter(Boolean) as string[],
          affiliationNames: actor.member.affiliationName ? [actor.member.affiliationName] : [],
          heatAffiliationNames: [],
          declaredConflicts: [...this.store.conflicts.values()].filter((c) => c.memberId === actor.member.id && !c.resolvedAt),
        })
      ) {
        throw forbidden("CONFLICT", "A declared or detected conflict blocks this ballot. Replace the judge before judging opens.");
      }
    }
    const dup = [...this.store.ballots.values()].find(
      (b) =>
        b.ballotRoundId === round.id &&
        b.voterMemberId === actor.member.id &&
        b.status === "submitted",
    );
    if (dup) throw badRequest("DUPLICATE_BALLOT", "You already submitted a ballot for this round.");
    const order = presentationOrder(this.secrets.mappingHmac, heat.id, round.id, actor.member.id);
    const mapping = this.store.activeMapping(heat.id)!;
    const photos = this.store.activePhotos(heat.id);
    const ballot: Ballot = {
      id: newId(),
      ballotRoundId: round.id,
      heatId: heat.id,
      voterMemberId: actor.member.id,
      selectedBlindEntry: input.choice,
      feedbackText: feedback,
      presentationOrder: order,
      referencePatternSubmissionId: heat.patternDrawId
        ? this.store.draws.get(heat.patternDrawId)?.selectedPatternSubmissionId ?? null
        : null,
      judgingPhotoAId: photos.find((p) => p.entryId === mapping.entryAId)?.id ?? null,
      judgingPhotoBId: photos.find((p) => p.entryId === mapping.entryBId)?.id ?? null,
      submittedAt: new Date(),
      status: "submitted",
      voidedAt: null,
      voidReason: null,
    };
    this.store.put(this.store.ballots, ballot);
    const flags = feedbackQualityFlags({
      text: feedback,
      submittedAt: ballot.submittedAt,
      openedAt: round.opensAt,
      previousTexts: [...this.store.ballots.values()]
        .filter((b) => b.voterMemberId === actor.member.id && b.id !== ballot.id)
        .map((b) => b.feedbackText),
    });
    for (const flag of flags) {
      this.store.put(this.store.flags, {
        id: newId(),
        ballotId: ballot.id,
        flagType: flag.flag,
        flagSource: "system",
        details: { details: flag.details },
        reviewedByMemberId: null,
        reviewedAt: null,
        resolution: null,
      });
    }
    this.maybeCloseRound(event, heat, round);
    return { ballotId: ballot.id, recorded: true };
  }

  private maybeCloseRound(event: WlatEvent, heat: Heat, round: BallotRound) {
    const valid = [...this.store.ballots.values()].filter(
      (b) => b.ballotRoundId === round.id && b.status === "submitted",
    );
    if (round.roundType === "official" || round.roundType === "tiebreak") {
      if (officialPanelComplete(round.targetBallots, valid.length)) {
        round.status = "closed";
        round.closedAt = new Date();
        heat.state = "judging_closed";
        heat.stateVersion += 1;
      }
      return;
    }
    const windowEnded = Boolean(round.closesAt && round.closesAt <= new Date());
    const close = openMemberShouldClose({
      validBallots: valid.length,
      targetBallots: round.targetBallots,
      windowEnded,
    });
    if (!close.close) return;
    const tally = tallyBlindVotes(valid.map((b) => b.selectedBlindEntry));
    const targetReached = valid.length >= round.targetBallots;
    if (openMemberNeedsTiebreak(tally, windowEnded || targetReached, targetReached && tally.winner !== "tie")) {
      round.status = "closed";
      round.closedAt = new Date();
      const tie = {
        id: newId(),
        heatId: heat.id,
        roundType: "tiebreak" as const,
        status: "open" as const,
        targetBallots: 3,
        minimumBallots: 3,
        opensAt: new Date(),
        closesAt: null,
        closedAt: null,
        resultBlindEntry: null,
      };
      this.store.put(this.store.rounds, tie);
      const judges = this.store.eventRoles(event.id).filter((r) => r.role === "tiebreak_judge" && r.status === "accepted").slice(0, 3);
      for (const judge of judges) {
        this.store.put(this.store.assignments, {
          id: newId(),
          eventId: event.id,
          heatId: heat.id,
          memberId: judge.memberId,
          assignmentType: "tiebreak",
          status: "assigned",
          conflictCheckedAt: new Date(),
        });
      }
      return;
    }
    round.status = "closed";
    round.closedAt = new Date();
    heat.state = "judging_closed";
    heat.stateVersion += 1;
  }

  closeExpiredOpenMemberRounds(): void {
    const now = new Date();
    for (const round of this.store.rounds.values()) {
      if (round.roundType !== "open_member" || round.status !== "open" || !round.closesAt) continue;
      if (round.closesAt > now) continue;
      const heat = this.store.heats.get(round.heatId);
      if (!heat) continue;
      this.maybeCloseRound(this.getEvent(heat.eventId), heat, round);
    }
  }

  finalizeHeat(actor: Actor, heatId: string) {
    const heat = this.store.heats.get(heatId);
    if (!heat) throw notFound("HEAT", "Heat not found.");
    const event = this.getEvent(heat.eventId);
    this.assertOrganiser(actor, event);
    return this.store.withLock(`final:${heat.id}`, () => {
      if (heat.finalizedAt && heat.winnerEntryId) {
        return this.store.results.get([...this.store.results.values()].find((r) => r.heatId === heat.id && !r.supersededAt)?.id ?? "") ?? heat;
      }
      if ([...this.store.incidents.values()].some((i) => i.heatId === heat.id && i.status === "open")) {
        throw badRequest("INCIDENT", "Resolve open incidents before finalisation.");
      }
      const round =
        [...this.store.rounds.values()].find((r) => r.heatId === heat.id && r.roundType === "tiebreak" && r.status === "closed") ??
        [...this.store.rounds.values()].find((r) => r.heatId === heat.id && r.status === "closed");
      if (!round) throw badRequest("BALLOTS", "Judging is not complete.");
      const votes = [...this.store.ballots.values()].filter((b) => b.ballotRoundId === round.id && b.status === "submitted");
      if (round.roundType !== "open_member" && votes.length !== round.targetBallots) {
        throw badRequest("BALLOTS", "All required ballots must be submitted.");
      }
      const tally = tallyBlindVotes(votes.map((v) => v.selectedBlindEntry));
      const winnerBlind = majorityWinner(tally);
      const mapping = this.store.activeMapping(heat.id);
      if (!mapping) throw badRequest("MAPPING", "Missing mapping.");
      const winnerEntryId = resolveWinnerEntry(mapping, winnerBlind);
      const loserEntryId = resolveLoserEntry(mapping, winnerBlind);
      const existingWinner = heat.winnerEntryId;
      if (existingWinner && existingWinner !== winnerEntryId) {
        throw badRequest("DOUBLE_ADVANCE", "This heat already advanced a different winner.");
      }
      heat.winnerBlindEntry = winnerBlind;
      heat.winnerEntryId = winnerEntryId;
      heat.state = "finalized";
      heat.finalizedAt = new Date();
      heat.stateVersion += 1;
      const result = {
        id: newId(),
        heatId: heat.id,
        resultVersion: 1,
        winningBlindEntry: winnerBlind,
        winnerEntryId,
        loserEntryId,
        voteACount: tally.voteA,
        voteBCount: tally.voteB,
        decidingBallotRoundId: round.id,
        resolutionType: round.roundType === "tiebreak" ? ("tiebreak" as const) : ("majority" as const),
        finalizedByMemberId: actor.member.id,
        finalizedAt: new Date(),
        supersededAt: null,
      };
      this.store.put(this.store.results, result);
      const node = this.store.nodes.get(heat.bracketNodeId)!;
      this.placeWinner(node, winnerEntryId);
      const lock = this.store.locks.get(event.id)!;
      if (lock.activeHeatId === heat.id) {
        lock.activeHeatId = null;
        lock.activeTimerRunId = null;
        lock.version += 1;
      }
      this.audit({
        eventId: event.id,
        heatId: heat.id,
        actorMemberId: actor.member.id,
        actorType: "member",
        action: "heat.finalize",
        entityType: "heat_result",
        entityId: result.id,
        beforeJson: { votes: votes.length },
        afterJson: { winnerEntryId: true, resolution: result.resolutionType },
        reason: null,
        requestId: actor.requestId,
      });
      return result;
    });
  }

  restartHeat(actor: Actor, heatId: string, reason: RestartReasonType, notes: string, patternInvalid = false) {
    const heat = this.store.heats.get(heatId);
    if (!heat) throw notFound("HEAT", "Heat not found.");
    const event = this.getEvent(heat.eventId);
    this.assertOrganiser(actor, event);
    assertRestartEligible({
      reason,
      notes,
      existingRestartCount: heat.restartNumber,
      isPlatformAdmin: actor.isPlatformAdmin,
    });
    const voids = restartVoids({ patternInvalid });
    if (voids.voidTimer && heat.activeTimerRunId) {
      const run = this.store.timers.get(heat.activeTimerRunId);
      if (run) {
        run.status = "voided";
        run.voidedAt = new Date();
        run.voidReason = notes;
      }
    }
    if (voids.voidPhotos) {
      for (const photo of this.store.activePhotos(heat.id)) {
        photo.voidedAt = new Date();
        photo.voidReason = "restart";
      }
    }
    if (voids.voidBallots) {
      for (const ballot of [...this.store.ballots.values()].filter((b) => b.heatId === heat.id)) {
        ballot.status = "voided";
        ballot.voidedAt = new Date();
        ballot.voidReason = "restart";
      }
      for (const round of [...this.store.rounds.values()].filter((r) => r.heatId === heat.id)) {
        round.status = "closed";
        round.closedAt = new Date();
      }
    }
    if (voids.voidPattern && heat.patternDrawId) {
      const draw = this.store.draws.get(heat.patternDrawId);
      if (draw) {
        draw.voidedAt = new Date();
        draw.voidReason = notes;
      }
      heat.patternDrawId = null;
    }
    if (voids.voidMapping) {
      const mapping = this.store.activeMapping(heat.id);
      if (mapping) mapping.voidedAt = new Date();
    }
    heat.restartNumber += 1;
    heat.state = "restart_pending";
    heat.winnerBlindEntry = null;
    heat.winnerEntryId = null;
    heat.finalizedAt = null;
    this.store.put(this.store.restarts, {
      id: newId(),
      heatId: heat.id,
      restartNumber: heat.restartNumber,
      reasonType: reason,
      reasonNotes: notes,
      approvedByMemberId: actor.member.id,
      createdAt: new Date(),
    });
    heat.state = "check_in";
    const node = this.store.nodes.get(heat.bracketNodeId)!;
    if (node.entryAId && node.entryBId) {
      const mapping = generateBlindMapping([node.entryAId, node.entryBId]);
      this.store.put(this.store.mappings, {
        id: newId(),
        heatId: heat.id,
        mappingVersion: mapping.mappingVersion,
        entryAId: mapping.entryAId,
        entryBId: mapping.entryBId,
        generatedAt: new Date(),
        voidedAt: null,
      });
    }
    this.audit({
      eventId: event.id,
      heatId: heat.id,
      actorMemberId: actor.member.id,
      actorType: "member",
      action: "heat.restart",
      entityType: "heat_restart",
      entityId: heat.id,
      beforeJson: { restartNumber: heat.restartNumber - 1 },
      afterJson: { restartNumber: heat.restartNumber },
      reason: notes,
      requestId: actor.requestId,
    });
    return heat;
  }

  manualOverride(actor: Actor, heatId: string, winnerEntryId: string, reason: string) {
    if (!actor.isPlatformAdmin) throw forbidden("ADMIN_ONLY", "Manual result override is Platform Admin only.");
    const heat = this.store.heats.get(heatId);
    if (!heat) throw notFound("HEAT", "Heat not found.");
    const mapping = this.store.activeMapping(heat.id);
    const winnerBlind: BlindEntry | null = mapping
      ? mapping.entryAId === winnerEntryId
        ? "A"
        : "B"
      : null;
    heat.winnerEntryId = winnerEntryId;
    heat.winnerBlindEntry = winnerBlind;
    heat.state = "finalized";
    heat.finalizedAt = new Date();
    const node = this.store.nodes.get(heat.bracketNodeId)!;
    this.placeWinner(node, winnerEntryId);
    const result = {
      id: newId(),
      heatId: heat.id,
      resultVersion: 1,
      winningBlindEntry: winnerBlind ?? "A",
      winnerEntryId,
      loserEntryId: mapping ? (winnerEntryId === mapping.entryAId ? mapping.entryBId : mapping.entryAId) : "",
      voteACount: 0,
      voteBCount: 0,
      decidingBallotRoundId: "",
      resolutionType: "manual_override" as const,
      finalizedByMemberId: actor.member.id,
      finalizedAt: new Date(),
      supersededAt: null,
    };
    this.store.put(this.store.results, result);
    this.audit({
      eventId: heat.eventId,
      heatId: heat.id,
      actorMemberId: actor.member.id,
      actorType: "member",
      action: "result.manual_override",
      entityType: "heat_result",
      entityId: result.id,
      beforeJson: null,
      afterJson: { manual: true },
      reason,
      requestId: actor.requestId,
    });
    return result;
  }

  completeEvent(actor: Actor, eventId: string) {
    const event = this.getEvent(eventId);
    this.assertOrganiser(actor, event);
    const heats = this.store.eventHeats(eventId);
    if (heats.some((h) => h.state !== "finalized" && h.state !== "void")) {
      throw badRequest("HEATS_OPEN", "Finalise or void every heat before completing the event.");
    }
    event.status = "completed";
    event.completedAt = new Date();
    event.publishedAt = new Date();
    event.updatedAt = new Date();
    this.publishArchives(event);
    this.audit({
      eventId,
      heatId: null,
      actorMemberId: actor.member.id,
      actorType: "member",
      action: "event.complete",
      entityType: "event",
      entityId: eventId,
      beforeJson: null,
      afterJson: { publishedAt: event.publishedAt },
      reason: null,
      requestId: actor.requestId,
    });
    return event;
  }

  private publishArchives(event: WlatEvent) {
    const bracket = [...this.store.brackets.values()].find((b) => b.eventId === event.id);
    const nodes = bracket ? [...this.store.nodes.values()].filter((n) => n.bracketId === bracket.id) : [];
    const champion = nodes.find((n) => n.roundNumber === Math.max(...nodes.map((x) => x.roundNumber)))?.winnerEntryId;
    for (const heat of this.store.eventHeats(event.id)) {
      if (heat.state !== "finalized") continue;
      const node = this.store.nodes.get(heat.bracketNodeId);
      const photos = this.store.activePhotos(heat.id);
      for (const photo of photos) {
        const members = this.store.membersOfEntry(photo.entryId);
        const opponent =
          node?.entryAId === photo.entryId ? node.entryBId : node?.entryAId ?? null;
        const outcome =
          photo.entryId === champion ? "champion" : photo.entryId === heat.winnerEntryId ? "win" : "loss";
        photo.publicStoragePath = photo.judgingStoragePath;
        for (const member of members.filter((m) => m.entryRole !== "coach")) {
          this.store.put(this.store.archives, {
            id: newId(),
            memberId: member.memberId,
            eventId: event.id,
            heatId: heat.id,
            entryId: photo.entryId,
            photoId: photo.id,
            opponentEntryId: opponent,
            format: event.competitionFormat,
            patternId: heat.patternDrawId
              ? this.store.draws.get(heat.patternDrawId)?.selectedPatternSubmissionId ?? null
              : null,
            outcome,
            roundName: node
              ? roundDisplayName(
                  node.roundNumber,
                  Math.max(...nodes.map((n) => n.roundNumber)),
                )
              : `Heat ${heat.heatNumber}`,
            publishedAt: event.publishedAt!,
          });
        }
      }
    }
  }

  publicEventDto(slug: string) {
    const event = this.getEventBySlug(slug);
    const payment = this.paymentFor(event.id);
    const heats = this.store.eventHeats(event.id).sort((a, b) => a.heatNumber - b.heatNumber);
    const lock = this.store.locks.get(event.id);
    const active = lock?.activeHeatId ? this.store.heats.get(lock.activeHeatId) : undefined;
    const entries = this.store.eventEntries(event.id);
    const entryName = (id: string | null) => entries.find((e) => e.id === id)?.displayName ?? "TBD";
    const bracket = [...this.store.brackets.values()].find((b) => b.eventId === event.id);
    const nodes = bracket
      ? [...this.store.nodes.values()]
          .filter((n) => n.bracketId === bracket.id)
          .map((n) => ({
            id: n.id,
            roundNumber: n.roundNumber,
            matchNumber: n.matchNumber,
            roundName: roundDisplayName(
              n.roundNumber,
              Math.max(...[...this.store.nodes.values()].filter((x) => x.bracketId === bracket.id).map((x) => x.roundNumber)),
            ),
            entryA: entryName(n.entryAId),
            entryB: n.byeEntryId && !n.entryBId ? "BYE" : entryName(n.entryBId),
            winner: n.winnerEntryId ? entryName(n.winnerEntryId) : null,
            status: n.status,
          }))
      : [];
    const activeNode = active ? this.store.nodes.get(active.bracketNodeId) : undefined;
    const round = active
      ? [...this.store.rounds.values()].find((r) => r.heatId === active.id && r.status === "open")
      : undefined;
    const submitted = round
      ? [...this.store.ballots.values()].filter((b) => b.ballotRoundId === round.id && b.status === "submitted").length
      : 0;
    const policy = releasePolicy({
      heatFinalized: active?.state === "finalized",
      eventPublished: Boolean(event.publishedAt),
      judgingDelivery: event.judgingDeliveryMode,
      judgingOpen: active?.state === "judging_open",
      voteSplitPublicPolicy: event.voteSplitPublic,
    });
    const draw = active?.patternDrawId ? this.store.draws.get(active.patternDrawId) : undefined;
    const pattern = draw ? this.store.patterns.get(draw.selectedPatternSubmissionId) : undefined;
    const result = active ? [...this.store.results.values()].find((r) => r.heatId === active.id && !r.supersededAt) : undefined;
    return {
      event: {
        id: event.id,
        name: event.name,
        slug: event.slug,
        description: event.description,
        venueName: event.venueName,
        city: event.city,
        countryCode: event.countryCode,
        startsAt: event.startsAt,
        endsAt: event.endsAt,
        status: event.status,
        format: event.competitionFormat,
        judgingDelivery: event.judgingDeliveryMode,
        votingModel: event.votingModel,
        participation: event.participationStructure,
        equipmentMode: event.equipmentMode,
        paid: payment?.status === "paid",
        publishedAt: event.publishedAt,
      },
      policy,
      bracket: nodes,
      activeHeat: active
        ? {
            heatNumber: active.heatNumber,
            state: active.state,
            entryAName: entryName(activeNode?.entryAId ?? null),
            entryBName: entryName(activeNode?.entryBId ?? null),
            timer: this.timerDisplay(active.id),
            referencePattern:
              active.state === "scheduled" || active.state === "check_in"
                ? null
                : pattern
                  ? { title: "Reference pattern", imagePath: pattern.judgingDerivativePath }
                  : null,
            ballotProgress: round ? { submitted, required: round.targetBallots } : null,
            winnerName: policy.showWinner && result ? entryName(result.winnerEntryId) : null,
            voteSplit:
              policy.showVoteSplit && result
                ? { a: result.voteACount, b: result.voteBCount }
                : null,
          }
        : null,
      upcoming: heats
        .filter((h) => h.state === "scheduled")
        .slice(0, 4)
        .map((h) => {
          const n = this.store.nodes.get(h.bracketNodeId);
          return {
            heatNumber: h.heatNumber,
            scheduledAt: h.scheduledAt,
            entryAName: entryName(n?.entryAId ?? null),
            entryBName: entryName(n?.entryBId ?? null),
          };
        }),
      champion: event.publishedAt
        ? (nodes.find((n) => n.roundName === "Final")?.winner ?? null)
        : null,
    };
  }

  competitorHeatDto(actor: Actor, eventId: string) {
    const event = this.getEvent(eventId);
    const myEntries = [...this.store.entryMembers.values()]
      .filter((m) => m.memberId === actor.member.id)
      .map((m) => m.entryId);
    const lock = this.store.locks.get(eventId);
    const heat = lock?.activeHeatId ? this.store.heats.get(lock.activeHeatId) : undefined;
    const node = heat ? this.store.nodes.get(heat.bracketNodeId) : undefined;
    const mine = node && (myEntries.includes(node.entryAId ?? "") || myEntries.includes(node.entryBId ?? ""));
    const draw = heat?.patternDrawId ? this.store.draws.get(heat.patternDrawId) : undefined;
    const pattern = draw ? this.store.patterns.get(draw.selectedPatternSubmissionId) : undefined;
    const reveal =
      heat &&
      !["scheduled", "check_in"].includes(heat.state) &&
      event.competitionFormat === "match_pattern";
    return {
      event: { name: event.name, format: event.competitionFormat, coachPermissions: event.coachPermissions, teamPermissions: event.teamPermissions },
      heat: mine
        ? {
            id: heat!.id,
            state: heat!.state,
            heatNumber: heat!.heatNumber,
            timer: this.timerDisplay(heat!.id),
            myEntryId: myEntries.find((id) => id === node?.entryAId || id === node?.entryBId),
            opponentKnown: true,
            opponentName:
              heat!.state === "finalized"
                ? this.store.entries.get(
                    node?.entryAId === myEntries[0] ? node?.entryBId ?? "" : node?.entryAId ?? "",
                  )?.displayName
                : this.store.entries.get(
                    myEntries.includes(node?.entryAId ?? "") ? node?.entryBId ?? "" : node?.entryAId ?? "",
                  )?.displayName,
            referencePattern: reveal && pattern ? { imagePath: pattern.judgingDerivativePath } : null,
            photo: this.store.activePhotos(heat!.id).find((p) => myEntries.includes(p.entryId)) ?? null,
          }
        : null,
    };
  }

  privateFeedback(actor: Actor, eventId: string) {
    const event = this.getEvent(eventId);
    if (!event.publishedAt) {
      throw forbidden("FEEDBACK_LOCKED", "Anonymised feedback is available after the event is completed.");
    }
    const myEntries = [...this.store.entryMembers.values()]
      .filter((m) => m.memberId === actor.member.id)
      .map((m) => m.entryId);
    const heats = this.store.eventHeats(eventId).filter((h) => {
      const node = this.store.nodes.get(h.bracketNodeId);
      return node && (myEntries.includes(node.entryAId ?? "") || myEntries.includes(node.entryBId ?? ""));
    });
    return heats.map((heat) => {
      const mapping = this.store.activeMapping(heat.id);
      const myEntry = myEntries.find((id) => id === mapping?.entryAId || id === mapping?.entryBId);
      const myBlind = mapping && myEntry ? (mapping.entryAId === myEntry ? "A" : "B") : null;
      const ballots = [...this.store.ballots.values()].filter((b) => b.heatId === heat.id && b.status === "submitted");
      return {
        heatNumber: heat.heatNumber,
        outcome: heat.winnerEntryId && myEntry === heat.winnerEntryId ? "win" : "loss",
        feedback: ballots.map((b) => ({
          preferredYou: myBlind ? b.selectedBlindEntry === myBlind : false,
          text: b.feedbackText,
        })),
      };
    });
  }

  memberArchive(memberId: string) {
    const member = this.store.members.get(memberId);
    if (!member) throw notFound("MEMBER", "Member not found.");
    const pours = [...this.store.archives.values()].filter((a) => a.memberId === memberId);
    return {
      member: {
        id: member.id,
        displayName: member.displayName,
        city: member.publicProfileConsent ? member.city : null,
        countryCode: member.publicProfileConsent ? member.countryCode : null,
        affiliationName: member.publicProfileConsent ? member.affiliationName : null,
        publicBio: member.publicProfileConsent ? member.publicBio : null,
        avatarPath: member.avatarPath,
      },
      pours: pours.map((p) => ({
        id: p.id,
        eventName: this.store.events.get(p.eventId)?.name,
        roundName: p.roundName,
        format: p.format,
        outcome: p.outcome,
        photoPath: this.store.photos.get(p.photoId)?.publicStoragePath,
        opponent: p.opponentEntryId ? this.store.entries.get(p.opponentEntryId)?.displayName : null,
        publishedAt: p.publishedAt,
      })),
    };
  }

  organiserOverview(actor: Actor, eventId: string) {
    const event = this.getEvent(eventId);
    this.assertOrganiser(actor, event);
    const lock = this.store.locks.get(eventId);
    const active = lock?.activeHeatId ? this.store.heats.get(lock.activeHeatId) : undefined;
    const round = active
      ? [...this.store.rounds.values()].find((r) => r.heatId === active.id && r.status === "open")
      : undefined;
    const submitted = round
      ? [...this.store.ballots.values()].filter((b) => b.ballotRoundId === round.id && b.status === "submitted").length
      : 0;
    const photos = active ? this.store.activePhotos(active.id) : [];
    return {
      event,
      payment: this.paymentFor(eventId),
      warnings: this.setupWarnings(eventId).warnings,
      lock,
      activeHeat: active
        ? {
            ...active,
            timer: this.timerDisplay(active.id),
            photos: photos.map((p) => ({ entryId: p.entryId, status: p.submissionStatus })),
            ballotProgress: round ? { submitted, required: round.targetBallots } : null,
          }
        : null,
      heats: this.store.eventHeats(eventId).sort((a, b) => a.heatNumber - b.heatNumber),
      entries: this.store.eventEntries(eventId),
      roles: this.store.eventRoles(eventId),
      incidents: [...this.store.incidents.values()].filter((i) => i.eventId === eventId),
    };
  }

  listPublicEvents() {
    return [...this.store.events.values()]
      .filter((e) => e.status !== "draft" && e.status !== "cancelled" && e.status !== "awaiting_payment")
      .map((e) => ({
        id: e.id,
        name: e.name,
        slug: e.slug,
        city: e.city,
        status: e.status,
        format: e.competitionFormat,
        startsAt: e.startsAt,
      }));
  }

  updateProfile(actor: Actor, patch: Partial<Member>) {
    const member = actor.member;
    Object.assign(member, patch, { updatedAt: new Date() });
    if (member.displayName && member.givenName && member.familyName && member.countryCode) {
      member.profileCompletedAt = member.profileCompletedAt ?? new Date();
    }
    this.store.members.set(member.id, member);
    return member;
  }

  lookupMembers(actor: Actor, query: string) {
    this.requireActor(actor);
    const q = query.trim().toLowerCase();
    if (q.length < 3) return [];
    return [...this.store.members.values()]
      .filter((m) => m.displayName.toLowerCase().includes(q) || (m.emailNormalized?.startsWith(q) ?? false))
      .slice(0, 8)
      .map((m) => ({
        id: m.id,
        displayName: m.displayName,
        affiliationName: m.affiliationName,
        countryCode: m.countryCode,
      }));
  }

  updateShot(actor: Actor, shotId: string, status: ShotTask["status"]) {
    const shot = this.store.shots.get(shotId);
    if (!shot) throw notFound("SHOT", "Shot task not found.");
    const roles = this.rolesFor(this.store.heats.get(shot.heatId)!.eventId, actor.member.id);
    if (!roles.includes("shot_barista") && !isOrganiser(roles) && !actor.isPlatformAdmin) {
      throw forbidden("SHOT", "Shot barista only.");
    }
    shot.status = status;
    shot.updatedAt = new Date();
    return shot;
  }

  shotQueue(_actor: Actor, eventId: string) {
    const heats = this.store.eventHeats(eventId).sort((a, b) => a.heatNumber - b.heatNumber);
    return heats.flatMap((h) =>
      [...this.store.shots.values()]
        .filter((s) => s.heatId === h.id)
        .map((s) => ({
          ...s,
          heatNumber: h.heatNumber,
          state: h.state,
        })),
    );
  }

  platformSummary(actor: Actor) {
    if (!actor.isPlatformAdmin) throw forbidden("ADMIN_ONLY", "Platform Admin only.");
    return {
      events: [...this.store.events.values()].map((e) => ({
        id: e.id,
        name: e.name,
        status: e.status,
        payment: this.paymentFor(e.id)?.status,
      })),
      members: this.store.members.size,
      audits: this.store.audits.slice(-100).reverse(),
      incidents: [...this.store.incidents.values()].filter((i) => i.status === "open"),
      flags: [...this.store.flags.values()].slice(-50),
    };
  }

  suspendMember(actor: Actor, memberId: string, reason: string) {
    if (!actor.isPlatformAdmin) throw forbidden("ADMIN_ONLY", "Platform Admin only.");
    const member = this.store.members.get(memberId);
    if (!member) throw notFound("MEMBER", "Not found.");
    member.suspendedAt = new Date();
    this.audit({
      eventId: null,
      heatId: null,
      actorMemberId: actor.member.id,
      actorType: "member",
      action: "member.suspend",
      entityType: "member",
      entityId: memberId,
      beforeJson: null,
      afterJson: null,
      reason,
      requestId: actor.requestId,
    });
    return member;
  }

  voidBallot(actor: Actor, ballotId: string, reason: string) {
    if (!actor.isPlatformAdmin) throw forbidden("ADMIN_ONLY", "Platform Admin only.");
    const ballot = this.store.ballots.get(ballotId);
    if (!ballot) throw notFound("BALLOT", "Ballot not found.");
    ballot.status = "voided";
    ballot.voidedAt = new Date();
    ballot.voidReason = reason;
    this.audit({
      eventId: this.store.heats.get(ballot.heatId)?.eventId ?? null,
      heatId: ballot.heatId,
      actorMemberId: actor.member.id,
      actorType: "member",
      action: "ballot.void",
      entityType: "ballot",
      entityId: ballotId,
      beforeJson: null,
      afterJson: null,
      reason,
      requestId: actor.requestId,
    });
    return ballot;
  }

  exportJudgeHistory(actor: Actor, memberId: string) {
    if (!actor.isPlatformAdmin) throw forbidden("ADMIN_ONLY", "Platform Admin only.");
    this.audit({
      eventId: null,
      heatId: null,
      actorMemberId: actor.member.id,
      actorType: "member",
      action: "judge.history.export",
      entityType: "member",
      entityId: memberId,
      beforeJson: null,
      afterJson: null,
      reason: "quality_management",
      requestId: actor.requestId,
    });
    return [...this.store.ballots.values()].filter((b) => b.voterMemberId === memberId);
  }

  resolveIncident(actor: Actor, incidentId: string, resolution: string) {
    const incident = this.store.incidents.get(incidentId);
    if (!incident) throw notFound("INCIDENT", "Not found.");
    this.assertOrganiser(actor, this.getEvent(incident.eventId));
    incident.status = "resolved";
    incident.resolution = resolution;
    incident.resolvedAt = new Date();
    incident.resolvedByMemberId = actor.member.id;
    return incident;
  }
}

export { LICENCE_LINE };
export type { CompetitionFormat, JudgingDeliveryMode, ParticipationStructure, VotingModel };

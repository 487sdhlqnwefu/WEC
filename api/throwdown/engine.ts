import { createHash, randomBytes, randomInt, randomUUID } from "node:crypto";
import {
  CATEGORY_POINTS,
  INVITE_TTL_MS,
  OTP_TTL_MS,
  PREMIUM_CURRENCY,
  PREMIUM_PRICE_CENTS,
  type JudgingFormat,
} from "@throwdown/constants";
import { assertJudgeCount, scoreSimpleAb, scoreWecV3, validateSimpleAbBallot, validateWecV3Ballot } from "@throwdown/scoring";
import { assignRandomSeeds, generateSingleEliminationBracket } from "@throwdown/brackets";
import { assertTransition, nextHeatBlockedBy, recipesUnlocked } from "@throwdown/heat-state";
import { generateHeatCupCodes } from "@throwdown/cup-codes";
import {
  classifyCompetitorCount,
  premiumActionBlockers,
} from "@throwdown/tiers";
import { toPublicRecipe, type PublicRecipe } from "@throwdown/recipes";
import {
  canAssignJudge,
  canReplaceCupSteward,
  canSubmitBallot,
  canViewCupMappings,
  canViewHiddenRecipe,
  cupStewardConflicts,
} from "@throwdown/authorization";
import {
  applyVerifiedPaymentWebhook,
  clientRedirectDoesNotUnlock,
  complimentaryRequiresReason,
} from "@throwdown/payments";
import { judgeBallotPayload } from "@throwdown/sanitize";
import type { RecipeInput } from "@throwdown/types";
import { badRequest, conflict, forbidden, notFound, unauthorized } from "./errors";
import type {
  AttemptRow,
  EventRow,
  HeatRow,
  ProfileRow,
  ThrowdownUow,
} from "./uow";

export type Actor = {
  profile: ProfileRow;
};

export type Mailer = {
  sendOtp: (email: string, code: string) => Promise<void>;
  sendInvite: (email: string, url: string, role: string, eventName: string) => Promise<void>;
};

function id(): string {
  return randomUUID();
}

function hashSecret(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function slugify(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 72);
  return `${base || "throwdown"}-${randomBytes(3).toString("hex")}`;
}

function roleContext(
  actor: Actor,
  memberships: { role: Actor extends never ? never : import("@throwdown/constants").MembershipRole; status: "accepted" | "invited" | "revoked" }[],
  extra?: { competingInHeat?: boolean; assignedJudgeForHeat?: boolean },
) {
  return {
    profileId: actor.profile.id,
    isPlatformAdmin: actor.profile.isPlatformAdmin,
    memberships,
    competingInHeat: extra?.competingInHeat ?? false,
    assignedJudgeForHeat: extra?.assignedJudgeForHeat ?? false,
  };
}

export class ThrowdownEngine {
  constructor(
    private uow: ThrowdownUow,
    private mailer: Mailer,
    private clock: { now: () => Date } = { now: () => new Date() },
    private publicBaseUrl = "http://localhost:3000",
  ) {}

  private async audit(
    action: string,
    input: {
      eventId?: string | null;
      actorId?: string | null;
      entityType: string;
      entityId?: string | null;
      payload?: unknown;
    },
  ) {
    await this.uow.audits.insert({
      id: id(),
      eventId: input.eventId ?? null,
      actorProfileId: input.actorId ?? null,
      action,
      entityType: input.entityType,
      entityId: input.entityId ?? null,
      payload: input.payload ?? null,
      createdAt: this.clock.now(),
    });
  }

  private async membershipsFor(eventId: string, profileId: string) {
    const rows = await this.uow.memberships.list({ eventId, profileId });
    return rows.map((m) => ({
      role: m.role,
      status: m.status as "accepted" | "invited" | "revoked",
    }));
  }

  private async requireOrganiser(actor: Actor, event: EventRow) {
    if (actor.profile.isPlatformAdmin) return;
    if (event.organiserProfileId !== actor.profile.id) {
      const ms = await this.membershipsFor(event.id, actor.profile.id);
      const ctx = roleContext(actor, ms);
      if (!ctx.memberships.some((m) => m.role === "organiser" && m.status === "accepted")) {
        forbidden("Only the organiser can perform this action.");
      }
    }
  }

  private async requireEvent(eventId: string) {
    const event = await this.uow.events.get(eventId);
    if (!event) notFound("Event not found.");
    return event;
  }

  private async licenceFor(eventId: string) {
    return this.uow.licences.findOne({ eventId });
  }

  private async assertPremiumAllowed(
    event: EventRow,
    action: "publish" | "invite" | "lock_roster" | "generate_bracket" | "start_event",
  ) {
    const licence = await this.licenceFor(event.id);
    const blockers = premiumActionBlockers(
      { tier: event.tier, licenceStatus: licence?.status ?? (event.tier === "premium" ? "unpaid" : null) },
      action,
    );
    if (blockers[0]) forbidden(blockers[0].message);
  }

  async requestOtp(email: string) {
    const normalised = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalised)) badRequest("Enter a valid email address.");
    const recent = (await this.uow.otps.list({ email: normalised }))
      .filter((o) => this.clock.now().getTime() - o.createdAt.getTime() < 60_000);
    if (recent.length >= 5) forbidden("Too many sign-in attempts. Please wait a minute.");
    const code = String(randomInt(0, 1_000_000)).padStart(6, "0");
    await this.uow.otps.insert({
      id: id(),
      email: normalised,
      codeHash: hashSecret(code),
      expiresAt: new Date(this.clock.now().getTime() + OTP_TTL_MS),
      consumedAt: null,
      createdAt: this.clock.now(),
    });
    await this.mailer.sendOtp(normalised, code);
    return { sent: true };
  }

  async verifyOtp(email: string, code: string) {
    const normalised = email.trim().toLowerCase();
    const rows = (await this.uow.otps.list({ email: normalised })).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
    const otp = rows[0];
    if (!otp || otp.consumedAt) unauthorized("This sign-in code is invalid or has already been used.");
    if (otp.expiresAt.getTime() < this.clock.now().getTime()) unauthorized("This sign-in code has expired.");
    if (otp.codeHash !== hashSecret(code)) {
      const demo =
        process.env.THROWDOWN_DEV_LOGIN === "true" &&
        process.env.NODE_ENV !== "production" &&
        code === "000000";
      if (!demo) unauthorized("This sign-in code is incorrect.");
    }
    await this.uow.otps.update(otp.id, { consumedAt: this.clock.now() });
    let profile = await this.uow.profiles.findOne({ email: normalised });
    if (!profile) {
      profile = {
        id: id(),
        displayName: normalised.split("@")[0] || "Member",
        email: normalised,
        emailVerifiedAt: this.clock.now(),
        country: "",
        city: null,
        photoUrl: null,
        organisation: null,
        roleTitle: null,
        externalIdentityProvider: null,
        externalSubjectId: null,
        kimiUnionId: null,
        isPlatformAdmin: false,
        createdAt: this.clock.now(),
        updatedAt: this.clock.now(),
      };
      await this.uow.profiles.insert(profile);
    } else if (!profile.emailVerifiedAt) {
      await this.uow.profiles.update(profile.id, { emailVerifiedAt: this.clock.now() });
      profile = { ...profile, emailVerifiedAt: this.clock.now() };
    }
    return profile;
  }

  async updateProfile(
    actor: Actor,
    patch: Partial<Pick<ProfileRow, "displayName" | "country" | "city" | "photoUrl" | "organisation" | "roleTitle">>,
  ) {
    if (patch.displayName !== undefined && patch.displayName.trim().length < 2) badRequest("Display name is required.");
    await this.uow.profiles.update(actor.profile.id, { ...patch, updatedAt: this.clock.now() });
    return (await this.uow.profiles.get(actor.profile.id))!;
  }

  async createEvent(
    actor: Actor,
    input: {
      name: string;
      hostName: string;
      hostLogoUrl?: string | null;
      startsAt?: Date | null;
      timezone: string;
      venue?: string | null;
      city?: string | null;
      country?: string | null;
      description?: string | null;
      coffeeName: string;
      coffeeType: "blend" | "single_origin";
      coffeeNotes?: string | null;
      espressoMachine?: string | null;
      grinder?: string | null;
      basket?: string | null;
      waterSpec?: string | null;
      otherControls?: string | null;
      tier: "free" | "premium";
      judgingFormat: JudgingFormat;
      judgeCount: number;
    },
  ) {
    if (!actor.profile.emailVerifiedAt) forbidden("Verify your email before creating an event.");
    if (!input.name.trim() || !input.hostName.trim() || !input.coffeeName.trim()) {
      badRequest("Event name, host, and coffee name are required.");
    }
    assertJudgeCount(input.judgingFormat, input.judgeCount);
    if (input.judgingFormat === "wec_v3" && input.judgeCount !== 3) {
      badRequest("Official WEC Scoring v3 requires exactly 3 judges per heat.");
    }
    const event: EventRow = {
      id: id(),
      slug: slugify(input.name),
      organiserProfileId: actor.profile.id,
      cupStewardProfileId: null,
      name: input.name.trim(),
      hostName: input.hostName.trim(),
      hostLogoUrl: input.hostLogoUrl ?? null,
      startsAt: input.startsAt ?? null,
      timezone: input.timezone || "UTC",
      venue: input.venue ?? null,
      city: input.city ?? null,
      country: input.country ?? null,
      description: input.description ?? null,
      coffeeName: input.coffeeName.trim(),
      coffeeType: input.coffeeType,
      coffeeNotes: input.coffeeNotes ?? null,
      espressoMachine: input.espressoMachine ?? null,
      grinder: input.grinder ?? null,
      basket: input.basket ?? null,
      waterSpec: input.waterSpec ?? null,
      otherControls: input.otherControls ?? null,
      tier: input.tier,
      judgingFormat: input.judgingFormat,
      judgeCount: input.judgeCount,
      status: "draft",
      seedingMode: "random",
      rosterLockedAt: null,
      bracketLockedAt: null,
      judgingFormatLockedAt: null,
      startedAt: null,
      completedAt: null,
      championEntryId: null,
      createdAt: this.clock.now(),
      updatedAt: this.clock.now(),
    };
    await this.uow.events.insert(event);
    await this.uow.memberships.insert({
      id: id(),
      eventId: event.id,
      profileId: actor.profile.id,
      role: "organiser",
      status: "accepted",
      createdAt: this.clock.now(),
    });
    if (input.tier === "premium") {
      await this.uow.licences.insert({
        id: id(),
        eventId: event.id,
        status: "unpaid",
        grantedByProfileId: null,
        grantReason: null,
        paidAt: null,
        createdAt: this.clock.now(),
        updatedAt: this.clock.now(),
      });
    }
    await this.uow.publications.insert({
      id: id(),
      eventId: event.id,
      publishedAt: null,
      recipesReleasedAt: null,
      publicPath: `/throwdown/e/${event.slug}`,
    });
    await this.audit("event_created", {
      eventId: event.id,
      actorId: actor.profile.id,
      entityType: "event",
      entityId: event.id,
      payload: { tier: event.tier, judgingFormat: event.judgingFormat },
    });
    return event;
  }

  async updateEvent(actor: Actor, eventId: string, patch: Partial<EventRow>) {
    const event = await this.requireEvent(eventId);
    await this.requireOrganiser(actor, event);
    if (event.status !== "draft" && event.startedAt) {
      if (patch.judgingFormat || patch.judgeCount) {
        badRequest("Judging format is immutable once the first heat has started.");
      }
    }
    if (event.judgingFormatLockedAt && (patch.judgingFormat || patch.judgeCount)) {
      badRequest("Judging format is immutable once the first heat has started.");
    }
    if (patch.judgingFormat || patch.judgeCount) {
      assertJudgeCount(patch.judgingFormat ?? event.judgingFormat, patch.judgeCount ?? event.judgeCount);
    }
    if (patch.tier && patch.tier !== event.tier && event.status !== "draft") {
      badRequest("Product tier cannot change after setup.");
    }
    await this.uow.events.update(eventId, { ...patch, updatedAt: this.clock.now() });
    await this.audit("event_updated", {
      eventId,
      actorId: actor.profile.id,
      entityType: "event",
      entityId: eventId,
    });
    return (await this.uow.events.get(eventId))!;
  }

  async addCompetitor(actor: Actor, eventId: string, profileId: string) {
    const event = await this.requireEvent(eventId);
    await this.requireOrganiser(actor, event);
    if (event.rosterLockedAt) badRequest("The roster is locked.");
    if (event.cupStewardProfileId === profileId) {
      forbidden("The Cup Steward cannot compete in the same event.");
    }
    const existing = await this.uow.entries.findOne({ eventId, profileId });
    if (existing) conflict("This member is already a competitor.");
    const count = (await this.uow.entries.list({ eventId })).length + 1;
    if (event.tier === "free" && count > 4) {
      const decision = classifyCompetitorCount(count);
      badRequest(decision.ok ? "Free Espresso Throwdown is only available for 2, 3, or 4 competitors." : decision.message);
    }
    if (event.tier === "premium" && count > 64) {
      badRequest("Version one supports up to 64 competitors.");
    }
    const entry = {
      id: id(),
      eventId,
      profileId,
      seed: null as number | null,
      createdAt: this.clock.now(),
    };
    await this.uow.entries.insert(entry);
    await this.ensureMembership(eventId, profileId, "competitor", "accepted");
    return entry;
  }

  private async ensureMembership(
    eventId: string,
    profileId: string,
    role: "organiser" | "cup_steward" | "competitor" | "judge",
    status: "invited" | "accepted",
  ) {
    const existing = await this.uow.memberships.findOne({ eventId, profileId, role });
    if (existing) {
      if (existing.status !== status) await this.uow.memberships.update(existing.id, { status });
      return existing;
    }
    const row = {
      id: id(),
      eventId,
      profileId,
      role,
      status,
      createdAt: this.clock.now(),
    };
    await this.uow.memberships.insert(row);
    return row;
  }

  async addJudgeToPool(actor: Actor, eventId: string, profileId: string) {
    const event = await this.requireEvent(eventId);
    await this.requireOrganiser(actor, event);
    if (event.cupStewardProfileId === profileId) {
      forbidden("The Cup Steward cannot judge in the same event.");
    }
    return this.ensureMembership(eventId, profileId, "judge", "accepted");
  }

  async setCupSteward(actor: Actor, eventId: string, profileId: string) {
    const event = await this.requireEvent(eventId);
    const started = !!event.startedAt;
    const ms = await this.membershipsFor(eventId, actor.profile.id);
    const decision = canReplaceCupSteward(roleContext(actor, ms), started);
    if (!decision.allow) forbidden(decision.reason);
    const competitors = await this.uow.entries.list({ eventId });
    const judges = (await this.uow.memberships.list({ eventId, role: "judge" })).filter((m) => m.status === "accepted");
    const conflictCheck = cupStewardConflicts({
      stewardProfileId: profileId,
      competitorProfileIds: competitors.map((c) => c.profileId),
      judgePoolProfileIds: judges.map((j) => j.profileId),
    });
    if (!conflictCheck.allow) forbidden(conflictCheck.reason);
    if (event.cupStewardProfileId) {
      const prev = await this.uow.memberships.findOne({
        eventId,
        profileId: event.cupStewardProfileId,
        role: "cup_steward",
      });
      if (prev) await this.uow.memberships.update(prev.id, { status: "revoked" });
    }
    await this.ensureMembership(eventId, profileId, "cup_steward", "accepted");
    await this.uow.events.update(eventId, { cupStewardProfileId: profileId, updatedAt: this.clock.now() });
    await this.audit(started ? "cup_steward_replaced" : "role_assigned", {
      eventId,
      actorId: actor.profile.id,
      entityType: "cup_steward",
      entityId: profileId,
    });
  }

  async createInvitation(
    actor: Actor,
    eventId: string,
    email: string,
    role: "cup_steward" | "competitor" | "judge",
  ) {
    const event = await this.requireEvent(eventId);
    await this.requireOrganiser(actor, event);
    await this.assertPremiumAllowed(event, "invite");
    const normalised = email.trim().toLowerCase();
    const token = randomBytes(24).toString("base64url");
    await this.uow.invitations.insert({
      id: id(),
      eventId,
      email: normalised,
      role,
      tokenHash: hashSecret(token),
      expiresAt: new Date(this.clock.now().getTime() + INVITE_TTL_MS),
      revokedAt: null,
      acceptedAt: null,
      acceptedByProfileId: null,
      createdByProfileId: actor.profile.id,
      createdAt: this.clock.now(),
    });
    const url = `${this.publicBaseUrl}/throwdown/invite/${token}`;
    await this.mailer.sendInvite(normalised, url, role, event.name);
    await this.audit("invitation_sent", {
      eventId,
      actorId: actor.profile.id,
      entityType: "invitation",
      payload: { role, email: normalised },
    });
    return { url, token };
  }

  async revokeInvitation(actor: Actor, invitationId: string) {
    const invite = await this.uow.invitations.get(invitationId);
    if (!invite) notFound("Invitation not found.");
    const event = await this.requireEvent(invite.eventId);
    await this.requireOrganiser(actor, event);
    await this.uow.invitations.update(invitationId, { revokedAt: this.clock.now() });
    await this.audit("invitation_revoked", {
      eventId: event.id,
      actorId: actor.profile.id,
      entityType: "invitation",
      entityId: invitationId,
    });
  }

  async previewInvitation(token: string) {
    const invite = await this.uow.invitations.findOne({ tokenHash: hashSecret(token) });
    if (!invite || invite.revokedAt) notFound("This invitation is no longer valid.");
    if (invite.acceptedAt) conflict("This invitation has already been accepted.");
    if (invite.expiresAt.getTime() < this.clock.now().getTime()) {
      badRequest("This invitation has expired.");
    }
    const event = await this.requireEvent(invite.eventId);
    return { eventName: event.name, role: invite.role, email: invite.email, eventId: event.id };
  }

  async acceptInvitation(actor: Actor, token: string) {
    const invite = await this.uow.invitations.findOne({ tokenHash: hashSecret(token) });
    if (!invite || invite.revokedAt) notFound("This invitation is no longer valid.");
    if (invite.acceptedAt) conflict("This invitation has already been accepted.");
    if (invite.expiresAt.getTime() < this.clock.now().getTime()) badRequest("This invitation has expired.");
    if (actor.profile.email !== invite.email && actor.profile.emailVerifiedAt) {
      // Allow if same person signed in with invited email only
      if (actor.profile.email !== invite.email) {
        forbidden("Sign in with the invited email address to accept this role.");
      }
    }
    const event = await this.requireEvent(invite.eventId);
    if (invite.role === "cup_steward") {
      const competitors = await this.uow.entries.list({ eventId: event.id });
      const judges = (await this.uow.memberships.list({ eventId: event.id, role: "judge" })).filter(
        (m) => m.status === "accepted",
      );
      const check = cupStewardConflicts({
        stewardProfileId: actor.profile.id,
        competitorProfileIds: competitors.map((c) => c.profileId),
        judgePoolProfileIds: judges.map((j) => j.profileId),
      });
      if (!check.allow) forbidden(check.reason);
      await this.setCupSteward({ profile: { ...actor.profile, isPlatformAdmin: true } }, event.id, actor.profile.id);
    }
    if (invite.role === "competitor") {
      await this.addCompetitor({ profile: { ...actor.profile, isPlatformAdmin: true } }, event.id, actor.profile.id);
    }
    if (invite.role === "judge") {
      await this.addJudgeToPool({ profile: { ...actor.profile, isPlatformAdmin: true } }, event.id, actor.profile.id);
    }
    await this.uow.invitations.update(invite.id, {
      acceptedAt: this.clock.now(),
      acceptedByProfileId: actor.profile.id,
    });
    await this.audit("invitation_accepted", {
      eventId: event.id,
      actorId: actor.profile.id,
      entityType: "invitation",
      entityId: invite.id,
      payload: { role: invite.role },
    });
    return event;
  }

  async publishEvent(actor: Actor, eventId: string) {
    const event = await this.requireEvent(eventId);
    await this.requireOrganiser(actor, event);
    await this.assertPremiumAllowed(event, "publish");
    const pub = await this.uow.publications.findOne({ eventId });
    await this.uow.events.update(eventId, { status: event.status === "draft" ? "published" : event.status });
    if (pub) await this.uow.publications.update(pub.id, { publishedAt: this.clock.now() });
    await this.audit("event_published", {
      eventId,
      actorId: actor.profile.id,
      entityType: "event",
      entityId: eventId,
    });
  }

  async lockRoster(actor: Actor, eventId: string) {
    const event = await this.requireEvent(eventId);
    await this.requireOrganiser(actor, event);
    const entries = await this.uow.entries.list({ eventId });
    const decision = classifyCompetitorCount(entries.length);
    if (!decision.ok) badRequest(decision.message);
    if (decision.tier !== event.tier) {
      badRequest(
        event.tier === "free"
          ? "Free Espresso Throwdown is only available for 2, 3, or 4 competitors."
          : "Premium Espresso Tournament requires 8 or more competitors.",
      );
    }
    await this.assertPremiumAllowed(event, "lock_roster");
    if (!event.cupStewardProfileId) badRequest("Assign exactly one Cup Steward before locking the roster.");
    await this.uow.events.update(eventId, { rosterLockedAt: this.clock.now() });
    await this.audit("roster_locked", {
      eventId,
      actorId: actor.profile.id,
      entityType: "event",
      entityId: eventId,
    });
  }

  async setSeeds(actor: Actor, eventId: string, seeds: { entryId: string; seed: number }[]) {
    const event = await this.requireEvent(eventId);
    await this.requireOrganiser(actor, event);
    if (event.bracketLockedAt) badRequest("The bracket is locked. An administrative action is required to change seeding.");
    for (const s of seeds) {
      await this.uow.entries.update(s.entryId, { seed: s.seed });
    }
    await this.uow.events.update(eventId, { seedingMode: "manual" });
  }

  async generateBracket(actor: Actor, eventId: string, random = Math.random) {
    const event = await this.requireEvent(eventId);
    await this.requireOrganiser(actor, event);
    await this.assertPremiumAllowed(event, "generate_bracket");
    if (event.bracketLockedAt) badRequest("The bracket is locked.");
    if (!event.rosterLockedAt) badRequest("Lock the roster before generating the bracket.");
    const entries = await this.uow.entries.list({ eventId });
    const decision = classifyCompetitorCount(entries.length);
    if (!decision.ok) badRequest(decision.message);
    if (decision.tier !== event.tier) {
      badRequest(
        event.tier === "free"
          ? "Free Espresso Throwdown is only available for 2, 3, or 4 competitors."
          : "Premium Espresso Tournament requires 8 or more competitors.",
      );
    }
    let seeded = entries.filter((e) => e.seed != null) as (typeof entries[number] & { seed: number })[];
    if (event.seedingMode === "random" || seeded.length !== entries.length) {
      const assigned = assignRandomSeeds(
        entries.map((e) => e.id),
        random,
      );
      for (const a of assigned) await this.uow.entries.update(a.entryId, { seed: a.seed });
      seeded = assigned.map((a) => ({ ...entries.find((e) => e.id === a.entryId)!, seed: a.seed }));
    }
    const generated = generateSingleEliminationBracket(
      seeded.map((e) => ({ entryId: e.id, seed: e.seed })),
    );
    const existing = await this.uow.brackets.findOne({ eventId });
    if (existing) badRequest("A bracket already exists. Unlocking requires an audited administrative action.");
    const bracketId = id();
    await this.uow.brackets.insert({
      id: bracketId,
      eventId,
      size: generated.size,
      lockedAt: this.clock.now(),
      generatedAt: this.clock.now(),
    });
    const roundMap = new Map<number, string>();
    const uniqueRounds = [...new Set(generated.heats.map((h) => h.roundIndex))];
    for (const roundIndex of uniqueRounds) {
      const sample = generated.heats.find((h) => h.roundIndex === roundIndex)!;
      const roundId = id();
      roundMap.set(roundIndex, roundId);
      await this.uow.rounds.insert({
        id: roundId,
        bracketId,
        eventId,
        roundIndex,
        name: sample.roundName,
        size: generated.heats.filter((h) => h.roundIndex === roundIndex).length,
      });
    }
    const heatIds: HeatRow[] = [];
    for (const h of generated.heats) {
      heatIds.push({
        id: id(),
        eventId,
        roundId: roundMap.get(h.roundIndex)!,
        label: h.label,
        position: h.position,
        isBye: h.isBye,
        feedsHeatId: null,
        feedsSlot: h.feedsSlot,
        currentAttemptId: null,
        createdAt: this.clock.now(),
      });
    }
    for (let i = 0; i < generated.heats.length; i++) {
      const spec = generated.heats[i]!;
      if (spec.feedsRoundIndex != null && spec.feedsPosition != null) {
        const target = heatIds.find(
          (x, idx) =>
            generated.heats[idx]!.roundIndex === spec.feedsRoundIndex &&
            generated.heats[idx]!.position === spec.feedsPosition,
        );
        if (target) heatIds[i]!.feedsHeatId = target.id;
      }
    }
    for (const heat of heatIds) await this.uow.heats.insert(heat);

    for (let i = 0; i < generated.heats.length; i++) {
      const spec = generated.heats[i]!;
      const heat = heatIds[i]!;
      const attemptId = id();
      const isBye = spec.isBye;
      await this.uow.attempts.insert({
        id: attemptId,
        heatId: heat.id,
        eventId,
        attemptNumber: 1,
        status: isBye ? "complete" : "scheduled",
        voidReason: null,
        voidedAt: null,
        voidedByProfileId: null,
        codesConfirmedAt: null,
        brewingCompletedAt: null,
        judgingOpenedAt: null,
        resultRevealedAt: isBye ? this.clock.now() : null,
        winnerEntryId: spec.byeEntryId,
        winnerCupCode: null,
        scorePayload: isBye ? { bye: true } : null,
        createdAt: this.clock.now(),
      });
      await this.uow.heats.update(heat.id, { currentAttemptId: attemptId });
      for (let slot = 0; slot < 2; slot++) {
        const entryId = spec.competitorEntryIds[slot];
        await this.uow.heatCompetitors.insert({
          id: id(),
          heatId: heat.id,
          attemptId,
          competitorEntryId: entryId,
          slot,
          isBye: isBye && entryId == null,
          advancedFromHeatId: null,
        });
      }
      if (isBye && spec.byeEntryId && heat.feedsHeatId != null && heat.feedsSlot != null) {
        await this.advanceWinner(heat.feedsHeatId, heat.feedsSlot, spec.byeEntryId, heat.id);
      }
    }

    await this.uow.events.update(eventId, { bracketLockedAt: this.clock.now() });
    await this.audit("bracket_generated", {
      eventId,
      actorId: actor.profile.id,
      entityType: "bracket",
      entityId: bracketId,
      payload: {
        size: generated.size,
        byeCount: generated.byeCount,
        byeAssignments: generated.byeAssignments,
      },
    });
    return generated;
  }

  private async advanceWinner(feedsHeatId: string, feedsSlot: number, winnerEntryId: string, fromHeatId: string) {
    const target = await this.uow.heats.get(feedsHeatId);
    if (!target?.currentAttemptId) return;
    const slots = await this.uow.heatCompetitors.list({ attemptId: target.currentAttemptId });
    const slotRow = slots.find((s) => s.slot === feedsSlot);
    if (!slotRow) return;
    if (slotRow.competitorEntryId && slotRow.competitorEntryId !== winnerEntryId) {
      conflict("Winner has already advanced into this heat.");
    }
    await this.uow.heatCompetitors.update(slotRow.id, {
      competitorEntryId: winnerEntryId,
      advancedFromHeatId: fromHeatId,
    });
  }

  async assignJudges(actor: Actor, heatId: string, profileIds: string[]) {
    const heat = await this.uow.heats.get(heatId);
    if (!heat) notFound("Heat not found.");
    const event = await this.requireEvent(heat.eventId);
    await this.requireOrganiser(actor, event);
    const attempt = heat.currentAttemptId ? await this.uow.attempts.get(heat.currentAttemptId) : null;
    if (!attempt) notFound("Heat attempt not found.");
    if (attempt.status !== "scheduled" && attempt.status !== "staged") {
      badRequest("Judges can only be assigned before brewing starts.");
    }
    if (profileIds.length !== event.judgeCount) {
      badRequest(`Assign exactly ${event.judgeCount} eligible judges.`);
    }
    const unique = new Set(profileIds);
    if (unique.size !== profileIds.length) badRequest("Each judge may be assigned once per heat.");
    const comps = await this.uow.heatCompetitors.list({ attemptId: attempt.id });
    const entries = await Promise.all(comps.map((c) => (c.competitorEntryId ? this.uow.entries.get(c.competitorEntryId) : null)));
    const competitorProfileIds = entries.filter(Boolean).map((e) => e!.profileId);
    for (const profileId of profileIds) {
      const decision = canAssignJudge({
        judgeProfileId: profileId,
        heatCompetitorProfileIds: competitorProfileIds,
        cupStewardProfileId: event.cupStewardProfileId,
      });
      if (!decision.allow) forbidden(decision.reason);
      const inPool = await this.uow.memberships.findOne({ eventId: event.id, profileId, role: "judge" });
      if (!inPool || inPool.status !== "accepted") {
        forbidden("Judges must be accepted members in the judge pool.");
      }
    }
    const existing = await this.uow.judgeAssignments.list({ heatAttemptId: attempt.id });
    for (const row of existing) {
      await this.uow.judgeAssignments.remove(row.id);
    }
    for (const profileId of profileIds) {
      await this.uow.judgeAssignments.insert({
        id: id(),
        heatAttemptId: attempt.id,
        eventId: event.id,
        profileId,
        createdAt: this.clock.now(),
      });
    }
  }

  async stageHeat(actor: Actor, heatId: string) {
    const heat = await this.uow.heats.get(heatId);
    if (!heat) notFound("Heat not found.");
    const event = await this.requireEvent(heat.eventId);
    await this.requireOrganiser(actor, event);
    await this.assertPremiumAllowed(event, "start_event");
    const attempt = heat.currentAttemptId ? await this.uow.attempts.get(heat.currentAttemptId) : null;
    if (!attempt) notFound("Heat attempt not found.");
    await this.assertPrerequisites(heat, event);
    assertTransition(attempt.status, "staged");
    const judges = await this.uow.judgeAssignments.list({ heatAttemptId: attempt.id });
    if (judges.length !== event.judgeCount) {
      badRequest(`Assign exactly ${event.judgeCount} eligible judges.`);
    }
    const used = (await this.uow.mappings.list({ eventId: event.id })).map((m) => m.cupCode);
    const comps = (await this.uow.heatCompetitors.list({ attemptId: attempt.id })).filter((c) => c.competitorEntryId);
    if (comps.length !== 2) badRequest("Both competitors must be in the heat before it can be staged.");
    const [codeA, codeB] = generateHeatCupCodes(used);
    const codes = Math.random() < 0.5 ? [codeA, codeB] : [codeB, codeA];
    for (let i = 0; i < comps.length; i++) {
      await this.uow.mappings.insert({
        id: id(),
        eventId: event.id,
        heatAttemptId: attempt.id,
        competitorEntryId: comps[i]!.competitorEntryId!,
        cupCode: codes[i]!,
        createdAt: this.clock.now(),
      });
    }
    await this.uow.attempts.update(attempt.id, { status: "staged" });
    if (!event.judgingFormatLockedAt) {
      await this.uow.events.update(event.id, { judgingFormatLockedAt: this.clock.now() });
    }
    await this.audit("heat_staged", {
      eventId: event.id,
      actorId: actor.profile.id,
      entityType: "heat",
      entityId: heat.id,
    });
  }

  private async assertPrerequisites(heat: HeatRow, _event: EventRow) {
    const allHeats = await this.uow.heats.list({ eventId: heat.eventId });
    const feeders = allHeats.filter((h) => h.feedsHeatId === heat.id);
    for (const feeder of feeders) {
      const attempt = feeder.currentAttemptId ? await this.uow.attempts.get(feeder.currentAttemptId) : null;
      if (!attempt) continue;
      if (feeder.isBye && (attempt.status === "complete" || attempt.status === "recipes_complete")) continue;
      const recipes = await this.uow.recipes.list({ heatAttemptId: attempt.id });
      const comps = (await this.uow.heatCompetitors.list({ attemptId: attempt.id })).filter((c) => c.competitorEntryId && !c.isBye);
      const missing = [];
      for (const c of comps) {
        if (!recipes.some((r) => r.competitorEntryId === c.competitorEntryId)) {
          const entry = await this.uow.entries.get(c.competitorEntryId!);
          const profile = entry ? await this.uow.profiles.get(entry.profileId) : null;
          missing.push(profile?.displayName || "a competitor");
        }
      }
      const msg = nextHeatBlockedBy({
        label: feeder.label,
        state: attempt.status,
        competitorNamesMissingRecipes: missing,
        isByeSkipped: feeder.isBye,
      });
      if (msg) forbidden(msg);
    }
  }

  async confirmCupCodes(actor: Actor, heatId: string) {
    const heat = await this.uow.heats.get(heatId);
    if (!heat) notFound("Heat not found.");
    const event = await this.requireEvent(heat.eventId);
    const ms = await this.membershipsFor(event.id, actor.profile.id);
    const decision = canViewCupMappings(roleContext(actor, ms));
    if (!decision.allow) forbidden(decision.reason);
    const attempt = heat.currentAttemptId ? await this.uow.attempts.get(heat.currentAttemptId) : null;
    if (!attempt || attempt.status !== "staged") badRequest("Cup codes can only be confirmed while the heat is staged.");
    await this.uow.attempts.update(attempt.id, { codesConfirmedAt: this.clock.now() });
    await this.audit("cup_codes_confirmed", {
      eventId: event.id,
      actorId: actor.profile.id,
      entityType: "heat",
      entityId: heat.id,
    });
  }

  async getStewardView(actor: Actor, eventId: string) {
    const event = await this.requireEvent(eventId);
    const ms = await this.membershipsFor(eventId, actor.profile.id);
    const decision = canViewCupMappings(roleContext(actor, ms));
    if (!decision.allow) forbidden(decision.reason);
    const heats = await this.uow.heats.list({ eventId });
    const current = [];
    for (const heat of heats) {
      const attempt = heat.currentAttemptId ? await this.uow.attempts.get(heat.currentAttemptId) : null;
      if (!attempt || !["staged", "brewing", "brewing_complete", "judging_open"].includes(attempt.status)) continue;
      const mappings = await this.uow.mappings.list({ heatAttemptId: attempt.id });
      const cups = [];
      for (const m of mappings) {
        const entry = await this.uow.entries.get(m.competitorEntryId);
        const profile = entry ? await this.uow.profiles.get(entry.profileId) : null;
        cups.push({
          cupCode: m.cupCode,
          competitorName: profile?.displayName ?? "Competitor",
        });
      }
      current.push({
        heatId: heat.id,
        heatLabel: heat.label,
        status: attempt.status,
        confirmed: !!attempt.codesConfirmedAt,
        cups,
      });
    }
    return { eventName: event.name, heats: current };
  }

  async startHeat(actor: Actor, heatId: string) {
    const heat = await this.uow.heats.get(heatId);
    if (!heat) notFound("Heat not found.");
    const event = await this.requireEvent(heat.eventId);
    await this.requireOrganiser(actor, event);
    await this.assertPremiumAllowed(event, "start_event");
    const attempt = heat.currentAttemptId ? await this.uow.attempts.get(heat.currentAttemptId) : null;
    if (!attempt) notFound("Heat attempt not found.");
    assertTransition(attempt.status, "brewing");
    if (!attempt.codesConfirmedAt) forbidden("Cup Steward has not confirmed the cup codes.");
    await this.uow.attempts.update(attempt.id, { status: "brewing" });
    if (event.status !== "live") {
      await this.uow.events.update(event.id, { status: "live", startedAt: event.startedAt ?? this.clock.now() });
    }
    await this.audit("heat_started", {
      eventId: event.id,
      actorId: actor.profile.id,
      entityType: "heat",
      entityId: heat.id,
    });
  }

  async markBrewingComplete(actor: Actor, heatId: string) {
    const { event, attempt, heat } = await this.requireOrganiserHeat(actor, heatId);
    assertTransition(attempt.status, "brewing_complete");
    await this.uow.attempts.update(attempt.id, {
      status: "brewing_complete",
      brewingCompletedAt: this.clock.now(),
    });
    await this.audit("brewing_complete", {
      eventId: event.id,
      actorId: actor.profile.id,
      entityType: "heat",
      entityId: heat.id,
    });
  }

  async openJudging(actor: Actor, heatId: string) {
    const { event, attempt, heat } = await this.requireOrganiserHeat(actor, heatId);
    assertTransition(attempt.status, "judging_open");
    await this.uow.attempts.update(attempt.id, {
      status: "judging_open",
      judgingOpenedAt: this.clock.now(),
    });
    await this.audit("judging_opened", {
      eventId: event.id,
      actorId: actor.profile.id,
      entityType: "heat",
      entityId: heat.id,
    });
  }

  private async requireOrganiserHeat(actor: Actor, heatId: string) {
    const heat = await this.uow.heats.get(heatId);
    if (!heat) notFound("Heat not found.");
    const event = await this.requireEvent(heat.eventId);
    await this.requireOrganiser(actor, event);
    const attempt = heat.currentAttemptId ? await this.uow.attempts.get(heat.currentAttemptId) : null;
    if (!attempt) notFound("Heat attempt not found.");
    return { heat, event, attempt };
  }

  async getJudgeBallot(actor: Actor, heatId: string) {
    const heat = await this.uow.heats.get(heatId);
    if (!heat) notFound("Heat not found.");
    const event = await this.requireEvent(heat.eventId);
    const attempt = heat.currentAttemptId ? await this.uow.attempts.get(heat.currentAttemptId) : null;
    if (!attempt) notFound("Heat attempt not found.");
    const assignment = await this.uow.judgeAssignments.findOne({
      heatAttemptId: attempt.id,
      profileId: actor.profile.id,
    });
    const comps = await this.uow.heatCompetitors.list({ attemptId: attempt.id });
    const entries = await Promise.all(comps.map((c) => (c.competitorEntryId ? this.uow.entries.get(c.competitorEntryId) : null)));
    const competing = entries.some((e) => e?.profileId === actor.profile.id);
    const ms = await this.membershipsFor(event.id, actor.profile.id);
    const decision = canSubmitBallot(
      roleContext(actor, ms, { competingInHeat: competing, assignedJudgeForHeat: !!assignment }),
    );
    if (!decision.allow) forbidden(decision.reason);
    const mappings = await this.uow.mappings.list({ heatAttemptId: attempt.id });
    const cupCodes = mappings.map((m) => m.cupCode) as [string, string];
    const existing = assignment
      ? await this.uow.ballots.findOne({ judgeAssignmentId: assignment.id })
      : undefined;
    return judgeBallotPayload({
      eventName: event.name,
      heatLabel: heat.label,
      judgingFormat: event.judgingFormat,
      cupCodes,
      submitted: !!existing,
    });
  }

  async submitBallot(
    actor: Actor,
    heatId: string,
    input: { tactile?: string; taste?: string; flavour?: string; choice?: string; idempotencyKey: string },
  ) {
    const heat = await this.uow.heats.get(heatId);
    if (!heat) notFound("Heat not found.");
    const event = await this.requireEvent(heat.eventId);
    const attempt = heat.currentAttemptId ? await this.uow.attempts.get(heat.currentAttemptId) : null;
    if (!attempt) notFound("Heat attempt not found.");
    const assignment = await this.uow.judgeAssignments.findOne({
      heatAttemptId: attempt.id,
      profileId: actor.profile.id,
    });
    if (!assignment) forbidden("Only an assigned judge may submit a ballot for this heat.");
    const replay = await this.uow.ballots.findOne({ idempotencyKey: input.idempotencyKey });
    if (replay) return { submitted: true, replayed: true };
    const existing = await this.uow.ballots.findOne({ judgeAssignmentId: assignment.id });
    if (existing) conflict("Submitted ballots are immutable.");
    if (attempt.status !== "judging_open") badRequest("Judging is not open for this heat.");
    const comps = await this.uow.heatCompetitors.list({ attemptId: attempt.id });
    const entries = await Promise.all(comps.map((c) => (c.competitorEntryId ? this.uow.entries.get(c.competitorEntryId) : null)));
    const competing = entries.some((e) => e?.profileId === actor.profile.id);
    const ms = await this.membershipsFor(event.id, actor.profile.id);
    const decision = canSubmitBallot(
      roleContext(actor, ms, { competingInHeat: competing, assignedJudgeForHeat: !!assignment }),
    );
    if (!decision.allow) forbidden(decision.reason);
    const mappings = await this.uow.mappings.list({ heatAttemptId: attempt.id });
    const cupCodes = mappings.map((m) => m.cupCode) as [string, string];
    const ballotId = id();
    await this.uow.ballots.insert({
      id: ballotId,
      heatAttemptId: attempt.id,
      judgeAssignmentId: assignment.id,
      idempotencyKey: input.idempotencyKey,
      submittedAt: this.clock.now(),
    });
    if (event.judgingFormat === "wec_v3") {
      if (!input.tactile || !input.taste || !input.flavour) {
        badRequest("All three category selections are required before a ballot can be submitted.");
      }
      validateWecV3Ballot({ tactile: input.tactile, taste: input.taste, flavour: input.flavour }, cupCodes);
      await this.uow.selections.insert({
        id: id(),
        ballotId,
        category: "tactile",
        cupCode: input.tactile,
        points: CATEGORY_POINTS.tactile,
      });
      await this.uow.selections.insert({
        id: id(),
        ballotId,
        category: "taste",
        cupCode: input.taste,
        points: CATEGORY_POINTS.taste,
      });
      await this.uow.selections.insert({
        id: id(),
        ballotId,
        category: "flavour",
        cupCode: input.flavour,
        points: CATEGORY_POINTS.flavour,
      });
    } else {
      if (!input.choice) badRequest("A cup choice is required before a ballot can be submitted.");
      validateSimpleAbBallot({ choice: input.choice }, cupCodes);
      await this.uow.selections.insert({
        id: id(),
        ballotId,
        category: "overall",
        cupCode: input.choice,
        points: 1,
      });
    }
    await this.audit("ballot_submitted", {
      eventId: event.id,
      actorId: actor.profile.id,
      entityType: "ballot",
      entityId: ballotId,
    });
    await this.maybeCompleteBallots(event, attempt, cupCodes);
    return { submitted: true, replayed: false };
  }

  private async maybeCompleteBallots(event: EventRow, attempt: AttemptRow, cupCodes: [string, string]) {
    const assignments = await this.uow.judgeAssignments.list({ heatAttemptId: attempt.id });
    const ballots = await this.uow.ballots.list({ heatAttemptId: attempt.id });
    if (ballots.length !== assignments.length || assignments.length !== event.judgeCount) return;
    const parsed = [];
    for (const ballot of ballots) {
      const selections = await this.uow.selections.list({ ballotId: ballot.id });
      if (event.judgingFormat === "wec_v3") {
        parsed.push({
          tactile: selections.find((s) => s.category === "tactile")!.cupCode,
          taste: selections.find((s) => s.category === "taste")!.cupCode,
          flavour: selections.find((s) => s.category === "flavour")!.cupCode,
        });
      } else {
        parsed.push({ choice: selections.find((s) => s.category === "overall")!.cupCode });
      }
    }
    const result =
      event.judgingFormat === "wec_v3"
        ? scoreWecV3(parsed as { tactile: string; taste: string; flavour: string }[], cupCodes)
        : scoreSimpleAb(parsed as { choice: string }[], cupCodes);
    const winnerMapping = (await this.uow.mappings.list({ heatAttemptId: attempt.id })).find(
      (m) => m.cupCode === result.winnerCupCode,
    );
    assertTransition(attempt.status, "ballots_complete");
    await this.uow.attempts.update(attempt.id, {
      status: "ballots_complete",
      winnerCupCode: result.winnerCupCode,
      winnerEntryId: winnerMapping?.competitorEntryId ?? null,
      scorePayload: result,
    });
    await this.audit("result_calculated", {
      eventId: event.id,
      entityType: "heat",
      entityId: attempt.heatId,
      payload: { winnerCupCode: result.winnerCupCode, totals: result.totals },
    });
  }

  async revealResult(actor: Actor, heatId: string) {
    const { event, attempt, heat } = await this.requireOrganiserHeat(actor, heatId);
    assertTransition(attempt.status, "result_revealed");
    if (!attempt.winnerEntryId) badRequest("The server has not calculated a winner from locked ballots.");
    await this.uow.attempts.update(attempt.id, {
      status: "result_revealed",
      resultRevealedAt: this.clock.now(),
    });
    if (heat.feedsHeatId != null && heat.feedsSlot != null) {
      await this.advanceWinner(heat.feedsHeatId, heat.feedsSlot, attempt.winnerEntryId, heat.id);
    }
    await this.maybeRecipesComplete(attempt.id);
    await this.audit("result_revealed", {
      eventId: event.id,
      actorId: actor.profile.id,
      entityType: "heat",
      entityId: heat.id,
      payload: { winnerEntryId: attempt.winnerEntryId },
    });
  }

  private async maybeRecipesComplete(attemptId: string) {
    const attempt = await this.uow.attempts.get(attemptId);
    if (!attempt) return;
    if (attempt.status !== "result_revealed" && attempt.status !== "recipes_complete") return;
    const comps = (await this.uow.heatCompetitors.list({ attemptId })).filter((c) => c.competitorEntryId && !c.isBye);
    const recipes = await this.uow.recipes.list({ heatAttemptId: attemptId });
    if (recipes.length >= comps.length && comps.length > 0) {
      if (attempt.status === "result_revealed") {
        assertTransition("result_revealed", "recipes_complete");
        await this.uow.attempts.update(attemptId, { status: "recipes_complete" });
      }
      const refreshed = await this.uow.attempts.get(attemptId);
      if (refreshed?.status === "recipes_complete") {
        assertTransition("recipes_complete", "complete");
        await this.uow.attempts.update(attemptId, { status: "complete" });
      }
    }
  }

  async submitRecipe(actor: Actor, heatId: string, input: RecipeInput) {
    const heat = await this.uow.heats.get(heatId);
    if (!heat) notFound("Heat not found.");
    const event = await this.requireEvent(heat.eventId);
    const attempt = heat.currentAttemptId ? await this.uow.attempts.get(heat.currentAttemptId) : null;
    if (!attempt) notFound("Heat attempt not found.");
    if (!recipesUnlocked(attempt.status, attempt.brewingCompletedAt)) {
      forbidden("Recipe entry opens when brewing time is marked complete.");
    }
    const comps = await this.uow.heatCompetitors.list({ attemptId: attempt.id });
    const myEntry = [];
    for (const c of comps) {
      if (!c.competitorEntryId) continue;
      const entry = await this.uow.entries.get(c.competitorEntryId);
      if (entry?.profileId === actor.profile.id) myEntry.push(entry);
    }
    if (!myEntry[0]) forbidden("Only the competing member may submit this recipe.");
    const existing = await this.uow.recipes.findOne({
      heatAttemptId: attempt.id,
      competitorEntryId: myEntry[0].id,
    });
    const publicRecipe = toPublicRecipe(input);
    if (existing && !existing.correctionRequestedAt) {
      conflict("Submitted recipes are immutable. Ask the organiser to request a correction.");
    }
    if (existing && existing.correctionRequestedAt) {
      await this.uow.recipes.update(existing.id, {
        ...this.recipeFields(publicRecipe),
        lockedAt: this.clock.now(),
        correctionRequestedAt: null,
        correctionRequestedBy: null,
        correctionNote: null,
      });
      await this.audit("recipe_correction_confirmed", {
        eventId: event.id,
        actorId: actor.profile.id,
        entityType: "recipe",
        entityId: existing.id,
      });
    } else {
      const recipeId = id();
      await this.uow.recipes.insert({
        id: recipeId,
        heatAttemptId: attempt.id,
        competitorEntryId: myEntry[0].id,
        ...this.recipeFields(publicRecipe),
        lockedAt: this.clock.now(),
        correctionRequestedAt: null,
        correctionRequestedBy: null,
        correctionNote: null,
        createdAt: this.clock.now(),
      });
      await this.audit("recipe_submitted", {
        eventId: event.id,
        actorId: actor.profile.id,
        entityType: "recipe",
        entityId: recipeId,
      });
    }
    await this.maybeRecipesComplete(attempt.id);
    return { locked: true };
  }

  private recipeFields(recipe: PublicRecipe) {
    return {
      doseGrams: recipe.doseGrams,
      yieldGrams: recipe.yieldGrams,
      extractionTimeSeconds: recipe.extractionTimeSeconds,
      waterTempC: recipe.waterTempC ?? null,
      grindSetting: recipe.grindSetting ?? null,
      preInfusionSeconds: recipe.preInfusionSeconds ?? null,
      pressureOrFlow: recipe.pressureOrFlow ?? null,
      basket: recipe.basket ?? null,
      distribution: recipe.distribution ?? null,
      tampingNotes: recipe.tampingNotes ?? null,
      tds: recipe.tds ?? null,
      notes: recipe.notes ?? null,
    };
  }

  async requestRecipeCorrection(actor: Actor, recipeId: string, note: string) {
    const recipe = await this.uow.recipes.get(recipeId);
    if (!recipe) notFound("Recipe not found.");
    const attempt = await this.uow.attempts.get(recipe.heatAttemptId);
    if (!attempt) notFound("Heat attempt not found.");
    const event = await this.requireEvent(attempt.eventId);
    await this.requireOrganiser(actor, event);
    if (!note.trim()) badRequest("A correction request needs a visible reason.");
    await this.uow.recipes.update(recipeId, {
      correctionRequestedAt: this.clock.now(),
      correctionRequestedBy: actor.profile.id,
      correctionNote: note.trim(),
    });
    await this.audit("recipe_correction_requested", {
      eventId: event.id,
      actorId: actor.profile.id,
      entityType: "recipe",
      entityId: recipeId,
      payload: { note: note.trim() },
    });
  }

  async getRecipeForCompetitor(actor: Actor, heatId: string) {
    const heat = await this.uow.heats.get(heatId);
    if (!heat) notFound("Heat not found.");
    const event = await this.requireEvent(heat.eventId);
    const attempt = heat.currentAttemptId ? await this.uow.attempts.get(heat.currentAttemptId) : null;
    if (!attempt) notFound("Heat attempt not found.");
    const comps = await this.uow.heatCompetitors.list({ attemptId: attempt.id });
    let myEntryId: string | null = null;
    for (const c of comps) {
      if (!c.competitorEntryId) continue;
      const entry = await this.uow.entries.get(c.competitorEntryId);
      if (entry?.profileId === actor.profile.id) myEntryId = entry.id;
    }
    if (!myEntryId) forbidden("This recipe form is only available to the competing member.");
    const recipe = await this.uow.recipes.findOne({ heatAttemptId: attempt.id, competitorEntryId: myEntryId });
    const opponent = comps.find((c) => c.competitorEntryId && c.competitorEntryId !== myEntryId);
    let opponentName: string | null = null;
    if (opponent?.competitorEntryId) {
      const entry = await this.uow.entries.get(opponent.competitorEntryId);
      const profile = entry ? await this.uow.profiles.get(entry.profileId) : null;
      opponentName = profile?.displayName ?? null;
    }
    return {
      heatLabel: heat.label,
      eventName: event.name,
      opponentName,
      unlocked: recipesUnlocked(attempt.status, attempt.brewingCompletedAt),
      recipe,
    };
  }

  async voidHeat(actor: Actor, heatId: string, reason: string) {
    const { event, attempt, heat } = await this.requireOrganiserHeat(actor, heatId);
    if (!reason || reason.trim().length < 8) badRequest("Voiding a heat requires a recorded reason.");
    assertTransition(attempt.status, "void");
    await this.uow.attempts.update(attempt.id, {
      status: "void",
      voidReason: reason.trim(),
      voidedAt: this.clock.now(),
      voidedByProfileId: actor.profile.id,
    });
    const attemptNumber = attempt.attemptNumber + 1;
    const newAttemptId = id();
    const comps = await this.uow.heatCompetitors.list({ attemptId: attempt.id });
    await this.uow.attempts.insert({
      id: newAttemptId,
      heatId: heat.id,
      eventId: event.id,
      attemptNumber,
      status: "scheduled",
      voidReason: null,
      voidedAt: null,
      voidedByProfileId: null,
      codesConfirmedAt: null,
      brewingCompletedAt: null,
      judgingOpenedAt: null,
      resultRevealedAt: null,
      winnerEntryId: null,
      winnerCupCode: null,
      scorePayload: null,
      createdAt: this.clock.now(),
    });
    await this.uow.heats.update(heat.id, { currentAttemptId: newAttemptId });
    for (const c of comps) {
      await this.uow.heatCompetitors.insert({
        id: id(),
        heatId: heat.id,
        attemptId: newAttemptId,
        competitorEntryId: c.competitorEntryId,
        slot: c.slot,
        isBye: c.isBye,
        advancedFromHeatId: c.advancedFromHeatId,
      });
    }
    await this.audit("heat_voided", {
      eventId: event.id,
      actorId: actor.profile.id,
      entityType: "heat",
      entityId: heat.id,
      payload: { reason: reason.trim(), previousAttemptId: attempt.id },
    });
    await this.audit("heat_restarted", {
      eventId: event.id,
      actorId: actor.profile.id,
      entityType: "heat",
      entityId: heat.id,
      payload: { attemptNumber },
    });
  }

  async completeEvent(actor: Actor, eventId: string) {
    const event = await this.requireEvent(eventId);
    await this.requireOrganiser(actor, event);
    const heats = await this.uow.heats.list({ eventId });
    for (const heat of heats) {
      const attempt = heat.currentAttemptId ? await this.uow.attempts.get(heat.currentAttemptId) : null;
      if (!attempt || attempt.status !== "complete") {
        badRequest("The event cannot complete with missing recipes or unresolved heats.");
      }
      if (!heat.isBye) {
        const recipes = await this.uow.recipes.list({ heatAttemptId: attempt.id });
        const comps = (await this.uow.heatCompetitors.list({ attemptId: attempt.id })).filter(
          (c) => c.competitorEntryId && !c.isBye,
        );
        if (recipes.length < comps.length) {
          badRequest("The event cannot complete with missing recipes or unresolved heats.");
        }
      }
    }
    const final = heats.find((h) => h.label === "Final");
    const finalAttempt = final?.currentAttemptId ? await this.uow.attempts.get(final.currentAttemptId) : null;
    const pub = await this.uow.publications.findOne({ eventId });
    await this.uow.events.update(eventId, {
      status: "completed",
      completedAt: this.clock.now(),
      championEntryId: finalAttempt?.winnerEntryId ?? null,
    });
    if (pub) await this.uow.publications.update(pub.id, { recipesReleasedAt: this.clock.now() });
    await this.audit("event_completed", {
      eventId,
      actorId: actor.profile.id,
      entityType: "event",
      entityId: eventId,
    });
  }

  async getPublicEvent(slug: string) {
    const event = await this.uow.events.findOne({ slug });
    if (!event) notFound("Event not found.");
    if (event.status === "draft") notFound("Event not found.");
    const pub = await this.uow.publications.findOne({ eventId: event.id });
    const completed = event.status === "completed";
    const entries = await this.uow.entries.list({ eventId: event.id });
    const roster = [];
    for (const entry of entries) {
      const profile = await this.uow.profiles.get(entry.profileId);
      roster.push({
        displayName: profile?.displayName ?? "Competitor",
        organisation: profile?.organisation ?? null,
        country: profile?.country ?? null,
        seed: event.bracketLockedAt ? entry.seed : null,
      });
    }
    const heats = await this.uow.heats.list({ eventId: event.id });
    const publicHeats = [];
    for (const heat of [...heats].sort((a, b) => a.label.localeCompare(b.label))) {
      const attempt = heat.currentAttemptId ? await this.uow.attempts.get(heat.currentAttemptId) : null;
      if (!attempt) continue;
      const comps = await this.uow.heatCompetitors.list({ attemptId: attempt.id });
      const names = [];
      for (const c of comps) {
        if (!c.competitorEntryId) {
          names.push(c.isBye ? "Bye" : "TBD");
          continue;
        }
        const entry = await this.uow.entries.get(c.competitorEntryId);
        const profile = entry ? await this.uow.profiles.get(entry.profileId) : null;
        names.push(profile?.displayName ?? "Competitor");
      }
      const ballots = await this.uow.ballots.list({ heatAttemptId: attempt.id });
      const assignments = await this.uow.judgeAssignments.list({ heatAttemptId: attempt.id });
      const revealed = ["result_revealed", "recipes_complete", "complete"].includes(attempt.status);
      let winnerName: string | null = null;
      let totals: unknown = null;
      if (revealed && attempt.winnerEntryId) {
        const entry = await this.uow.entries.get(attempt.winnerEntryId);
        const profile = entry ? await this.uow.profiles.get(entry.profileId) : null;
        winnerName = profile?.displayName ?? null;
        const score = attempt.scorePayload as { totals?: { cupCode: string; total: number; votes: number }[] } | null;
        if (score?.totals) {
          totals = score.totals.map((t) => ({ total: t.total, votes: t.votes }));
        }
      }
      const recipes =
        completed && pub?.recipesReleasedAt
          ? await this.publicRecipesForAttempt(attempt.id, names)
          : [];
      publicHeats.push({
        id: heat.id,
        label: heat.label,
        status: attempt.status,
        isBye: heat.isBye,
        competitors: names,
        ballotProgress: heat.isBye
          ? null
          : { submitted: ballots.length, required: Math.max(assignments.length, event.judgeCount) },
        winnerName,
        totals: revealed ? totals : null,
        recipes,
      });
    }
    let champion: string | null = null;
    if (event.championEntryId) {
      const entry = await this.uow.entries.get(event.championEntryId);
      const profile = entry ? await this.uow.profiles.get(entry.profileId) : null;
      champion = profile?.displayName ?? null;
    }
    const liveHeat = publicHeats.find((h) =>
      ["staged", "brewing", "brewing_complete", "judging_open", "ballots_complete"].includes(h.status),
    );
    return {
      slug: event.slug,
      name: event.name,
      hostName: event.hostName,
      hostLogoUrl: event.hostLogoUrl,
      startsAt: event.startsAt,
      timezone: event.timezone,
      venue: event.venue,
      city: event.city,
      country: event.country,
      description: event.description,
      coffeeName: event.coffeeName,
      coffeeType: event.coffeeType,
      coffeeNotes: event.coffeeNotes,
      espressoMachine: event.espressoMachine,
      grinder: event.grinder,
      basket: event.basket,
      waterSpec: event.waterSpec,
      otherControls: event.otherControls,
      tier: event.tier,
      judgingFormat: event.judgingFormat,
      judgeCount: event.judgeCount,
      status: event.status,
      live: event.status === "live",
      completedAt: event.completedAt,
      roster,
      heats: publicHeats,
      currentHeat: liveHeat ?? null,
      champion,
      recipesReleased: !!pub?.recipesReleasedAt,
      judgingExplanation:
        event.judgingFormat === "wec_v3"
          ? "Official WEC Scoring v3: three judges independently award Tactile (15), Taste (10), and Flavour (8) to one coded cup. 99 points in total. 50 or more wins."
          : "Simple Blind A/B: each judge chooses the coded cup that tastes better. The majority of an odd judge panel decides.",
    };
  }

  private async publicRecipesForAttempt(attemptId: string, competitorNames: string[]) {
    const recipes = await this.uow.recipes.list({ heatAttemptId: attemptId });
    const out = [];
    for (const recipe of recipes) {
      const entry = await this.uow.entries.get(recipe.competitorEntryId);
      const profile = entry ? await this.uow.profiles.get(entry.profileId) : null;
      out.push({
        competitorName: profile?.displayName ?? competitorNames[0],
        ...toPublicRecipe({
          doseGrams: recipe.doseGrams,
          yieldGrams: recipe.yieldGrams,
          extractionTimeSeconds: recipe.extractionTimeSeconds,
          waterTempC: recipe.waterTempC,
          grindSetting: recipe.grindSetting,
          preInfusionSeconds: recipe.preInfusionSeconds,
          pressureOrFlow: recipe.pressureOrFlow,
          basket: recipe.basket,
          distribution: recipe.distribution,
          tampingNotes: recipe.tampingNotes,
          tds: recipe.tds,
          notes: recipe.notes,
        }),
      });
    }
    return out;
  }

  async getHiddenRecipe(actor: Actor, recipeId: string) {
    const recipe = await this.uow.recipes.get(recipeId);
    if (!recipe) notFound("Recipe not found.");
    const attempt = await this.uow.attempts.get(recipe.heatAttemptId);
    if (!attempt) notFound("Heat attempt not found.");
    const event = await this.requireEvent(attempt.eventId);
    const entry = await this.uow.entries.get(recipe.competitorEntryId);
    const pub = await this.uow.publications.findOne({ eventId: event.id });
    const ms = await this.membershipsFor(event.id, actor.profile.id);
    const decision = canViewHiddenRecipe(
      roleContext(actor, ms),
      entry?.profileId ?? "",
      event.status === "completed" && !!pub?.recipesReleasedAt,
    );
    if (!decision.allow) forbidden(decision.reason);
    return recipe;
  }

  async getCupMappings(actor: Actor, eventId: string) {
    return this.getStewardView(actor, eventId);
  }

  async recordCheckoutSession(actor: Actor, eventId: string, stripeSessionId: string, amountCents: number) {
    const event = await this.requireEvent(eventId);
    await this.requireOrganiser(actor, event);
    if (event.tier !== "premium") badRequest("Only Premium Espresso Tournaments require a licence payment.");
    let licence = await this.licenceFor(eventId);
    if (!licence) {
      licence = {
        id: id(),
        eventId,
        status: "pending",
        grantedByProfileId: null,
        grantReason: null,
        paidAt: null,
        createdAt: this.clock.now(),
        updatedAt: this.clock.now(),
      };
      await this.uow.licences.insert(licence);
    } else {
      await this.uow.licences.update(licence.id, { status: "pending", updatedAt: this.clock.now() });
    }
    const existing = await this.uow.payments.findOne({ stripeSessionId });
    if (existing) return existing;
    const payment = {
      id: id(),
      eventId,
      licenceId: licence.id,
      stripeSessionId,
      stripePaymentIntentId: null,
      amountCents,
      currency: PREMIUM_CURRENCY,
      status: "pending" as const,
      paidAt: null,
      createdAt: this.clock.now(),
    };
    await this.uow.payments.insert(payment);
    await this.audit("payment_pending", {
      eventId,
      actorId: actor.profile.id,
      entityType: "payment",
      entityId: payment.id,
    });
    return payment;
  }

  async applyStripeWebhook(stripeEventId: string, type: string, stripeSessionId: string, metadataEventId?: string) {
    const seen = await this.uow.stripeEvents.get(stripeEventId);
    const payment = await this.uow.payments.findOne({ stripeSessionId });
    if (!payment) {
      if (seen) return { ignored: true };
      return { ignored: true, reason: "Unknown checkout session." };
    }
    const result = applyVerifiedPaymentWebhook({
      payment: {
        id: payment.id,
        eventId: payment.eventId,
        stripeSessionId: payment.stripeSessionId,
        amountCents: payment.amountCents,
        currency: payment.currency,
        status: payment.status,
      },
      event: {
        type,
        stripeSessionId,
        metadataEventId: metadataEventId ?? payment.eventId,
        alreadyProcessed: !!seen,
      },
    });
    if (!seen) {
      await this.uow.stripeEvents.insert({ id: stripeEventId, type, createdAt: this.clock.now() });
    }
    const licence = await this.licenceFor(payment.eventId);
    if (!result.ignored) {
      await this.uow.payments.update(payment.id, {
        status:
          result.licenceStatus === "paid"
            ? "paid"
            : result.licenceStatus === "refunded"
              ? "refunded"
              : result.licenceStatus === "expired"
                ? "expired"
                : result.licenceStatus === "failed"
                  ? "failed"
                  : payment.status,
        paidAt: result.licenceStatus === "paid" ? this.clock.now() : payment.paidAt,
      });
      if (licence) {
        await this.uow.licences.update(licence.id, {
          status: result.licenceStatus,
          paidAt: result.licenceStatus === "paid" ? this.clock.now() : licence.paidAt,
          updatedAt: this.clock.now(),
        });
      }
      await this.audit(
        result.licenceStatus === "paid"
          ? "payment_paid"
          : result.licenceStatus === "failed"
            ? "payment_failed"
            : result.licenceStatus === "expired"
              ? "payment_expired"
              : result.licenceStatus === "refunded"
                ? "payment_refunded"
                : "payment_pending",
        {
          eventId: payment.eventId,
          entityType: "payment",
          entityId: payment.id,
        },
      );
    }
    return result;
  }

  clientRedirectStatus() {
    return clientRedirectDoesNotUnlock();
  }

  async grantComplimentary(actor: Actor, eventId: string, reason: string) {
    if (!actor.profile.isPlatformAdmin) forbidden("Complimentary access requires a WEC platform administrator.");
    complimentaryRequiresReason(reason);
    const event = await this.requireEvent(eventId);
    let licence = await this.licenceFor(eventId);
    if (!licence) {
      licence = {
        id: id(),
        eventId,
        status: "complimentary",
        grantedByProfileId: actor.profile.id,
        grantReason: reason.trim(),
        paidAt: this.clock.now(),
        createdAt: this.clock.now(),
        updatedAt: this.clock.now(),
      };
      await this.uow.licences.insert(licence);
    } else {
      await this.uow.licences.update(licence.id, {
        status: "complimentary",
        grantedByProfileId: actor.profile.id,
        grantReason: reason.trim(),
        paidAt: this.clock.now(),
        updatedAt: this.clock.now(),
      });
    }
    await this.audit("complimentary_granted", {
      eventId,
      actorId: actor.profile.id,
      entityType: "licence",
      entityId: licence.id,
      payload: { reason: reason.trim() },
    });
  }

  async getOrganiserDashboard(actor: Actor, eventId: string) {
    const event = await this.requireEvent(eventId);
    await this.requireOrganiser(actor, event);
    const licence = await this.licenceFor(eventId);
    const entries = await this.uow.entries.list({ eventId });
    const memberships = await this.uow.memberships.list({ eventId });
    const heats = await this.uow.heats.list({ eventId });
    const audits = (await this.uow.audits.list({ eventId })).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
    const people = [];
    const seenPeople = new Set<string>();
    for (const m of memberships) {
      if (seenPeople.has(m.profileId)) continue;
      seenPeople.add(m.profileId);
      const profile = await this.uow.profiles.get(m.profileId);
      if (profile) people.push({ id: profile.id, displayName: profile.displayName, email: profile.email });
    }
    const heatViews = [];
    for (const heat of heats) {
      const attempt = heat.currentAttemptId ? await this.uow.attempts.get(heat.currentAttemptId) : null;
      const judges = attempt ? await this.uow.judgeAssignments.list({ heatAttemptId: attempt.id }) : [];
      const ballots = attempt ? await this.uow.ballots.list({ heatAttemptId: attempt.id }) : [];
      const recipes = attempt ? await this.uow.recipes.list({ heatAttemptId: attempt.id }) : [];
      const comps = attempt ? await this.uow.heatCompetitors.list({ attemptId: attempt.id }) : [];
      const names = [];
      for (const c of comps) {
        if (!c.competitorEntryId) {
          names.push({ name: c.isBye ? "Bye" : "TBD", recipeLocked: false, entryId: null as string | null });
          continue;
        }
        const entry = await this.uow.entries.get(c.competitorEntryId);
        const profile = entry ? await this.uow.profiles.get(entry.profileId) : null;
        names.push({
          name: profile?.displayName ?? "Competitor",
          recipeLocked: recipes.some((r) => r.competitorEntryId === c.competitorEntryId),
          entryId: c.competitorEntryId,
        });
      }
      heatViews.push({
        id: heat.id,
        label: heat.label,
        isBye: heat.isBye,
        status: attempt?.status ?? "scheduled",
        competitors: names,
        judgesAssigned: judges.length,
        ballotsSubmitted: ballots.length,
        recipesLocked: recipes.length,
        stewardConfirmed: !!attempt?.codesConfirmedAt,
        winnerEntryId: attempt?.winnerEntryId ?? null,
      });
    }
    return {
      event,
      licence,
      entries,
      memberships,
      people,
      heats: heatViews,
      audits: audits.slice(0, 100),
      publicPath: `/throwdown/e/${event.slug}`,
      priceCents: PREMIUM_PRICE_CENTS,
    };
  }

  async listMyEvents(actor: Actor) {
    const memberships = await this.uow.memberships.list({ profileId: actor.profile.id });
    const accepted = memberships.filter((m) => m.status === "accepted");
    const events = [];
    const seen = new Set<string>();
    for (const m of accepted) {
      if (seen.has(m.eventId)) continue;
      seen.add(m.eventId);
      const event = await this.uow.events.get(m.eventId);
      if (event) events.push({ event, roles: accepted.filter((x) => x.eventId === m.eventId).map((x) => x.role) });
    }
    return events;
  }

  async myAssignments(actor: Actor) {
    const events = await this.listMyEvents(actor);
    const judgeHeats = [];
    const recipeHeats = [];
    const stewardEvents = [];
    for (const row of events) {
      if (row.roles.includes("cup_steward")) {
        stewardEvents.push({ eventId: row.event.id, name: row.event.name, slug: row.event.slug });
      }
      const heats = await this.uow.heats.list({ eventId: row.event.id });
      for (const heat of heats) {
        if (!heat.currentAttemptId) continue;
        const attempt = await this.uow.attempts.get(heat.currentAttemptId);
        if (!attempt || attempt.status === "void") continue;
        const assignment = await this.uow.judgeAssignments.findOne({
          heatAttemptId: attempt.id,
          profileId: actor.profile.id,
        });
        if (assignment) {
          judgeHeats.push({
            eventId: row.event.id,
            eventName: row.event.name,
            heatId: heat.id,
            heatLabel: heat.label,
            status: attempt.status,
          });
        }
        const comps = await this.uow.heatCompetitors.list({ attemptId: attempt.id });
        for (const c of comps) {
          if (!c.competitorEntryId) continue;
          const entry = await this.uow.entries.get(c.competitorEntryId);
          if (entry?.profileId === actor.profile.id) {
            recipeHeats.push({
              eventId: row.event.id,
              eventName: row.event.name,
              heatId: heat.id,
              heatLabel: heat.label,
              status: attempt.status,
              unlocked: recipesUnlocked(attempt.status, attempt.brewingCompletedAt),
            });
          }
        }
      }
    }
    return { events, judgeHeats, recipeHeats, stewardEvents };
  }

  async listAdminEvents(actor: Actor) {
    if (!actor.profile.isPlatformAdmin) forbidden("Platform administrator access required.");
    return this.uow.events.list();
  }

  async getAuditLog(actor: Actor, eventId: string) {
    const event = await this.requireEvent(eventId);
    if (!actor.profile.isPlatformAdmin) await this.requireOrganiser(actor, event);
    return (await this.uow.audits.list({ eventId })).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getConfig() {
    return {
      premiumPriceCents: PREMIUM_PRICE_CENTS,
      premiumCurrency: PREMIUM_CURRENCY,
      publicBaseUrl: this.publicBaseUrl,
    };
  }
}

export function hashInviteToken(token: string) {
  return hashSecret(token);
}

export { hashSecret };

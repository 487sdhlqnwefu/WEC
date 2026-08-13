import { useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatMs } from "@/wlat/formatMs";

const STEPS = [
  "Identity",
  "Field",
  "Format",
  "Delivery",
  "Voting",
  "Participation",
  "Equipment",
  "Timings",
  "Patterns",
  "Staff",
  "Review",
] as const;

export default function WlatOrganise() {
  const { eventId } = useParams();
  const [params] = useSearchParams();
  const overview = trpc.wlat.organiserOverview.useQuery(
    { eventId: eventId || "" },
    { enabled: Boolean(eventId), refetchInterval: 2000 },
  );
  const warnings = trpc.wlat.setupWarnings.useQuery({ eventId: eventId || "" }, { enabled: Boolean(eventId) });
  const save = trpc.wlat.saveWizard.useMutation();
  const checkout = trpc.wlat.createCheckout.useMutation();
  const lock = trpc.wlat.lockRoster.useMutation();
  const bracket = trpc.wlat.generateBracket.useMutation();
  const start = trpc.wlat.startHeat.useMutation();
  const transition = trpc.wlat.transitionHeat.useMutation();
  const timer = trpc.wlat.operateTimer.useMutation();
  const finalize = trpc.wlat.finalizeHeat.useMutation();
  const restart = trpc.wlat.restartHeat.useMutation();
  const complete = trpc.wlat.completeEvent.useMutation();
  const invite = trpc.wlat.invite.useMutation();
  const addEntry = trpc.wlat.addEntry.useMutation();
  const utils = trpc.useUtils();
  const [step, setStep] = useState(0);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("judge");
  const [entryName, setEntryName] = useState("");
  const [restartNotes, setRestartNotes] = useState("");
  const [inviteToken, setInviteToken] = useState("");

  const event = overview.data?.event;
  const active = overview.data?.activeHeat;
  const nextHeat = useMemo(
    () => overview.data?.heats.find((h) => h.state === "scheduled"),
    [overview.data],
  );

  async function refresh() {
    await utils.wlat.organiserOverview.invalidate();
    await utils.wlat.setupWarnings.invalidate();
  }

  if (!event) return <div className="p-10 text-sand-400">Loading organiser console…</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-cinnamon-400">{event.status}</p>
          <h1 className="text-3xl font-bold">{event.name}</h1>
          <p className="text-sand-500 text-sm">
            Payment {overview.data?.payment?.status} · slug {event.slug}
            {params.get("paid") === "mock" ? " · mock licence unlocked" : ""}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link className="text-sm text-cinnamon-300" to={`/throwdown/e/${event.slug}`}>Public page</Link>
          <Link className="text-sm text-cinnamon-300" to={`/throwdown/e/${event.slug}/board`}>Board</Link>
        </div>
      </div>

      {overview.data?.payment?.status !== "paid" && (
        <section className="rounded-xl border border-gold/40 bg-gold/5 p-5 mb-6">
          <h2 className="font-semibold mb-2">USD 300 tournament licence</h2>
          <p className="text-sm text-sand-400 mb-3">
            Roster lock, bracket, live heats, and publishing stay closed until the Stripe webhook marks the event paid.
          </p>
          <Button
            className="bg-gold text-[#1a1410]"
            onClick={async () => {
              const session = await checkout.mutateAsync({ eventId: event.id });
              if (session.url) window.location.href = session.url;
            }}
          >
            Pay USD 300
          </Button>
        </section>
      )}

      <section className="rounded-xl border border-[#3a2a1f] bg-[#1b140f] p-5 mb-6">
        <h2 className="font-semibold mb-3">Setup wizard</h2>
        <div className="flex flex-wrap gap-1 mb-4">
          {STEPS.map((label, i) => (
            <button
              key={label}
              onClick={() => setStep(i)}
              className={`px-2 py-1 text-xs rounded ${i === step ? "bg-cinnamon-600" : "bg-[#241910] text-sand-400"}`}
            >
              {i + 1}. {label}
            </button>
          ))}
        </div>
        {step === 0 && (
          <Field label="Event name">
            <Input defaultValue={event.name} onBlur={(e) => save.mutate({ eventId: event.id, patch: { name: e.target.value } })} className="bg-[#140e0a] border-[#3a2a1f]" />
          </Field>
        )}
        {step === 1 && (
          <Field label="Field size (8–128)">
            <Input type="number" defaultValue={event.fieldSize} onBlur={(e) => save.mutate({ eventId: event.id, patch: { fieldSize: Number(e.target.value) } })} className="bg-[#140e0a] border-[#3a2a1f]" />
          </Field>
        )}
        {step === 2 && (
          <div className="flex gap-2">
            {(["freestyle", "match_pattern"] as const).map((format) => (
              <Button key={format} variant={event.competitionFormat === format ? "default" : "outline"} onClick={() => save.mutate({ eventId: event.id, patch: { competitionFormat: format } })}>
                {format === "freestyle" ? "Freestyle" : "Match the Pattern"}
              </Button>
            ))}
          </div>
        )}
        {step === 3 && (
          <div className="flex gap-2">
            {(["physical", "online"] as const).map((mode) => (
              <Button key={mode} variant={event.judgingDeliveryMode === mode ? "default" : "outline"} onClick={() => save.mutate({ eventId: event.id, patch: { judgingDeliveryMode: mode } })}>
                {mode}
              </Button>
            ))}
          </div>
        )}
        {step === 4 && (
          <div className="space-y-3">
            <div className="flex gap-2">
              {(["official_panel", "open_member"] as const).map((model) => (
                <Button key={model} variant={event.votingModel === model ? "default" : "outline"} onClick={() => save.mutate({ eventId: event.id, patch: { votingModel: model } })}>
                  {model.replace("_", " ")}
                </Button>
              ))}
            </div>
            <Field label="Official judge count (1, 3, 5, 7)">
              <Input type="number" defaultValue={event.officialJudgeCount} onBlur={(e) => save.mutate({ eventId: event.id, patch: { officialJudgeCount: Number(e.target.value) } })} className="bg-[#140e0a] border-[#3a2a1f]" />
            </Field>
          </div>
        )}
        {step === 6 && (
          <div className="flex gap-2">
            {(["central_shot_service", "competitor_complete"] as const).map((mode) => (
              <Button key={mode} variant={event.equipmentMode === mode ? "default" : "outline"} onClick={() => save.mutate({ eventId: event.id, patch: { equipmentMode: mode } })}>
                {mode.replaceAll("_", " ")}
              </Button>
            ))}
          </div>
        )}
        {step >= 9 && (
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input placeholder="staff@email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} className="bg-[#140e0a] border-[#3a2a1f]" />
              <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} className="bg-[#140e0a] border border-[#3a2a1f] rounded-md px-2">
                {["blind_steward", "judge", "tiebreak_judge", "shot_barista", "co_organiser", "competitor"].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <Button
                onClick={async () => {
                  const result = await invite.mutateAsync({ eventId: event.id, email: inviteEmail, role: inviteRole as never });
                  setInviteToken(result.token);
                }}
              >
                Invite
              </Button>
            </div>
            {inviteToken && <p className="text-xs break-all text-sand-400">Invite token (send the link): {inviteToken}</p>}
            <div className="flex gap-2">
              <Input placeholder="Solo entry display name" value={entryName} onChange={(e) => setEntryName(e.target.value)} className="bg-[#140e0a] border-[#3a2a1f]" />
              <Button onClick={async () => { await addEntry.mutateAsync({ eventId: event.id, displayName: entryName, memberIds: [] }); refresh(); }}>Add placeholder entry</Button>
            </div>
            <p className="text-xs text-sand-500">Entries still need member profiles and accepted invitations before lock.</p>
          </div>
        )}
        {step === 10 && (
          <ul className="text-sm space-y-1">
            {(warnings.data?.warnings ?? []).map((w) => (
              <li key={w.code} className={w.blocking ? "text-red-300" : "text-gold"}>{w.message}</li>
            ))}
            {!warnings.data?.warnings.length && <li className="text-green-300">Ready to lock.</li>}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-[#3a2a1f] bg-[#1b140f] p-5 mb-6">
        <h2 className="font-semibold mb-3">Roster, bracket, live heat</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          <Button onClick={async () => { await lock.mutateAsync({ eventId: event.id }); refresh(); }}>Lock roster</Button>
          <Button variant="outline" onClick={async () => { await bracket.mutateAsync({ eventId: event.id, method: "random" }); refresh(); }}>Generate + lock bracket</Button>
          {nextHeat && (
            <Button onClick={async () => { await start.mutateAsync({ heatId: nextHeat.id }); refresh(); }}>Start next heat</Button>
          )}
          {active && (
            <>
              <Button variant="outline" onClick={async () => { await transition.mutateAsync({ heatId: active.id, to: nextState(active.state, event.competitionFormat) }); refresh(); }}>Advance phase</Button>
              <Button variant="outline" onClick={async () => { await timer.mutateAsync({ heatId: active.id, action: "start", phase: phaseFor(active.state), version: active.timer?.version ?? 0 }); refresh(); }}>Start timer</Button>
              <Button variant="outline" onClick={async () => { await timer.mutateAsync({ heatId: active.id, action: "pause", phase: phaseFor(active.state), version: active.timer?.version ?? 0, reason: "Floor hold" }); refresh(); }}>Pause</Button>
              <Button onClick={async () => { await finalize.mutateAsync({ heatId: active.id }); refresh(); }}>Finalise result</Button>
            </>
          )}
          <Button variant="outline" onClick={async () => { await complete.mutateAsync({ eventId: event.id }); refresh(); }}>Complete + publish</Button>
        </div>
        {active && (
          <div className="rounded-lg border border-cinnamon-800/60 p-4 mb-4">
            <div className="text-sm text-sand-500">Active heat {active.heatNumber} · {active.state}</div>
            <div className="text-4xl font-semibold tabular-nums text-gold my-2">
              {active.timer ? formatMs(active.timer.remainingMs) : "--:--"}
            </div>
            <div className="text-sm">Uploads: {active.photos.map((p) => p.status).join(", ") || "none"}</div>
            {active.ballotProgress && <div className="text-sm">{active.ballotProgress.submitted} of {active.ballotProgress.required} ballots</div>}
            <div className="mt-3">
              <Textarea value={restartNotes} onChange={(e) => setRestartNotes(e.target.value)} placeholder="Restart notes" className="bg-[#140e0a] border-[#3a2a1f] mb-2" />
              <Button
                variant="destructive"
                onClick={async () => {
                  await restart.mutateAsync({
                    heatId: active.id,
                    reason: "espresso_machine_failure",
                    notes: restartNotes || "Steam boiler failure confirmed by staff.",
                  });
                  refresh();
                }}
              >
                One qualifying restart
              </Button>
            </div>
          </div>
        )}
        <div className="grid md:grid-cols-2 gap-2 text-sm">
          {(overview.data?.heats ?? []).slice(0, 16).map((heat) => (
            <div key={heat.id} className="border border-[#3a2a1f] rounded p-2 flex justify-between">
              <span>Heat {heat.heatNumber}</span>
              <span className="text-sand-500">{heat.state}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="text-sm text-sand-500 space-y-2">
        <h2 className="text-sand-200 font-semibold">Venue blindness checklist</h2>
        <p>Software cannot hide people on stage. Keep screens, announcements, service order, cup placement, photography, and judge seating from revealing who poured A or B.</p>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm mb-3">
      <span className="text-sand-400">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

function nextState(state: string, format: string): string {
  const map: Record<string, string> = {
    check_in: format === "match_pattern" ? "pattern_reveal" : "prep",
    pattern_reveal: "prep",
    prep: "competition",
    competition: "photography",
    photography: "awaiting_uploads",
    awaiting_uploads: "judging_open",
    judging_open: "judging_closed",
    judging_closed: "finalized",
  };
  return map[state] ?? state;
}

function phaseFor(state: string): "prep" | "competition" | "photography" | "judging" | "cleanup" | "transition" {
  if (state === "prep") return "prep";
  if (state === "photography" || state === "awaiting_uploads") return "photography";
  if (state.includes("judging")) return "judging";
  return "competition";
}

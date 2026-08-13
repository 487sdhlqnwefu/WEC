import { useState } from "react";
import { Link, useParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function OrganiserDesk() {
  const { eventId = "" } = useParams();
  const utils = trpc.useUtils();
  const { data, isLoading, error, refetch } = trpc.throwdown.dashboard.useQuery(
    { eventId },
    { refetchInterval: 4000 },
  );
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"competitor" | "judge" | "cup_steward">("competitor");
  const [voidReason, setVoidReason] = useState("");
  const [activeHeat, setActiveHeat] = useState<string | null>(null);

  const invalidate = async () => {
    await utils.throwdown.dashboard.invalidate({ eventId });
    await refetch();
  };
  const onErr = (err: { message: string }) => toast.error(err.message);

  const invite = trpc.throwdown.invite.useMutation({ onSuccess: async (res) => { toast.success("Invitation created"); await navigator.clipboard?.writeText(res.url).catch(() => {}); await invalidate(); }, onError: onErr });
  const publish = trpc.throwdown.publish.useMutation({ onSuccess: invalidate, onError: onErr });
  const lock = trpc.throwdown.lockRoster.useMutation({ onSuccess: invalidate, onError: onErr });
  const bracket = trpc.throwdown.generateBracket.useMutation({ onSuccess: invalidate, onError: onErr });
  const stage = trpc.throwdown.stageHeat.useMutation({ onSuccess: invalidate, onError: onErr });
  const start = trpc.throwdown.startHeat.useMutation({ onSuccess: invalidate, onError: onErr });
  const brew = trpc.throwdown.markBrewingComplete.useMutation({ onSuccess: invalidate, onError: onErr });
  const judging = trpc.throwdown.openJudging.useMutation({ onSuccess: invalidate, onError: onErr });
  const reveal = trpc.throwdown.revealResult.useMutation({ onSuccess: invalidate, onError: onErr });
  const complete = trpc.throwdown.completeEvent.useMutation({ onSuccess: invalidate, onError: onErr });
  const assign = trpc.throwdown.assignJudges.useMutation({ onSuccess: invalidate, onError: onErr });
  const voidHeat = trpc.throwdown.voidHeat.useMutation({ onSuccess: invalidate, onError: onErr });
  const [judgePick, setJudgePick] = useState<Record<string, string[]>>({});

  if (isLoading) return <p className="p-8 text-sand-400">Loading organiser desk…</p>;
  if (error) return <Unauthorized message={error.message} />;
  if (!data) return null;
  const { event, licence, heats, publicPath, people, memberships } = data;
  const judges = memberships.filter((m) => m.role === "judge" && m.status === "accepted");
  const liveUrl = `${window.location.origin}${publicPath}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-cinnamon-400">Organiser desk</p>
          <h1 className="text-3xl font-bold text-sand-100">{event.name}</h1>
          <p className="text-sm text-sand-500">
            {event.tier === "premium" ? "Premium Espresso Tournament" : "Free Espresso Throwdown"} ·{" "}
            {event.judgingFormat === "wec_v3" ? "Official WEC Scoring v3" : "Simple Blind A/B"} · {event.judgeCount} judges
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm"><Link to={publicPath}>Public board</Link></Button>
          <Button asChild variant="outline" size="sm"><Link to={`/throwdown/events/${eventId}/audit`}>Audit log</Link></Button>
        </div>
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        <Card title="Checklist">
          <Check ok={!!event.cupStewardProfileId} label="Cup Steward assigned" />
          <Check ok={!!event.rosterLockedAt} label="Roster locked" />
          <Check ok={!!event.bracketLockedAt} label="Bracket locked" />
          <Check ok={event.status !== "draft"} label="Published" />
        </Card>
        <Card title="Payment">
          {event.tier === "free" ? <p>Free Throwdown — no licence required.</p> : (
            <>
              <p className="capitalize">{licence?.status ?? "unpaid"}</p>
              {licence?.status !== "paid" && licence?.status !== "complimentary" && (
                <Button asChild size="sm" className="mt-3 bg-gold text-[#1a1410]"><Link to={`/throwdown/events/${eventId}/pay`}>Pay USD 300</Link></Button>
              )}
            </>
          )}
        </Card>
        <Card title="Live board">
          <p className="break-all text-xs">{liveUrl}</p>
          <img
            alt="QR code for the public live board"
            className="mt-3 h-32 w-32 bg-white p-1"
            src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(liveUrl)}`}
          />
        </Card>
      </section>

      <section className="mt-8 wec-card p-5">
        <h2 className="font-semibold text-sand-100">Invitations</h2>
        <form
          className="mt-3 flex flex-col gap-2 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            invite.mutate({ eventId, email, role });
            setEmail("");
          }}
        >
          <Input type="email" required placeholder="email@cafe.test" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-[#1a1410]" />
          <select className="rounded-md border border-[#3a2a1f] bg-[#1a1410] px-2" value={role} onChange={(e) => setRole(e.target.value as typeof role)}>
            <option value="competitor">Competitor</option>
            <option value="judge">Judge</option>
            <option value="cup_steward">Cup Steward</option>
          </select>
          <Button type="submit" className="bg-cinnamon-600 text-sand-100" disabled={invite.isPending}>Send invite</Button>
        </form>
        <p className="mt-2 text-xs text-sand-500">Invites are single-purpose, expiring, and revocable. Premium drafts cannot send live invitations until payment is verified.</p>
      </section>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button onClick={() => publish.mutate({ eventId })} disabled={publish.isPending}>Publish</Button>
        <Button onClick={() => lock.mutate({ eventId })} disabled={lock.isPending}>Lock roster</Button>
        <Button onClick={() => bracket.mutate({ eventId })} disabled={bracket.isPending}>Generate bracket</Button>
        <Button variant="outline" onClick={() => complete.mutate({ eventId })} disabled={complete.isPending}>Complete event</Button>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold text-sand-100">Heats</h2>
        <div className="mt-4 space-y-3">
          {heats.map((heat) => (
            <article key={heat.id} className="wec-card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-sand-100">{heat.label}</h3>
                  <p className="text-xs text-sand-500">
                    {heat.status.replaceAll("_", " ")} · {heat.competitors.map((c) => c.name).join(" vs ")} · ballots {heat.ballotsSubmitted}/{event.judgeCount} · recipes {heat.recipesLocked}/2
                    {heat.stewardConfirmed ? " · codes confirmed" : ""}
                  </p>
                </div>
                {!heat.isBye && (
                  <div className="flex flex-wrap gap-2">
                    <select
                      multiple
                      className="max-h-24 rounded border border-[#3a2a1f] bg-[#1a1410] p-1 text-xs"
                      value={judgePick[heat.id] ?? []}
                      onChange={(e) =>
                        setJudgePick({
                          ...judgePick,
                          [heat.id]: [...e.target.selectedOptions].map((o) => o.value),
                        })
                      }
                    >
                      {judges.map((j) => {
                        const person = people.find((p) => p.id === j.profileId);
                        return (
                          <option key={j.profileId} value={j.profileId}>
                            {person?.displayName ?? j.profileId}
                          </option>
                        );
                      })}
                    </select>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => assign.mutate({ heatId: heat.id, profileIds: judgePick[heat.id] ?? [] })}
                    >
                      Assign judges
                    </Button>
                    <Button size="sm" onClick={() => stage.mutate({ heatId: heat.id })}>Stage &amp; code</Button>
                    <Button size="sm" onClick={() => start.mutate({ heatId: heat.id })}>Start</Button>
                    <Button size="sm" onClick={() => brew.mutate({ heatId: heat.id })}>Brewing complete</Button>
                    <Button size="sm" onClick={() => judging.mutate({ heatId: heat.id })}>Open judging</Button>
                    <Button size="sm" onClick={() => reveal.mutate({ heatId: heat.id })}>Reveal result</Button>
                    <Button size="sm" variant="outline" onClick={() => setActiveHeat(heat.id)}>Void…</Button>
                  </div>
                )}
              </div>
              {activeHeat === heat.id && (
                <form
                  className="mt-3 flex gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    voidHeat.mutate({ heatId: heat.id, reason: voidReason });
                    setActiveHeat(null);
                    setVoidReason("");
                  }}
                >
                  <Input required minLength={8} placeholder="Mandatory reason" value={voidReason} onChange={(e) => setVoidReason(e.target.value)} className="bg-[#1a1410]" />
                  <Button type="submit" variant="destructive">Void and restart</Button>
                </form>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="wec-card p-5 text-sm text-sand-300">
      <h2 className="mb-3 font-semibold text-sand-100">{title}</h2>
      {children}
    </section>
  );
}

function Check({ ok, label }: { ok: boolean; label: string }) {
  return (
    <p className={ok ? "text-sand-200" : "text-sand-500"}>
      <span aria-hidden>{ok ? "●" : "○"}</span> {label}
    </p>
  );
}

function Unauthorized({ message }: { message: string }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold text-sand-100">You cannot open this desk</h1>
      <p className="mt-3 text-sand-400">{message}</p>
      <Button asChild className="mt-6 bg-cinnamon-600"><Link to="/throwdown/sign-in">Sign in</Link></Button>
    </div>
  );
}

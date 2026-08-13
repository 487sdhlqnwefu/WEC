import { Link } from "react-router";
import { ArrowRight, EyeOff, Timer, Trophy, Camera, Users } from "lucide-react";
import { WLAT_ASSETS, WLAT_NAME, WLAT_PRICE } from "@/wlat/assets";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";

export default function WlatLanding() {
  const health = trpc.wlat.health.useQuery();
  const events = trpc.wlat.publicEvents.useQuery();

  return (
    <div>
      <section className="relative min-h-[88vh] flex items-center">
        <img
          src={WLAT_ASSETS.hero}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#140e0a]/70 via-[#140e0a]/80 to-[#140e0a]" />
        <div className="relative max-w-5xl mx-auto px-4 py-20 text-center">
          <p className="text-cinnamon-300 uppercase tracking-[0.25em] text-xs mb-6">From the World Espresso Championship</p>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-[0.95] text-sand-100 mb-6">
            {WLAT_NAME}
          </h1>
          <p className="text-lg text-sand-300 max-w-2xl mx-auto mb-8">
            Pay once. Run a blind, head-to-head latte art tournament for 8 to 128 competitors.
            One station. One shared timer. A or B. No scores.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Link to="/throwdown/create">
              <Button size="lg" className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100 px-8">
                Create a throwdown — {WLAT_PRICE}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/throwdown/login">
              <Button size="lg" variant="outline" className="border-sand-400/30 text-sand-100">
                Member sign in
              </Button>
            </Link>
          </div>
          <p className="text-xs text-sand-500">
            Licence {health.data?.licence.currency} {(health.data?.licence.amountMinor ?? 30000) / 100}. Checkout success is not enough — the webhook unlocks the event.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { icon: EyeOff, title: "Genuinely blind", body: "Judges never see names, countries, or stage sides. Only the Blind Steward can open the A/B mapping." },
          { icon: Trophy, title: "A or B. That's it.", body: "Freestyle: which looks better? Match the Pattern: which matches the reference better? Written comparative feedback is required." },
          { icon: Timer, title: "One shared clock", body: "Both entries share one server-authoritative timer. v1 is a single station with exactly one active heat." },
          { icon: Camera, title: "Every pour is archived", body: "A heat cannot continue until both photographs are stored. After publication they live on the member archive." },
          { icon: Users, title: "Physical or online", body: "Official panels of 1, 3, 5 or 7 judges — or Open Member Judging with a three-judge tiebreak." },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-[#3a2a1f] bg-[#1b140f] p-6">
            <item.icon className="h-6 w-6 text-gold mb-4" />
            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
            <p className="text-sand-400 text-sm leading-relaxed">{item.body}</p>
          </div>
        ))}
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl font-semibold">Public events</h2>
          <Link to="/throwdown/events" className="text-sm text-cinnamon-300">View directory</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {(events.data ?? []).slice(0, 6).map((event) => (
            <Link
              key={event.id}
              to={`/throwdown/e/${event.slug}`}
              className="rounded-xl border border-[#3a2a1f] bg-[#1b140f] p-5 hover:border-cinnamon-600/50"
            >
              <div className="text-xs uppercase tracking-widest text-cinnamon-400 mb-2">{event.status}</div>
              <div className="text-lg font-semibold">{event.name}</div>
              <div className="text-sm text-sand-500 mt-1">{event.city ?? "Location TBC"} · {event.format}</div>
            </Link>
          ))}
          {!events.data?.length && (
            <p className="text-sand-500">No published events yet. Create one to get started.</p>
          )}
        </div>
      </section>
    </div>
  );
}

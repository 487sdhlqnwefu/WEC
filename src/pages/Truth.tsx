import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Calendar,
  Coffee,
  MapPin,
  Handshake,
  Star,
} from "lucide-react";

/**
 * Announcement / truth page — Café Unido confirmed story for WEC 2026.
 * Legacy path: /truth.html
 */
export default function Truth() {
  return (
    <div>
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cinnamon-950/20 to-transparent" />
        <div className="wec-container relative">
          <div className="max-w-3xl">
            <span className="text-sm text-cinnamon-400 font-medium uppercase tracking-wider">
              Announcement
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-sand-100 mt-3 mb-6">
              The truth about{" "}
              <span className="wec-gradient-text">WEC 2026 Panama</span>
            </h1>
            <p className="text-lg sm:text-xl text-sand-400 leading-relaxed">
              For a while, the honest answer was: we might not pull it off
              alone. Here is what changed — and what is now confirmed.
            </p>
          </div>
        </div>
      </section>

      <section className="wec-section bg-[#140f0b]">
        <div className="wec-container max-w-3xl">
          <div className="space-y-6 text-sand-400 leading-relaxed">
            <p>
              WEC is a small team with a big idea: the most objective espresso
              championship in the world — same coffee, same machine, blind
              judging — and a Champion&apos;s Coffee Product that turns winning
              into a career.
            </p>
            <p>
              We spoke to sponsors. Some said no. Some said maybe. We refused to
              compromise the integrity of the format just to fill a budget line.
              That honesty almost cost us the year.
            </p>
            <p className="text-sand-200 text-lg font-medium">
              Then Café Unido said yes.
            </p>
            <p>
              <strong className="text-sand-100">Café Unido</strong> — one of
              Panama&apos;s most respected specialty houses — is confirmed as{" "}
              <strong className="text-sand-100">venue and roaster sponsor</strong>{" "}
              for WEC 2026. Same beans for every competitor. A home in Panama
              City. A partner who understands what transparent competition means
              for producers and baristas.
            </p>
          </div>

          <div className="mt-10 grid sm:grid-cols-2 gap-4">
            <div className="wec-card rounded-xl p-6">
              <Calendar className="w-5 h-5 text-gold mb-3" />
              <p className="text-xs text-sand-500 uppercase tracking-wider mb-1">
                Date
              </p>
              <p className="text-lg font-semibold text-sand-100">
                26 October 2026
              </p>
              <p className="text-sm text-sand-500 mt-1">
                During Panama coffee week season
              </p>
            </div>
            <div className="wec-card rounded-xl p-6">
              <MapPin className="w-5 h-5 text-gold mb-3" />
              <p className="text-xs text-sand-500 uppercase tracking-wider mb-1">
                Venue + coffee
              </p>
              <p className="text-lg font-semibold text-sand-100">Café Unido</p>
              <p className="text-sm text-sand-500 mt-1">
                Panama City · host &amp; roaster sponsor
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="wec-section">
        <div className="wec-container max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-6">
            <Star className="w-4 h-4 text-gold" />
            <span className="text-sm text-gold font-medium">
              Café Unido confirmed
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-sand-100 mb-4">
            What is locked in
          </h2>
          <ul className="space-y-3 text-sand-400 mb-10">
            {[
              "Venue: Café Unido, Panama City",
              "Roaster sponsor: Café Unido — same coffee for the entire field",
              "Date: 26 October 2026",
              "Format: 32 competitors, single elimination, Scoring v3, blind paired comparison",
              "Public live bracket powered by WEC tournament software",
              "Inaugural Champion's Coffee Product year",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <Coffee className="w-4 h-4 text-cinnamon-400 shrink-0 mt-1" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-sand-400 leading-relaxed mb-8">
            Café Unido covers the home and the coffee. We are still building the
            remaining partner stack — equipment, water, media, supporting brands —
            so Panama runs cleanly and the format stays uncompromised. If you
            believe coffee deserves better than private score sheets and closed
            doors, this is the moment.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/panama-2026">
              <Button className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100">
                WEC 2026 Panama
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/panama-2026#sponsors">
              <Button
                variant="outline"
                className="border-gold/40 text-gold hover:bg-gold/10"
              >
                <Handshake className="mr-2 w-4 h-4" />
                Become a sponsor
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

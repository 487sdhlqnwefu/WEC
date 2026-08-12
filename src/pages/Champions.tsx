import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { STATIC_EVENTS } from "@/data/staticContent";
import { Instagram, Trophy, ArrowRight, MapPin, Calendar } from "lucide-react";

/**
 * Champions index — real names + Instagram.
 * Legacy paths: /champions/2022/ … /champions/2025/
 */
export default function Champions() {
  const champions = STATIC_EVENTS.filter((e) => !e.isUpcoming && e.winner).sort(
    (a, b) => b.year - a.year,
  );
  const upcoming = STATIC_EVENTS.find((e) => e.isUpcoming);

  return (
    <div>
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cinnamon-950/20 to-transparent" />
        <div className="wec-container relative">
          <div className="max-w-4xl">
            <Trophy className="w-10 h-10 text-gold mb-4" />
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-sand-100 mb-6">
              History of{" "}
              <span className="wec-gradient-text">Champions</span>
            </h1>
            <p className="text-lg text-sand-400 max-w-2xl leading-relaxed">
              Real winners. Real Instagram. Every championship since 2022 —
              building toward the first independent finals in Panama.
            </p>
          </div>
        </div>
      </section>

      <section className="wec-section bg-[#140f0b]">
        <div className="wec-container">
          <div className="grid sm:grid-cols-2 gap-6">
            {champions.map((event) => (
              <article
                key={event.id}
                id={`y${event.year}`}
                className="wec-card rounded-xl overflow-hidden"
              >
                <div className="aspect-video relative bg-[#2a1f16]">
                  <img
                    src={event.photoUrl || "/assets/event-2.jpg"}
                    alt={event.name}
                      className="w-full h-full object-cover object-top opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#231a14] via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                    <div>
                      <p className="text-xs text-cinnamon-400 font-medium mb-1">
                        {event.year}
                      </p>
                      <h2 className="text-xl font-bold text-sand-100">
                        {event.winner}
                      </h2>
                    </div>
                    {event.winnerProfileUrl && (
                      <a
                        href={event.winnerProfileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1a1410]/90 border border-gold/40 text-sm text-gold hover:bg-gold/10"
                      >
                        <Instagram className="w-4 h-4" />
                        Instagram
                      </a>
                    )}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-sand-100 mb-2">
                    {event.name}
                  </h3>
                  <div className="flex flex-wrap gap-3 text-sm text-sand-500 mb-3">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-cinnamon-400" />
                      {event.location}
                      {event.venue ? ` · ${event.venue}` : ""}
                    </span>
                  </div>
                  <p className="text-sm text-sand-400 leading-relaxed">
                    {event.keyHighlights}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {upcoming && (
        <section className="wec-section">
          <div className="wec-container">
            <div className="wec-card rounded-2xl p-8 sm:p-10 text-center max-w-2xl mx-auto">
              <Calendar className="w-8 h-8 text-gold mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-sand-100 mb-2">
                Next: {upcoming.name}
              </h2>
              <p className="text-sand-400 mb-6">
                {upcoming.date} · {upcoming.venue}, {upcoming.location}. First
                independent champion. First Champion&apos;s Coffee Product.
              </p>
              <Link to="/panama-2026">
                <Button className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100">
                  Register for WEC 2026
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

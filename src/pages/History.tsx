import { trpc } from "@/providers/trpc";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { STATIC_EVENTS } from "@/data/staticContent";
import { Calendar, MapPin, Trophy, ArrowRight, Star } from "lucide-react";

export default function History() {
  const { data: events } = trpc.events.list.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });
  const list = events && events.length > 0 ? events : STATIC_EVENTS;
  const upcoming = list.filter((e) => e.isUpcoming);
  const past = list.filter((e) => !e.isUpcoming);

  return (
    <div>
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cinnamon-950/20 to-transparent" />
        <div className="wec-container relative">
          <div className="max-w-4xl">
            <span className="text-sm text-cinnamon-400 font-medium uppercase tracking-wider">
              Our Journey
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-sand-100 mt-3 mb-6">
              History of{" "}
              <span className="wec-gradient-text">Championships</span>
            </h1>
            <p className="text-lg sm:text-xl text-sand-400 leading-relaxed max-w-3xl">
              From a proof of concept in Melbourne to a global movement. Every
              event built on the last, driven by competitor feedback and a
              vision for transparent competition.
            </p>
          </div>
        </div>
      </section>

      <section className="wec-section">
        <div className="wec-container">
          <div className="space-y-10">
              {[...upcoming, ...past].map((event) => (
                <article
                  key={event.id}
                  className="wec-card rounded-xl overflow-hidden grid lg:grid-cols-2"
                >
                  <div className="aspect-video lg:aspect-auto lg:min-h-[280px] bg-[#2a1f16] relative">
                    <img
                      src={
                        ("photoUrl" in event && event.photoUrl) ||
                        "/assets/event-2.jpg"
                      }
                      alt={event.name}
                      className="w-full h-full object-cover opacity-85"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#231a14] via-transparent to-transparent" />
                  </div>
                  <div className="p-6 sm:p-8 flex flex-col justify-center">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cinnamon-950/50 border border-cinnamon-800/50 text-xs text-cinnamon-400">
                        <Calendar className="w-3 h-3" />
                        {event.year}
                      </span>
                      {event.isUpcoming && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 border border-gold/30 text-xs text-gold">
                          <Star className="w-3 h-3" />
                          Upcoming
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-sand-100 mb-2">
                      {event.name}
                    </h2>
                    <div className="flex flex-wrap gap-4 text-sm text-sand-500 mb-4">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-cinnamon-400" />
                        {event.location}
                        {event.venue ? ` · ${event.venue}` : ""}
                      </span>
                    </div>
                    {event.winner && (
                      <p className="text-gold text-sm font-medium mb-3 flex items-center gap-2 flex-wrap">
                        <Trophy className="w-4 h-4" />
                        Champion: {event.winner}
                        {"winnerProfileUrl" in event && event.winnerProfileUrl ? (
                          <a
                            href={event.winnerProfileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cinnamon-400 hover:text-cinnamon-300 underline-offset-2 hover:underline"
                          >
                            Instagram →
                          </a>
                        ) : null}
                      </p>
                    )}
                    <p className="text-sand-400 text-sm leading-relaxed mb-2">
                      {event.description}
                    </p>
                    {event.keyHighlights && (
                      <p className="text-sand-500 text-sm leading-relaxed">
                        {event.keyHighlights}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>

          <div className="text-center mt-14">
            <Link to="/panama-2026">
              <Button className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100">
                WEC 2026 Panama
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

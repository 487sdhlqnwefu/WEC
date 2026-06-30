import { trpc } from "@/providers/trpc";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Trophy, ArrowRight, Star, Play } from "lucide-react";

const eventImages: Record<number, string[]> = {
  1: ["event-33.jpg", "event-28.jpg", "event-27.jpg"],
  2: ["event-2.jpg", "event-1.jpg", "event-29.jpg"],
  3: ["event-37.jpg", "event-38.jpg", "event-30.jpg"],
  4: ["event-31.jpg", "event-32.jpg", "event-34.jpg"],
  5: ["event-35.jpg", "event-36.jpg", "event-24.jpg"],
};

export default function History() {
  const { data: events, isLoading } = trpc.events.list.useQuery();
  const upcoming = events?.filter((e) => e.isUpcoming) ?? [];
  const past = events?.filter((e) => !e.isUpcoming) ?? [];

  return (
    <div>
      {/* Hero */}
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

      {/* Timeline */}
      <section className="wec-section">
        <div className="wec-container">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="w-8 h-8 border-2 border-cinnamon-600 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : (
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cinnamon-800/50 via-cinnamon-600/30 to-transparent hidden sm:block" />

              <div className="space-y-16">
                {[...upcoming, ...past].map((event, index) => {
                  const images = eventImages[event.id] || ["event-2.jpg"];
                  const isLeft = index % 2 === 0;

                  return (
                    <div
                      key={event.id}
                      className={`relative grid sm:grid-cols-2 gap-8 items-center ${
                        isLeft ? "" : "sm:direction-rtl"
                      }`}
                    >
                      {/* Timeline dot */}
                      <div className="absolute left-4 sm:left-1/2 top-0 w-3 h-3 rounded-full bg-cinnamon-500 border-2 border-[#1a1410] -translate-x-1/2 hidden sm:block" />

                      {/* Content */}
                      <div className={`${isLeft ? "sm:pr-12" : "sm:pl-12 sm:col-start-2"}`}>
                        <div className="wec-card rounded-xl p-6 sm:p-8">
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

                          <h3 className="text-2xl font-bold text-sand-100 mb-2">
                            {event.name}
                          </h3>

                          <div className="flex items-center gap-2 text-sand-400 mb-4">
                            <MapPin className="w-4 h-4 text-cinnamon-400" />
                            <span className="text-sm">{event.location}</span>
                            {event.venue && (
                              <>
                                <span className="text-sand-600">•</span>
                                <span className="text-sm">{event.venue}</span>
                              </>
                            )}
                          </div>

                          {event.winner && (
                            <div className="flex items-center gap-2 mb-4">
                              <Trophy className="w-5 h-5 text-gold" />
                              <span className="text-gold font-medium">
                                Winner: {event.winner}
                              </span>
                            </div>
                          )}

                          <p className="text-sm text-sand-400 leading-relaxed mb-4">
                            {event.keyHighlights}
                          </p>

                          {event.format && (
                            <p className="text-xs text-sand-500 mb-4">
                              Format: {event.format}
                            </p>
                          )}

                          {event.championProduct && (
                            <div className="flex items-center gap-2 text-xs">
                              <Coffee className="w-4 h-4 text-sand-500" />
                              <span className="text-sand-500">
                                {event.championProduct}
                              </span>
                            </div>
                          )}

                          {event.isUpcoming && (
                            <div className="mt-6">
                              <Link to="/panama-2026">
                                <Button
                                  size="sm"
                                  className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100"
                                >
                                  Register for {event.name}
                                  <ArrowRight className="ml-2 w-4 h-4" />
                                </Button>
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Images */}
                      <div className={`${isLeft ? "sm:col-start-2 sm:pl-12" : "sm:pr-12 sm:col-start-1 sm:row-start-1"}`}>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="aspect-[3/4] rounded-lg overflow-hidden border border-[#3a2a1f]">
                            <img
                              src={`/assets/${images[0]}`}
                              alt={event.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="space-y-3">
                            <div className="aspect-square rounded-lg overflow-hidden border border-[#3a2a1f]">
                              <img
                                src={`/assets/${images[1]}`}
                                alt={event.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="aspect-square rounded-lg overflow-hidden border border-[#3a2a1f] bg-[#231a14] flex items-center justify-center">
                              <Play className="w-8 h-8 text-cinnamon-400" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function Coffee({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M17 8h1a4 4 0 1 1 0 8h-1" />
      <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z" />
      <line x1="6" x2="6.01" y1="2" y2="2" />
      <line x1="10" x2="10.01" y1="2" y2="2" />
      <line x1="14" x2="14.01" y1="2" y2="2" />
    </svg>
  );
}

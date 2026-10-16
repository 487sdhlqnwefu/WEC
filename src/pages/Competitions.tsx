import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users } from "lucide-react";

export default function Competitions() {
  const { isAuthenticated } = useAuth();
  const { data: events, isLoading } = trpc.competitions.list.useQuery();

  return (
    <div className="wec-container py-16">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-cinnamon-400 mb-3">
            World Coffee Tournaments software
          </p>
          <h1 className="text-4xl font-bold text-sand-100 mb-3">Competitions</h1>
          <p className="text-sand-400 max-w-2xl leading-relaxed">
            Free to use with a member account. Community events first, no
            software fee. Sponsored events pay a host fee so brands do not
            crowd out people-run cups. Scoring follows The Barista League 2026
            pillars: Concept 31%, Service 31%, Product 38% — published
            scorecards, not a black box.
          </p>
        </div>
        {isAuthenticated ? (
          <Link to="/competitions/new">
            <Button className="bg-cinnamon-600 hover:bg-cinnamon-500">
              Host an event
            </Button>
          </Link>
        ) : (
          <Link to="/join">
            <Button className="bg-cinnamon-600 hover:bg-cinnamon-500">
              Create free account
            </Button>
          </Link>
        )}
      </div>

      {isLoading && (
        <p className="text-sand-500">Loading events…</p>
      )}

      <div className="grid gap-4">
        {events?.map((event) => (
          <Link
            key={event.slug}
            to={`/competitions/${event.slug}`}
            className="block bg-[#231a14] border border-[#3a2a1f] rounded-xl p-6 hover:border-cinnamon-700/60 transition-colors"
          >
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span
                className={`text-[11px] uppercase tracking-wider px-2 py-1 rounded ${
                  event.kind === "community"
                    ? "bg-cinnamon-950 text-cinnamon-300"
                    : "bg-[#2a2218] text-sand-400"
                }`}
              >
                {event.kind === "community" ? "Community" : "Sponsored"}
              </span>
              <span className="text-[11px] uppercase tracking-wider text-sand-500">
                {event.status}
              </span>
            </div>
            <h2 className="text-xl font-semibold text-sand-100 mb-2">
              {event.name}
            </h2>
            <div className="flex flex-wrap gap-4 text-sm text-sand-500">
              <span className="inline-flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {event.location}
              </span>
              <span className="inline-flex items-center gap-1">
                <Calendar className="w-4 h-4" /> {event.date}
              </span>
              <span className="inline-flex items-center gap-1">
                <Users className="w-4 h-4" /> Barista League 2026 format
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

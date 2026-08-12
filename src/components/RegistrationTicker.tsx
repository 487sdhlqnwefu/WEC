import { Link } from "react-router";
import { Users } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { WEC_FACTS } from "@/data/wecFacts";

/**
 * Sticky registration progress bar — centered “X / 32 confirmed” ticker.
 * Uses live API count when available; otherwise static fallback for Netlify.
 */
export default function RegistrationTicker() {
  const { data: competitors } = trpc.registrations.getByType.useQuery(
    "competitor",
    { retry: false, refetchOnWindowFocus: false },
  );

  const apiCount = competitors
    ? competitors.filter((c) => c.status === "approved" || c.status === "pending")
        .length
    : null;
  const confirmed =
    apiCount != null
      ? Math.max(apiCount, WEC_FACTS.event2026.confirmedCompetitors)
      : WEC_FACTS.event2026.confirmedCompetitors;
  const limit = WEC_FACTS.event2026.fieldSize;
  const pct = Math.min(100, Math.round((confirmed / limit) * 100));

  return (
    <div className="sticky top-16 lg:top-20 z-40 border-b border-[#3a2a1f]/80 bg-[#140f0b]/95 backdrop-blur-md">
      <div className="wec-container py-2.5 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
        <div className="flex items-center gap-3 min-w-0">
          <Users className="w-4 h-4 text-cinnamon-400 flex-shrink-0" />
          <p className="text-sm text-sand-300 text-center sm:text-left">
            <span className="font-semibold text-sand-100 tabular-nums">
              {confirmed} / {limit}
            </span>{" "}
            competitors confirmed for WEC 2026 Panama
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto sm:min-w-[200px] max-w-xs">
          <div className="flex-1 h-1.5 rounded-full bg-[#2a1f16] overflow-hidden">
            <div
              className="h-full rounded-full bg-cinnamon-600 transition-all duration-500"
              style={{ width: `${Math.max(pct, confirmed > 0 ? 4 : 0)}%` }}
            />
          </div>
          <Link
            to="/panama-2026#competitor-registration"
            className="text-xs font-medium text-cinnamon-400 hover:text-cinnamon-300 whitespace-nowrap"
          >
            Register →
          </Link>
        </div>
      </div>
    </div>
  );
}

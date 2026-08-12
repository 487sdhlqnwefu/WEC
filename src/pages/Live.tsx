import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import PageShell from "@/components/PageShell";
import { ArrowRight, Radio } from "lucide-react";

/**
 * Prerendered public shell for Live/Results.
 * Live brackets hydrate when the API/event feed is available.
 */
export default function Live() {
  return (
    <PageShell
      eyebrow="During the event"
      title="Live Results"
      lead="Follow brackets and match results when the championship is live. Between events, explore past championships and get ready for the next finals."
    >
      <section className="wec-section bg-[#140f0b]">
        <div className="wec-container max-w-3xl">
          <div className="wec-card rounded-2xl p-8 sm:p-10 text-center">
            <Radio className="w-10 h-10 text-cinnamon-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-sand-100 mb-3">
              Live feed between sessions
            </h2>
            <p className="text-sand-400 leading-relaxed mb-8">
              When matches are under way, this page becomes the home for
              brackets and results. Until then, catch up on championship history
              or register for WEC 2026 Panama.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/panama-2026">
                <Button className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100">
                  WEC 2026 Panama
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to="/history">
                <Button
                  variant="outline"
                  className="border-sand-400/30 text-sand-200 hover:bg-sand-400/10"
                >
                  Past championships
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

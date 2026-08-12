import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import PageShell from "@/components/PageShell";
import { ArrowRight, Trophy, Star } from "lucide-react";

export default function Champions() {
  return (
    <PageShell
      eyebrow="Legacy"
      title="WEC Champions"
      lead="Champions of the World Espresso Championship prove skill under identical conditions — and from 2026, the winner launches a Champion's Coffee product with real royalties."
    >
      <section className="wec-section bg-[#140f0b]">
        <div className="wec-container">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#3a2a1f]">
              <img
                src="/assets/event-28.jpg"
                alt="WEC champion celebration"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div>
              <Trophy className="w-8 h-8 text-gold mb-4" />
              <h2 className="text-3xl font-bold text-sand-100 mb-4">
                More than a trophy
              </h2>
              <p className="text-sand-400 leading-relaxed mb-4">
                Every WEC finalist already won a national stage. The world
                champion is the barista who keeps winning when the coffee, the
                machine, and the blind judge strip away every other variable.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "Blind paired-comparison finals",
                  "Public recipe and process transparency",
                  "Champion's Coffee product from 2026",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Star className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" />
                    <span className="text-sand-300">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-4">
                <Link to="/history">
                  <Button className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100">
                    Championship history
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/panama-2026">
                  <Button
                    variant="outline"
                    className="border-sand-400/30 text-sand-200 hover:bg-sand-400/10"
                  >
                    Compete in Panama 2026
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

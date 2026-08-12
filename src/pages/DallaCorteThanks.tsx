import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import PageShell from "@/components/PageShell";
import { ArrowRight, Heart } from "lucide-react";

export default function DallaCorteThanks() {
  return (
    <PageShell
      eyebrow="Partners"
      title="Thank You, Dalla Corte"
      lead="The World Espresso Championship thanks Dalla Corte for equipment partnership that keeps competition fair — same machines, same standard, for every barista."
    >
      <section className="wec-section bg-[#140f0b]">
        <div className="wec-container">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#3a2a1f]">
              <img
                src="/assets/event-36.jpg"
                alt="Dalla Corte espresso machine at WEC"
                className="w-full h-full object-cover object-[center_20%]"
              />
            </div>
            <div>
              <Heart className="w-8 h-8 text-cinnamon-400 mb-4" />
              <h2 className="text-3xl font-bold text-sand-100 mb-4">
                Same machine. Fair fight.
              </h2>
              <p className="text-sand-400 leading-relaxed mb-6">
                Objective competition only works when hardware is a constant.
                Dalla Corte equipment helps WEC keep the focus where it belongs:
                on the barista and the cup.
              </p>
              <Link to="/panama-2026">
                <Button className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100">
                  Explore WEC 2026
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

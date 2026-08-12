import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import PageShell from "@/components/PageShell";
import { ArrowRight, FlaskConical, BookOpen, Eye } from "lucide-react";

export default function InnovationLab() {
  return (
    <PageShell
      eyebrow="Research & Tools"
      title="Innovation Lab"
      lead="Where competition becomes progress — extraction science, sensory methodology, and open data that raise the floor for every barista."
    >
      <section className="wec-section bg-[#140f0b]">
        <div className="wec-container">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: FlaskConical,
                title: "Extraction science",
                body: "Repeatable protocols under competition pressure — parameters the whole industry can learn from.",
              },
              {
                icon: Eye,
                title: "Sensory methodology",
                body: "ISO 5495 paired comparison and blind process design that remove politics from preference.",
              },
              {
                icon: BookOpen,
                title: "Open knowledge",
                body: "Public recipe and process data so winning methods travel further than a single stage.",
              },
            ].map((item) => (
              <div key={item.title} className="wec-card rounded-xl p-6">
                <item.icon className="w-8 h-8 text-cinnamon-400 mb-4" />
                <h2 className="text-xl font-semibold text-sand-100 mb-3">
                  {item.title}
                </h2>
                <p className="text-sand-400 text-sm leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link to="/vision">
              <Button className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100">
                Read our vision
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/decisions">
              <Button
                variant="outline"
                className="border-sand-400/30 text-sand-200 hover:bg-sand-400/10"
              >
                Tiny Decisions tools
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, Monitor, Radio, ShieldCheck } from "lucide-react";

const SHOTS = [
  {
    src: "/assets/marketing/02-live-bracket-board.png",
    alt: "Live public bracket board",
    caption: "Live public bracket",
  },
  {
    src: "/assets/marketing/03-admin-match-control.png",
    alt: "Admin match control",
    caption: "Day-of match control",
  },
  {
    src: "/assets/marketing/04-judging-trust-v3.png",
    alt: "Scoring v3 judging",
    caption: "Blind Scoring v3 ballots",
  },
];

type Props = {
  /** Compact = fewer words, for homepage embeds */
  compact?: boolean;
  className?: string;
};

/**
 * First-of-its-kind tournament software promo — reuse across Home, Panama, Judging, etc.
 */
export default function SoftwareShowcase({ compact = false, className = "" }: Props) {
  return (
    <section className={`wec-section ${className}`}>
      <div className="wec-container">
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Monitor className="w-7 h-7 text-cinnamon-400" />
            <span className="text-sm text-cinnamon-400 font-medium uppercase tracking-wider">
              Competition software · first of its kind
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-sand-100 mb-4">
            The operating system of{" "}
            <span className="wec-gradient-text">transparent espresso</span>
          </h2>
          <p className="text-sand-400 leading-relaxed">
            {compact
              ? "Purpose-built for blind paired comparison — live brackets, Scoring v3 ballots, and day-of control. Not a spreadsheet. The platform sponsors and competitors can trust."
              : "Most coffee competitions still run on spreadsheets and private score sheets. WEC built purpose-built tournament software for blind Cup A/B heats, public live brackets, and Scoring v3 — so the industry can watch the result unfold in real time. This is a huge part of why Panama 2026 matters."}
          </p>
        </div>

        {!compact && (
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              {
                icon: ShieldCheck,
                title: "Trust by design",
                desc: "Blind cups. Complete ballots only. Public outcomes.",
              },
              {
                icon: Radio,
                title: "Live for everyone",
                desc: "Sponsors and fans see the same board as the floor.",
              },
              {
                icon: Monitor,
                title: "Built for day-of",
                desc: "Start, finalize, void/reset — 32-person brackets.",
              },
            ].map((item) => (
              <div key={item.title} className="wec-card rounded-xl p-5">
                <item.icon className="w-5 h-5 text-gold mb-3" />
                <h3 className="text-base font-semibold text-sand-100 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-sand-400">{item.desc}</p>
              </div>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {SHOTS.map((shot) => (
            <figure key={shot.src} className="space-y-2">
              <div className="rounded-xl overflow-hidden border border-[#3a2a1f] bg-[#0d0a08]">
                <img
                  src={shot.src}
                  alt={shot.alt}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
              <figcaption className="text-xs text-sand-500 text-center">
                {shot.caption}
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row flex-wrap gap-3">
          <Link to="/judging">
            <Button className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100">
              See how scoring + software work
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
          <Link to="/live/wec-2026-panama">
            <Button
              variant="outline"
              className="border-sand-400/30 text-sand-200"
            >
              View live board
            </Button>
          </Link>
          <Link to="/innovation">
            <Button
              variant="outline"
              className="border-gold/40 text-gold hover:bg-gold/10"
            >
              Innovation Lab
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

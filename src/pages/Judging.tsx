import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import Seo from "@/components/Seo";
import { CATEGORY_POINTS, WIN_THRESHOLD } from "@contracts/scoring";
import { WEC_FACTS } from "@/data/wecFacts";
import {
  Eye,
  Scale,
  ArrowRight,
  Handshake,
  Monitor,
  Radio,
  ShieldCheck,
} from "lucide-react";

const SOFTWARE_SHOTS = [
  {
    src: "/assets/marketing/02-live-bracket-board.png",
    alt: "Live public bracket board",
    caption: "Live public bracket — every heat visible in real time",
  },
  {
    src: "/assets/marketing/03-admin-match-control.png",
    alt: "Admin match control",
    caption: "Day-of match control — start heats, assign cups, finalize",
  },
  {
    src: "/assets/marketing/04-judging-trust-v3.png",
    alt: "Scoring v3 judging interface",
    caption: "Scoring v3 ballots — blind Cup A / Cup B, no deliberation",
  },
];

export default function Judging() {
  return (
    <div>
      <Seo
        title="How Judging Works | World Espresso Championship"
        description="Scoring v3: three independent judges, Tactile 15 / Taste 10 / Flavour 8, 99 points per heat, 50+ wins. Blind Cup A vs Cup B for the World Espresso Championship."
        path="/judging"
        image="https://worldespressochampionship.com/assets/og/judging.jpg"
      />
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cinnamon-950/20 to-transparent" />
        <div className="wec-container relative">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/assets/logo-white.png"
                alt="WEC"
                className="h-12 w-12 object-contain"
              />
              <span className="text-sm text-cinnamon-400 font-medium uppercase tracking-wider">
                Scoring v3
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-sand-100 mb-6">
              How the cup{" "}
              <span className="wec-gradient-text">decides</span>
            </h1>
            <p className="text-lg sm:text-xl text-sand-400 leading-relaxed">
              Same coffee. Same machine. Blind cups. No stories. No politics.
              Built so sponsors, competitors, and the public can trust the
              result.
            </p>
          </div>
        </div>
      </section>

      <section className="wec-section bg-[#140f0b]">
        <div className="wec-container">
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            {[
              {
                title: "Tactile",
                pts: CATEGORY_POINTS.tactile,
                pct: "45.45% (45% rounded)",
                desc: "Highest weight in Scoring v3 because texture is comparatively stable under controlled conditions.",
              },
              {
                title: "Taste",
                pts: CATEGORY_POINTS.taste,
                pct: "30.30% (30% rounded)",
                desc: "Sour, bitter, and balance signals judges can ballot independently without deliberation.",
              },
              {
                title: "Flavour",
                pts: CATEGORY_POINTS.flavour,
                pct: "24.24% (24% rounded)",
                desc: "Flavour matters, but its 8 points cannot win a heat on its own.",
              },
            ].map((c) => (
              <div key={c.title} className="wec-card rounded-xl p-6">
                <p className="text-gold text-sm font-medium mb-1">{c.pct}</p>
                <h2 className="text-xl font-bold text-sand-100 mb-2">
                  {c.title}{" "}
                  <span className="text-sand-500 text-base font-normal">
                    ({c.pts} pts)
                  </span>
                </h2>
                <p className="text-sm text-sand-400 leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-sand-500 mt-6">
            Three judges ·{" "}
            {CATEGORY_POINTS.tactile +
              CATEGORY_POINTS.taste +
              CATEGORY_POINTS.flavour}{" "}
            points each · 99 total ·{" "}
            <span className="text-sand-300">{WIN_THRESHOLD}+ wins</span>
            . Percentages rounded; the points govern.
          </p>
          <p className="text-center text-xs text-sand-500 mt-3 max-w-2xl mx-auto">
            {WEC_FACTS.scoring.methodologyNote} {WEC_FACTS.scoring.biasNote}
          </p>
        </div>
      </section>

      <section className="wec-section">
        <div className="wec-container max-w-3xl">
          <h2 className="text-2xl font-bold text-sand-100 mb-4">Worked scoring example</h2>
          <p className="text-sand-400 text-sm mb-6">
            Fictional ballots for illustration. Single elimination selects the champion under the
            published rules; it is not a complete ranking of every competitor.
          </p>
          <div className="overflow-x-auto wec-card rounded-xl p-4 text-sm mb-4">
            <table className="w-full text-left text-sand-400">
              <thead className="text-sand-200">
                <tr>
                  <th className="py-2 pr-4">Judge</th>
                  <th className="py-2 pr-4">Tactile (15)</th>
                  <th className="py-2 pr-4">Taste (10)</th>
                  <th className="py-2 pr-4">Flavour (8)</th>
                  <th className="py-2">Points to A</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2">J1</td>
                  <td>A</td>
                  <td>A</td>
                  <td>B</td>
                  <td>25</td>
                </tr>
                <tr>
                  <td className="py-2">J2</td>
                  <td>A</td>
                  <td>B</td>
                  <td>A</td>
                  <td>23</td>
                </tr>
                <tr>
                  <td className="py-2">J3</td>
                  <td>B</td>
                  <td>A</td>
                  <td>A</td>
                  <td>18</td>
                </tr>
                <tr className="text-sand-100 font-medium border-t border-[#3a2a1f]">
                  <td className="py-2" colSpan={4}>
                    Cup A total
                  </td>
                  <td>66</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-sand-500">
            Cup A reaches 66 of 99 (≥{WIN_THRESHOLD}) and wins.{" "}
            <Link to="/rules-and-integrity" className="text-cinnamon-400">
              Rules &amp; Integrity
            </Link>
          </p>
        </div>
      </section>

      {/* Software platform — first of its kind */}
      <section className="wec-section">
        <div className="wec-container">
          <div className="max-w-3xl mb-10">
            <div className="flex items-center gap-3 mb-4">
              <Monitor className="w-8 h-8 text-cinnamon-400" />
              <span className="text-sm text-cinnamon-400 font-medium uppercase tracking-wider">
                Competition software
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-sand-100 mb-4">
              First of its kind for{" "}
              <span className="wec-gradient-text">espresso competition</span>
            </h2>
            <p className="text-sand-400 leading-relaxed mb-4">
              Most coffee competitions still run on spreadsheets, paper ballots,
              and private score sheets. WEC built purpose-built tournament
              software for blind paired comparison: Scoring v3 ballots, Cup A/B
              assignment, public live brackets, and day-of admin control —
              designed so competitors, sponsors, and the public can watch the
              result unfold in real time.
            </p>
            <p className="text-sand-500 text-sm leading-relaxed">
              This is the operating system of the championship — and the
              foundation for the Innovation Lab, where elite baristas can
              document what they attempted and what they learned.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {[
              {
                icon: ShieldCheck,
                title: "Trust by design",
                desc: "Blind cups, complete ballots only, public outcomes — no closed-door score drift.",
              },
              {
                icon: Radio,
                title: "Live for everyone",
                desc: "The bracket updates as heats finalize. Sponsors and fans see the same board.",
              },
              {
                icon: Monitor,
                title: "Built for day-of",
                desc: "Admin start/finalize flow, void/reset for errors, 32-competitor single elimination.",
              },
            ].map((item) => (
              <div key={item.title} className="wec-card rounded-xl p-5">
                <item.icon className="w-5 h-5 text-gold mb-3" />
                <h3 className="text-base font-semibold text-sand-100 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-sand-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {SOFTWARE_SHOTS.map((shot) => (
              <figure key={shot.src} className="space-y-3">
                <div className="rounded-xl overflow-hidden border border-[#3a2a1f] bg-[#0d0a08]">
                  <img
                    src={shot.src}
                    alt={shot.alt}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </div>
                <figcaption className="text-sm text-sand-500 text-center">
                  {shot.caption}
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link to="/live/wec-2026-panama">
              <Button className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100">
                View live board
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/innovation">
              <Button
                variant="outline"
                className="border-sand-400/30 text-sand-200"
              >
                Innovation Lab
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="wec-section bg-[#140f0b]">
        <div className="wec-container">
          <div className="grid lg:grid-cols-2 gap-10 items-start">
            <div>
              <Eye className="w-8 h-8 text-cinnamon-400 mb-4" />
              <h2 className="text-3xl font-bold text-sand-100 mb-4">
                Blind paired comparison
              </h2>
              <p className="text-sand-400 leading-relaxed mb-6">
                Two espressos. Labeled A and B. Judges never know who made which.
                They choose A or B for Tactile, Taste, and Flavour — immediately,
                with no deliberation. Results publish on the public live board.
              </p>
              <ul className="space-y-3">
                {[
                  "No latte art in the sensory score",
                  "No brand advantage from glassware",
                  "No score drift or closed-door changes",
                  "Public live bracket for the whole industry to see",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-3 text-sm text-sand-300"
                  >
                    <Scale className="w-4 h-4 text-cinnamon-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="wec-card rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-sand-100 mb-4">
                What this means for sponsors
              </h3>
              <p className="text-sm text-sand-400 leading-relaxed mb-6">
                Your brand sits next to a format people can verify. Not a private
                score sheet. Not a story competition. A public, scientific
                preference test — the same idea used in food science labs
                informed by paired-comparison sensory methodology. Beside the result sits the Innovation Lab:
                structured elite-barista insight that can inform further testing
                and product-development thinking.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/panama-2026#sponsors">
                  <Button className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100">
                    <Handshake className="mr-2 w-4 h-4" />
                    Sponsor WEC 2026
                  </Button>
                </Link>
                <Link to="/innovation">
                  <Button
                    variant="outline"
                    className="border-sand-400/30 text-sand-200"
                  >
                    Innovation Lab
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="wec-section">
        <div className="wec-container text-center">
          <p className="text-sand-500 text-sm mb-2">Next championship</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-sand-100 mb-2">
            Café Unido · Panama City · 26 October 2026
          </h2>
          <p className="text-sand-400 mb-8 max-w-xl mx-auto">
            Café Unido is our venue and roaster sponsor. We are building the
            remaining partner stack around equipment, water, media, and
            supporting brands.
          </p>
          <Link to="/panama-2026">
            <Button className="bg-gold text-[#1a1410] hover:bg-[#d4a35e] font-semibold">
              WEC 2026 Panama
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

import Seo from "@/components/Seo";
import { WEC_FACTS } from "@/data/wecFacts";
import { Link } from "react-router";

const DEFINED = [
  {
    title: "Eligibility",
    body: WEC_FACTS.eligibility.competitor,
  },
  {
    title: "Field and seeding",
    body: `WEC 2026 plans a field of ${WEC_FACTS.event2026.fieldSize} national champions in a single-elimination bracket. Seeding details will be published before competition.`,
  },
  {
    title: "Controlled variables",
    body: "Same coffee, same roast, same grinder platform, same water, same machine platform. Only barista execution changes between Cup A and Cup B.",
  },
  {
    title: "Blind Cup A/B assignment",
    body: "Judges compare blinded cups. Competitor identity is hidden from sensory judges during the heat.",
  },
  {
    title: "Ballot independence",
    body: "Each judge ballots independently. There is no deliberation. Results are locked and published.",
  },
  {
    title: "Scoring weights and 50+ threshold",
    body: `${WEC_FACTS.scoring.version}: per judge Tactile ${WEC_FACTS.scoring.tactile}, Taste ${WEC_FACTS.scoring.taste}, Flavour ${WEC_FACTS.scoring.flavour} (${WEC_FACTS.scoring.pointsPerJudge} points). Three judges = ${WEC_FACTS.scoring.pointsPerHeat} points. ${WEC_FACTS.scoring.winThreshold}+ wins. Percentages rounded; the points govern. Tactile ${WEC_FACTS.scoring.percentages.tactile.exact} (${WEC_FACTS.scoring.percentages.tactile.rounded} rounded); Taste ${WEC_FACTS.scoring.percentages.taste.exact} (${WEC_FACTS.scoring.percentages.taste.rounded} rounded); Flavour ${WEC_FACTS.scoring.percentages.flavour.exact} (${WEC_FACTS.scoring.percentages.flavour.rounded} rounded). Flavour matters, but its ${WEC_FACTS.scoring.flavour} points cannot win a heat on its own.`,
  },
  {
    title: "Tie impossibility under the 99-point design",
    body: `With ${WEC_FACTS.scoring.pointsPerHeat} odd total points and a ${WEC_FACTS.scoring.winThreshold}+ win threshold, a heat cannot end in a points tie under complete Scoring v3 ballots.`,
  },
  {
    title: "Commercial-partner independence",
    body: WEC_FACTS.sponsorship.independencePrinciple,
  },
  {
    title: "Methodology note",
    body: WEC_FACTS.scoring.methodologyNote,
  },
  {
    title: "Bias reduction",
    body: WEC_FACTS.scoring.biasNote,
  },
];

const OUTSTANDING = [
  "Service/order counterbalancing procedure",
  "Judge selection, training, conflicts and recusal detail",
  "Voids, re-pulls and equipment-failure protocol",
  "Corrections and audit/version history process",
  "Appeals process (if any)",
  "Publication timing for each round",
  "Data and image consent forms for competitors and judges",
];

export default function RulesAndIntegrity() {
  return (
    <div>
      <Seo
        title="Rules & Integrity | World Espresso Championship"
        description="Public rules for the World Espresso Championship: controlled variables, blind judging, Scoring v3, and partner independence."
        path="/rules-and-integrity"
      />
      <section className="wec-section">
        <div className="wec-container max-w-3xl">
          <p className="text-sm text-cinnamon-400 font-medium uppercase tracking-wider mb-3">
            Public rules
          </p>
          <h1 className="text-4xl font-bold text-sand-100 mb-4">Rules &amp; Integrity</h1>
          <p className="text-sand-400 mb-10 leading-relaxed">
            {WEC_FACTS.organisation.coreLine} This page is the canonical public summary of how WEC
            runs a heat. Items not yet final are listed clearly below — we do not invent policy.
          </p>

          <div className="space-y-8">
            {DEFINED.map((item) => (
              <div key={item.title}>
                <h2 className="text-xl font-semibold text-sand-100 mb-2">{item.title}</h2>
                <p className="text-sand-400 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-xl border border-gold/30 bg-gold/5">
            <h2 className="text-xl font-semibold text-sand-100 mb-3">
              To be published before competition
            </h2>
            <ul className="space-y-2 text-sand-400 text-sm">
              {OUTSTANDING.map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>

          <p className="mt-10 text-sm text-sand-500">
            Related:{" "}
            <Link to="/judging" className="text-cinnamon-400 hover:text-cinnamon-300">
              How judging works
            </Link>{" "}
            ·{" "}
            <Link to="/panama-2026" className="text-cinnamon-400 hover:text-cinnamon-300">
              WEC 2026 Panama
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

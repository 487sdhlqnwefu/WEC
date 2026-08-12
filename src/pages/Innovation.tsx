import { useEffect } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  Cpu,
  Droplets,
  Eye,
  FlaskConical,
  GraduationCap,
  Handshake,
  Home as HomeIcon,
  Lock,
  Scale,
  Settings2,
  Shield,
  Trophy,
  Wrench,
} from "lucide-react";

const innovationLoop = [
  "Compete",
  "Measure",
  "Understand",
  "Prove",
  "Document",
  "Learn",
  "Innovate",
  "Reproduce",
];

const evidenceLayers = [
  {
    title: "Controlled environment",
    body: "Same coffee. Same roast. Same grinder. Same water. Same machine platform. Barista execution isolated.",
  },
  {
    title: "Observed performance",
    body: "What did the competitor actually do? Recipe. Technique. Adjustments between heats.",
  },
  {
    title: "Competition outcome",
    body: "What advanced? What lost? Which sensory categories moved under Scoring v3?",
  },
  {
    title: "Practitioner insight",
    body: "What did they experience? What helped? What hindered? What would they change?",
  },
];

const softwareStack = [
  {
    title: "Competition operating system",
    body: "Runs heats, ballots, brackets and results.",
  },
  {
    title: "Transparency engine",
    body: "Makes the result path visible to the public.",
  },
  {
    title: "Champion’s Protocol",
    body: "Documents the winning methodology.",
  },
  {
    title: "Elite barista intelligence",
    body: "Captures structured post-heat insight.",
  },
  {
    title: "Innovation platform",
    body: "Creates knowledge that can inform equipment, products and education.",
  },
];

const partnerCategories = [
  {
    icon: Cpu,
    title: "Espresso machines",
    items: ["Workflow", "Control", "Ergonomics", "Repeatability", "Interface"],
  },
  {
    icon: Wrench,
    title: "Grinders",
    items: ["Adjustment", "Retention", "Dose management", "Repeatability"],
  },
  {
    icon: Droplets,
    title: "Water",
    items: ["Specification", "Consistency", "Perceived impact", "Recipe response"],
  },
  {
    icon: HomeIcon,
    title: "Home / prosumer",
    items: ["What translates", "What does not", "Reproducing elite execution"],
  },
  {
    icon: GraduationCap,
    title: "Education",
    items: ["Recipe development", "Decision-making", "Champion methodology"],
  },
];

const journey = [
  { round: "Round 1", q: "What did you intend?" },
  { round: "Round 2", q: "What did you learn?" },
  { round: "Quarter-final", q: "What did you change?" },
  { round: "Semi-final", q: "What are you optimising?" },
  { round: "Final", q: "What ultimately mattered?" },
];

export default function Innovation() {
  useEffect(() => {
    document.title =
      "Competition-Driven Coffee Innovation | World Espresso Championship";
    const desc =
      "WEC combines controlled espresso competition, purpose-built software, elite barista feedback and the Champion’s Protocol to turn world-class competition into a platform for learning and innovation.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
    return () => {
      document.title = "World Espresso Championship";
    };
  }, []);

  return (
    <div>
      {/* Hero — championship first, innovation as layer */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/event-35.jpg"
            alt=""
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1410]/60 via-[#1a1410]/78 to-[#1a1410]" />
        </div>
        <div className="wec-container relative py-24">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-8">
              <img
                src="/assets/logo-white.png"
                alt="World Espresso Championship"
                className="h-14 w-14 object-contain"
              />
              <div>
                <p className="text-xs tracking-[0.22em] text-cinnamon-400 uppercase">
                  World Espresso Championship
                </p>
                <p className="text-sm text-sand-500">WEC Innovation Lab</p>
              </div>
            </div>
            <p className="text-sm text-cinnamon-400 font-medium uppercase tracking-wider mb-4">
              Competition-driven innovation
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-sand-100 tracking-tight leading-[1.05] mb-6">
              The competition is also{" "}
              <span className="wec-gradient-text">a lab.</span>
            </h1>
            <p className="text-lg sm:text-xl text-sand-400 max-w-2xl leading-relaxed mb-6">
              The World Espresso Championship doesn’t just find the best
              espresso. It helps the industry understand how to make better
              espresso.
            </p>
            <p className="text-sand-500 max-w-2xl mb-10 leading-relaxed">
              WEC is first a championship. The Innovation Lab is the strategic
              layer beside it: controlled conditions, purpose-built software,
              structured elite-barista insight, and the Champion’s Protocol.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/panama-2026#sponsors">
                <Button
                  size="lg"
                  className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100 px-8 wec-glow"
                >
                  <Handshake className="mr-2 w-5 h-5" />
                  Partner with WEC
                </Button>
              </Link>
              <Link to="/judging">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-sand-400/30 text-sand-200 px-8"
                >
                  How the cup decides
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Find / Understand / Build */}
      <section className="border-y border-[#3a2a1f] bg-[#140f0b] py-14">
        <div className="wec-container">
          <div className="grid sm:grid-cols-3 gap-8 text-center sm:text-left">
            {["Find excellence.", "Understand it.", "Build from it."].map(
              (line) => (
                <p
                  key={line}
                  className="text-2xl sm:text-3xl font-bold text-sand-100 tracking-tight"
                >
                  {line}
                </p>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Core explanatory */}
      <section className="wec-section">
        <div className="wec-container">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-sand-100 mb-5">
                32 champions.
                <br />
                A living espresso laboratory.
              </h2>
              <p className="text-sand-400 leading-relaxed mb-4">
                National champions are not a random focus group. They are
                experienced practitioners solving real espresso problems under
                pressure.
              </p>
              <p className="text-sand-400 leading-relaxed mb-4">
                Through WEC’s competition software, competitors can document what
                they attempted, what they changed, what limited their execution
                and what they learned — then connect that feedback to controlled
                conditions and competition outcomes.
              </p>
              <p className="text-sand-400 leading-relaxed">
                The goal is not to replace traditional R&amp;D. It is to create
                something manufacturers rarely have: structured insight from
                elite users working in a controlled, competitive environment.
              </p>
            </div>
            <div>
              <div className="aspect-[4/3] overflow-hidden border border-[#3a2a1f] mb-3">
                <img
                  src="/assets/event-2.jpg"
                  alt="WEC competitors working under competition conditions"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-sand-500">
                Authentic competition photography — elite sport × espresso ×
                human intelligence. Not a biotech lab.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Closed innovation loop */}
      <section className="wec-section bg-[#140f0b]">
        <div className="wec-container">
          <h2 className="text-3xl sm:text-4xl font-bold text-sand-100 mb-3">
            The closed innovation loop
          </h2>
          <p className="text-sand-400 max-w-2xl mb-10">
            Compete. Measure. Understand. Prove. Document. Learn. Innovate.
            Reproduce. Then compete again.
          </p>
          <ol className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {innovationLoop.map((step, i) => (
              <li
                key={step}
                className="border border-[#3a2a1f] bg-[#1a1410] p-4"
              >
                <span className="text-xs text-cinnamon-400 font-medium">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sand-100 font-semibold mt-1">{step}</p>
                {i < innovationLoop.length - 1 && (
                  <p className="text-sand-600 text-xs mt-2 md:hidden">↓ next</p>
                )}
              </li>
            ))}
          </ol>
          <p className="sr-only">
            Closed loop: Compete, Measure, Understand, Prove, Document, Learn,
            Innovate, Reproduce, then Compete again.
          </p>
        </div>
      </section>

      {/* Four evidence layers */}
      <section className="wec-section">
        <div className="wec-container">
          <h2 className="text-3xl sm:text-4xl font-bold text-sand-100 mb-3">
            Four evidence layers
          </h2>
          <p className="text-sand-400 max-w-2xl mb-10">
            The value comes from connecting what people say with what they
            actually did and what happened next.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {evidenceLayers.map((layer, i) => (
              <div
                key={layer.title}
                className="border border-[#3a2a1f] bg-[#231a14]/50 p-6"
              >
                <p className="text-xs text-cinnamon-400 uppercase tracking-wider mb-2">
                  Layer {i + 1}
                </p>
                <h3 className="text-lg font-semibold text-sand-100 mb-2">
                  {layer.title}
                </h3>
                <p className="text-sm text-sand-500 leading-relaxed">
                  {layer.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example post-heat feedback UI */}
      <section className="wec-section bg-[#140f0b]">
        <div className="wec-container">
          <div className="max-w-2xl mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-sand-100 mb-3">
              Post-heat feedback
            </h2>
            <p className="text-sand-400">
              Short. Structured. Immediately after the heat — not a giant survey.
            </p>
            <p className="text-xs text-sand-500 mt-3 uppercase tracking-wider">
              Example innovation questions · illustrative, not a final product
              questionnaire
            </p>
          </div>

          <div className="max-w-xl border border-[#3a2a1f] bg-[#1a1410] p-5 sm:p-6 space-y-6">
            <div className="flex items-center gap-2 border-b border-[#3a2a1f] pb-3">
              <Settings2 className="w-4 h-4 text-cinnamon-400" />
              <span className="text-sm font-medium text-sand-200">
                Post-heat check-in
              </span>
              <span className="ml-auto text-[10px] text-sand-500 uppercase">
                Example UI
              </span>
            </div>

            <fieldset>
              <legend className="text-sm text-sand-300 mb-3">
                How closely did you execute your intended recipe?
              </legend>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <span
                    key={n}
                    className={`w-10 h-10 flex items-center justify-center text-sm border ${
                      n === 4
                        ? "border-cinnamon-500 bg-cinnamon-950/40 text-sand-100"
                        : "border-[#3a2a1f] text-sand-500"
                    }`}
                  >
                    {n}
                  </span>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm text-sand-300 mb-3">
                What most limited your execution?
              </legend>
              <div className="flex flex-wrap gap-2">
                {[
                  "Machine",
                  "Grinder",
                  "Workflow",
                  "Water",
                  "Technique",
                  "Time",
                  "Nothing",
                ].map((opt) => (
                  <span
                    key={opt}
                    className={`px-3 py-1.5 text-xs border ${
                      opt === "Workflow"
                        ? "border-cinnamon-500 text-sand-100"
                        : "border-[#3a2a1f] text-sand-500"
                    }`}
                  >
                    {opt}
                  </span>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm text-sand-300 mb-3">
                Did you change your approach from the previous heat?
              </legend>
              <div className="flex gap-2">
                <span className="px-4 py-2 text-sm border border-cinnamon-500 text-sand-100">
                  Yes
                </span>
                <span className="px-4 py-2 text-sm border border-[#3a2a1f] text-sand-500">
                  No
                </span>
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-sm text-sand-300 mb-3">
                If you could change one thing about the equipment or competition
                setup to help you make a better espresso, what would it be?
              </legend>
              <div className="border border-[#3a2a1f] bg-[#140f0b] p-3 text-sm text-sand-500 min-h-[72px]">
                Free response — short practitioner note
              </div>
            </fieldset>
          </div>
        </div>
      </section>

      {/* Champion journey */}
      <section className="wec-section">
        <div className="wec-container">
          <h2 className="text-3xl sm:text-4xl font-bold text-sand-100 mb-3">
            Don’t just record the winning recipe.
          </h2>
          <p className="text-xl text-sand-300 mb-8">
            Record how the champion got there.
          </p>
          <div className="space-y-3 max-w-2xl mb-8">
            {journey.map((j) => (
              <div
                key={j.round}
                className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 border border-[#3a2a1f] bg-[#231a14]/40 px-4 py-3"
              >
                <span className="text-sm font-semibold text-cinnamon-400 sm:w-36">
                  {j.round}
                </span>
                <span className="text-sm text-sand-300">{j.q}</span>
              </div>
            ))}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 border border-gold/40 bg-gold/5 px-4 py-3">
              <span className="text-sm font-semibold text-gold sm:w-36">
                Champion’s Protocol
              </span>
              <span className="text-sm text-sand-200">
                Preserve what won — and the path that produced it.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Champion's Protocol */}
      <section className="wec-section bg-[#140f0b]">
        <div className="wec-container grid lg:grid-cols-2 gap-12">
          <div>
            <BookOpen className="w-8 h-8 text-cinnamon-400 mb-4" />
            <h2 className="text-3xl font-bold text-sand-100 mb-4">
              Champion’s Protocol
            </h2>
            <p className="text-sand-400 leading-relaxed mb-4">
              The Champion’s Protocol should preserve not only what won, but how
              the champion arrived there.
            </p>
            <p className="text-sm text-sand-500 mb-2 font-medium text-sand-300">
              Intended protocol fields
            </p>
            <ul className="text-sm text-sand-500 space-y-1 mb-6">
              {[
                "Coffee, roast, water, grinder",
                "Dose, yield, time, temperature",
                "Relevant machine settings",
                "Sensory result under Scoring v3",
              ].map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
            <p className="text-sm text-sand-500 mb-2 font-medium text-sand-300">
              Also valuable to document over time
            </p>
            <ul className="text-sm text-sand-500 space-y-1">
              {[
                "Recipe evolution across rounds",
                "Adjustments between heats",
                "Competitor reasoning",
                "Key turning points and lessons",
              ].map((f) => (
                <li key={f}>• {f}</li>
              ))}
            </ul>
          </div>
          <div className="border border-[#3a2a1f] p-6 bg-[#1a1410]">
            <p className="text-xs uppercase tracking-wider text-cinnamon-400 mb-3">
              Capability clarity
            </p>
            <p className="text-sm text-sand-300 mb-4">
              <span className="text-sand-100 font-medium">WEC 2026:</span> live
              tournament software, blind scoring, public results path, and the
              foundation for structured post-heat insight.
            </p>
            <p className="text-sm text-sand-500">
              <span className="text-sand-300 font-medium">
                Future development:
              </span>{" "}
              richer longitudinal datasets, national-event comparison, and deeper
              category intelligence products — built season by season, not
              oversold as already complete.
            </p>
          </div>
        </div>
      </section>

      {/* Software nervous system */}
      <section className="wec-section">
        <div className="wec-container">
          <p className="text-sm text-cinnamon-400 uppercase tracking-wider mb-3">
            Platform architecture
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-sand-100 mb-3 max-w-2xl">
            The software is the nervous system of WEC.
          </h2>
          <p className="text-sand-400 max-w-2xl mb-10">
            One platform. Multiple roles — competition first, insight as the
            layer that compounds.
          </p>
          <div className="space-y-3">
            {softwareStack.map((s, i) => (
              <div
                key={s.title}
                className="grid sm:grid-cols-[2rem_1fr] gap-3 sm:gap-4 items-start border border-[#3a2a1f] bg-[#231a14]/40 p-4"
              >
                <span className="text-cinnamon-400 font-mono text-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-semibold text-sand-100">{s.title}</h3>
                  <p className="text-sm text-sand-500 mt-1">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner value */}
      <section className="wec-section bg-[#140f0b]">
        <div className="wec-container">
          <h2 className="text-3xl sm:text-4xl font-bold text-sand-100 mb-3">
            A different kind of partnership.
          </h2>
          <p className="text-sand-400 max-w-2xl mb-4">
            WEC partners do not need to be limited to logo placement. The
            championship can become a structured environment for product
            learning.
          </p>
          <p className="text-lg text-sand-200 font-medium mb-10">
            Competition becomes a vehicle for innovation.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            {partnerCategories.map((cat) => (
              <div
                key={cat.title}
                className="border border-[#3a2a1f] bg-[#1a1410] p-5"
              >
                <cat.icon className="w-6 h-6 text-cinnamon-400 mb-3" />
                <h3 className="font-semibold text-sand-100 mb-2">{cat.title}</h3>
                <ul className="text-sm text-sand-500 space-y-1">
                  {cat.items.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="border border-[#3a2a1f] p-6">
              <FlaskConical className="w-6 h-6 text-gold mb-3" />
              <h3 className="text-lg font-semibold text-sand-100 mb-2">
                WEC Competition Intelligence
              </h3>
              <p className="text-sm text-sand-500 mb-4">
                Structured insights — not raw uncontrolled data dumps. Potential
                report areas include competition trends, recipe evolution, common
                friction points, aggregated feedback, requested capabilities,
                winning methodology, and hypotheses requiring further testing.
              </p>
            </div>
            <div className="border border-[#3a2a1f] p-6">
              <Scale className="w-6 h-6 text-gold mb-3" />
              <h3 className="text-lg font-semibold text-sand-100 mb-2">
                Partner technical briefs
              </h3>
              <p className="text-sm text-sand-500">
                Strategic technical partnerships may include category-specific
                competition intelligence and post-event technical workshops,
                subject to partnership scope and competitor-data protections. We
                do not publicly promise proprietary reports to every sponsor.
              </p>
            </div>
          </div>

          <p className="text-sm text-sand-500 mt-8 max-w-3xl">
            Claim discipline: WEC can generate unusually high-quality practitioner
            insight from elite baristas under controlled conditions. It does not
            scientifically prove product-design conclusions from a single event,
            nor treat 32 competitors as a globally representative statistical
            sample.
          </p>
        </div>
      </section>

      {/* Competitor rights */}
      <section className="wec-section">
        <div className="wec-container">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-cinnamon-400" />
            <h2 className="text-3xl sm:text-4xl font-bold text-sand-100">
              The people who create the knowledge matter.
            </h2>
          </div>
          <p className="text-sand-400 max-w-2xl mb-8">
            WEC’s innovation model must respect the competitors whose expertise
            creates the insight. Competitors should know what is collected, why,
            and how it may be used.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {[
              {
                t: "Competition data",
                d: "Used to operate and document the championship.",
              },
              {
                t: "Aggregated insight",
                d: "May be analysed in de-identified or aggregated form.",
              },
              {
                t: "Attributed feedback",
                d: "Requires appropriate competitor permission.",
              },
              {
                t: "Commercial collaboration",
                d: "Handled separately from competition participation.",
              },
            ].map((x) => (
              <div key={x.t} className="border border-[#3a2a1f] p-5">
                <h3 className="font-semibold text-sand-100 mb-1">{x.t}</h3>
                <p className="text-sm text-sand-500">{x.d}</p>
              </div>
            ))}
          </div>
          <div className="border border-cinnamon-800/40 bg-cinnamon-950/20 p-5 max-w-3xl space-y-2">
            <p className="text-sand-200 text-sm flex gap-2">
              <Lock className="w-4 h-4 text-cinnamon-400 flex-shrink-0 mt-0.5" />
              Partners do not buy private access to individual competitors’
              opinions.
            </p>
            <p className="text-sand-200 text-sm flex gap-2">
              <Eye className="w-4 h-4 text-cinnamon-400 flex-shrink-0 mt-0.5" />
              Competition participation never requires positive endorsement of a
              partner or product.
            </p>
          </div>
        </div>
      </section>

      {/* Knowledge both ways */}
      <section className="wec-section bg-[#140f0b]">
        <div className="wec-container max-w-3xl">
          <h2 className="text-3xl font-bold text-sand-100 mb-4">
            Knowledge should flow both ways.
          </h2>
          <p className="text-sand-400 leading-relaxed mb-4">
            Competitors contribute expertise to the championship. WEC intends to
            return useful non-confidential competition insight to the community
            through post-event learning, education and transparent Champion’s
            Protocol material.
          </p>
          <p className="text-sm text-sand-500">
            Future participant asset direction:{" "}
            <span className="text-sand-300">WEC Competition Insights</span> —
            recipe trends, successful adaptations, common challenges, sensory
            patterns, and competition learning.
          </p>
        </div>
      </section>

      {/* Long-term — restrained */}
      <section className="wec-section">
        <div className="wec-container">
          <h2 className="text-3xl sm:text-4xl font-bold text-sand-100 mb-3">
            The data becomes more valuable every season.
          </h2>
          <p className="text-sand-400 max-w-2xl mb-10">
            One competition produces insight. A global competition network can
            create a unique longitudinal view of elite espresso performance.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                y: "2026",
                t: "One World Championship",
                d: "A high-value initial dataset from Panama.",
              },
              {
                y: "2027",
                t: "More events",
                d: "Comparative insight across seasons — future potential.",
              },
              {
                y: "Future",
                t: "Network effect",
                d: "National championships, multiple formats, longitudinal intelligence — clearly labelled as future potential.",
              },
            ].map((x) => (
              <div key={x.y} className="border border-[#3a2a1f] p-5">
                <p className="text-gold font-semibold mb-1">{x.y}</p>
                <h3 className="text-sand-100 font-semibold mb-2">{x.t}</h3>
                <p className="text-sm text-sand-500">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="wec-section bg-gradient-to-b from-[#140f0b] to-[#1a1410]">
        <div className="wec-container text-center max-w-3xl mx-auto">
          <Trophy className="w-10 h-10 text-gold mx-auto mb-5" />
          <h2 className="text-3xl sm:text-4xl font-bold text-sand-100 mb-5">
            The world’s best baristas are already solving the problems.
          </h2>
          <p className="text-sand-400 leading-relaxed mb-8">
            WEC gives them a controlled stage on which to compete. Our software
            gives us a way to learn from what happens. The Champion’s Protocol
            gives us a way to preserve what works. And the Innovation Lab creates
            a way to build from it.
          </p>
          <div className="space-y-2 mb-10">
            <p className="text-xl font-bold text-sand-100">Find excellence.</p>
            <p className="text-xl font-bold text-sand-100">Understand it.</p>
            <p className="text-xl font-bold wec-gradient-text">Build from it.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/panama-2026#sponsors">
              <Button
                size="lg"
                className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100 px-8"
              >
                <Handshake className="mr-2 w-5 h-5" />
                Partner with WEC
              </Button>
            </Link>
            <Link to="/panama-2026">
              <Button
                size="lg"
                className="bg-gold text-[#1a1410] hover:bg-[#d4a35e] font-semibold px-8"
              >
                WEC 2026 · Panama
              </Button>
            </Link>
            <Link to="/live/wec-2026-panama">
              <Button
                size="lg"
                variant="outline"
                className="border-sand-400/30 text-sand-200 px-8"
              >
                Live board
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
          <p className="text-xs text-sand-600 mt-10 max-w-xl mx-auto">
            Hierarchy: the competition finds excellence → the software records it
            → the Champion’s Protocol preserves it → the Innovation Lab learns
            from it → the industry can build from it.
          </p>
        </div>
      </section>
    </div>
  );
}

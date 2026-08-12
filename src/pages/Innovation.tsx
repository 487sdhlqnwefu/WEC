import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Brain,
  Coffee,
  Cpu,
  Droplets,
  FlaskConical,
  Handshake,
  Lightbulb,
  MessageSquareQuote,
  Microscope,
  Settings2,
  Trophy,
  Wrench,
} from "lucide-react";

const loopSteps = [
  {
    step: "01",
    title: "Compete",
    desc: "The world’s best baristas face the same coffee, same machine, same water — blind.",
  },
  {
    step: "02",
    title: "Capture",
    desc: "After each heat, competitors log what they changed: grind, dose, yield, temperature, technique, and why.",
  },
  {
    step: "03",
    title: "Learn",
    desc: "Patterns emerge. What wins is not opinion — it is repeated preference under controlled conditions.",
  },
  {
    step: "04",
    title: "Build",
    desc: "That intelligence feeds better machines, grinders, water systems, accessories — and better coffee.",
  },
];

const dataPoints = [
  {
    icon: Settings2,
    title: "Extraction decisions",
    desc: "Grind, dose, yield, time, temperature, pre-infusion — the levers that actually moved the cup.",
  },
  {
    icon: MessageSquareQuote,
    title: "Why they chose it",
    desc: "Short, structured notes from people who just won or lost a heat. Context you cannot get from a score sheet.",
  },
  {
    icon: FlaskConical,
    title: "What beat what",
    desc: "Paired-comparison outcomes tied to recipes. Not “87.5” — A was preferred over B, and here is how A was made.",
  },
  {
    icon: Microscope,
    title: "Equipment response",
    desc: "How the machine, grinder, and water behaved under pressure — feedback from the people who push them hardest.",
  },
];

const audiences = [
  {
    icon: Cpu,
    title: "Machine makers",
    desc: "Learn which controls competitors actually use when texture and taste are on the line.",
  },
  {
    icon: Wrench,
    title: "Grinder & accessory brands",
    desc: "See what settings and tools show up in winning heats — and what disappears.",
  },
  {
    icon: Droplets,
    title: "Water & filtration",
    desc: "Understand how water variables show up when everything else is held constant.",
  },
  {
    icon: Coffee,
    title: "Roasters & producers",
    desc: "Watch how the same green expresses when the world’s best extract it — then publish what works.",
  },
];

export default function Innovation() {
  return (
    <div>
      {/* Hero — one composition, brand first */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/event-35.jpg"
            alt=""
            className="w-full h-full object-cover opacity-25 scale-105 animate-[slow-zoom_24s_ease-in-out_infinite_alternate]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1410]/55 via-[#1a1410]/75 to-[#1a1410]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1a1410]/80 via-transparent to-[#1a1410]/50" />
        </div>

        <div className="wec-container relative py-24">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-8 animate-[fade-up_0.7s_ease-out]">
              <img
                src="/assets/logo-white.png"
                alt="World Espresso Championship"
                className="h-14 w-14 object-contain"
              />
              <div>
                <p className="text-xs tracking-[0.22em] text-cinnamon-400 uppercase">
                  World Espresso Championship
                </p>
                <p className="text-sm text-sand-500">Innovation · Think Tank</p>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-sand-100 tracking-tight leading-[1.05] mb-6 animate-[fade-up_0.8s_ease-out]">
              The cup decides.
              <br />
              <span className="wec-gradient-text">The data teaches.</span>
            </h1>

            <p className="text-lg sm:text-xl text-sand-400 max-w-2xl leading-relaxed mb-10 animate-[fade-up_0.9s_ease-out]">
              WEC is a championship — and a think tank. The people who make the
              best coffee leave structured feedback after every heat. That is how
              we learn what the industry should build next.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 animate-[fade-up_1s_ease-out]">
              <Link to="/panama-2026#sponsors">
                <Button
                  size="lg"
                  className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100 px-8 wec-glow"
                >
                  <Handshake className="mr-2 w-5 h-5" />
                  Partner on the insight
                </Button>
              </Link>
              <Link to="/judging">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-sand-400/30 text-sand-200 hover:bg-sand-400/10 px-8"
                >
                  How judging works
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core idea */}
      <section className="wec-section bg-[#140f0b]">
        <div className="wec-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Brain className="w-9 h-9 text-cinnamon-400 mb-5" />
              <h2 className="text-3xl sm:text-4xl font-bold text-sand-100 mb-5">
                Competition as a vehicle for innovation
              </h2>
              <p className="text-sand-400 leading-relaxed mb-5">
                Most competitions crown a winner and stop. WEC keeps going. After
                each heat, competitors answer the questions that matter: what did
                you change, what did you feel, what would you build if you could?
              </p>
              <p className="text-sand-400 leading-relaxed">
                When the world’s best tell you what they need from a machine, a
                grinder, a water system, or an accessory — that is not a survey.
                That is product intelligence.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden border border-[#3a2a1f]">
                <img
                  src="/assets/event-2.jpg"
                  alt="WEC competition floor"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-sand-500 mt-3">
                Same coffee. Same equipment. The only variable is the barista —
                and what they choose to share after the heat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Loop */}
      <section className="wec-section">
        <div className="wec-container">
          <div className="max-w-2xl mb-12">
            <Lightbulb className="w-8 h-8 text-gold mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold text-sand-100 mb-4">
              The WEC innovation loop
            </h2>
            <p className="text-sand-400">
              One closed circuit. Compete. Capture. Learn. Build. Repeat every
              championship.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loopSteps.map((item, i) => (
              <div
                key={item.step}
                className="relative pt-2"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <span className="text-4xl font-bold text-cinnamon-900/80 block mb-3">
                  {item.step}
                </span>
                <h3 className="text-lg font-semibold text-sand-100 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-sand-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we gather */}
      <section className="wec-section bg-[#140f0b]">
        <div className="wec-container">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-sand-100 mb-4">
              What competitors leave behind
            </h2>
            <p className="text-sand-400">
              Not vibes. Structured feedback tied to real heats — so sponsors and
              builders can act on it.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-8">
            {dataPoints.map((item) => (
              <div key={item.title} className="flex gap-4">
                <div className="w-11 h-11 rounded-lg bg-cinnamon-950/50 border border-cinnamon-800/40 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-cinnamon-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-sand-100 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-sand-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who benefits */}
      <section className="wec-section">
        <div className="wec-container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-sand-100 mb-4">
              Built for people who make the tools
            </h2>
            <p className="text-sand-400">
              If you manufacture, roast, or design for espresso — this is where
              the world’s best pressure-test your category.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {audiences.map((item) => (
              <div
                key={item.title}
                className="border border-[#3a2a1f] bg-[#231a14]/60 p-6 transition-colors duration-300 hover:border-cinnamon-700/60"
              >
                <item.icon className="w-7 h-7 text-cinnamon-400 mb-4" />
                <h3 className="text-base font-semibold text-sand-100 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-sand-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote / principle */}
      <section className="wec-section bg-gradient-to-b from-[#140f0b] to-[#1a1410]">
        <div className="wec-container">
          <blockquote className="max-w-3xl mx-auto text-center">
            <p className="text-2xl sm:text-3xl font-semibold text-sand-100 leading-snug mb-6">
              “Who makes the best coffee already knows what is required to make
              the best coffee. WEC turns that knowledge into shared industry
              progress.”
            </p>
            <footer className="text-sm text-cinnamon-400 tracking-wide uppercase">
              Objective Coffee Community · WEC
            </footer>
          </blockquote>
        </div>
      </section>

      {/* CTA */}
      <section className="wec-section">
        <div className="wec-container text-center">
          <Trophy className="w-10 h-10 text-gold mx-auto mb-5" />
          <h2 className="text-3xl sm:text-4xl font-bold text-sand-100 mb-4">
            Sponsor the championship.
            <br />
            Inherit the insight.
          </h2>
          <p className="text-sand-400 max-w-xl mx-auto mb-8">
            Café Unido hosts WEC 2026 Panama on 26 October. Partners who fund the
            arena also sit closest to the think tank it creates.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/panama-2026#sponsors">
              <Button
                size="lg"
                className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100 px-8"
              >
                <Handshake className="mr-2 w-5 h-5" />
                View partner packages
              </Button>
            </Link>
            <Link to="/live/wec-2026-panama">
              <Button
                size="lg"
                variant="outline"
                className="border-sand-400/30 text-sand-200 px-8"
              >
                See the live board
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slow-zoom {
          from { transform: scale(1.05); }
          to { transform: scale(1.12); }
        }
      `}</style>
    </div>
  );
}

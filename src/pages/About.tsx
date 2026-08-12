import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import {
  Coffee,
  ArrowRight,
  Check,
  ChevronDown,
  Globe,
  FileText,
  Star,
  Eye,
  Scale,
  BookOpen,
  User,
} from "lucide-react";

export default function About() {
  const [activeAccordion, setActiveAccordion] = useState<string | null>("format");
  const createOrganiser = trpc.organiser.create.useMutation({
    onSuccess: () => toast.success("Application submitted successfully!"),
    onError: (err) => toast.error(err.message),
  });

  const handleOrganiserSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    createOrganiser.mutate({
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || undefined,
      country: formData.get("country") as string,
      city: (formData.get("city") as string) || undefined,
      organisation: (formData.get("organisation") as string) || undefined,
      experience: (formData.get("experience") as string) || undefined,
      venueDescription: (formData.get("venueDescription") as string) || undefined,
      expectedCompetitors: formData.get("expectedCompetitors") ? parseInt(formData.get("expectedCompetitors") as string) : undefined,
      proposedDate: (formData.get("proposedDate") as string) || undefined,
      message: (formData.get("message") as string) || undefined,
    });
    form.reset();
  };

  const accordionItems = [
    {
      id: "format",
      icon: Scale,
      title: "Competition Format",
      content: `The World Espresso Championship is a single-elimination tournament built on ISO 5495:2005 paired comparison methodology. 32 country champions compete in 5 rounds of single-elimination competition. 31 matches total. One winner.

Each match: Two competitors face each other with the same coffee, same equipment, blind judges. Three sensory categories — Tactile (15), Taste (10), Flavour (8) — scored as Cup A or Cup B per judge. No visual categories. No deliberation. 99 points total across three judges. 50+ wins.

This is Scoring v3: texture carries the most weight because it is the most objective and consumer-relevant attribute. Flavour cannot decide a heat alone. The coffee speaks. The judges choose. The loser is eliminated. The winner advances.`,
    },
    {
      id: "coffee",
      icon: Coffee,
      title: "Champion's Coffee Product",
      content: `WEC 2026 is the first year we create the Champion's Coffee Product. Here's how it works:

• The winner's recipe, official roasting profile, and official green coffee create a protocol
• The coffee is named after the champion (e.g., "[Name]'s Champion Espresso")
• The champion receives 5-10% royalty on every bag sold
• The champion promotes the product through their channels and at industry events
• The product launches globally within 30 days of the competition
• Sold through the sponsor's retail channels, OCC's online store, and partner cafes

This is unprecedented. No other competition does this. The champion doesn't just win a title — they win a product, a revenue stream, a legacy, a career.`,
    },
    {
      id: "missing",
      icon: FileText,
      title: "Fulfilling the Missing Compulsory Round",
      content: `The World Barista Championship used to have a compulsory round. Every competitor used the same coffee. It was the only part of the competition that tested pure skill.

They removed it.

WEC is that round — but as a standalone competition with proper stakes, proper prizes, and a proper commercial future. We took the best part of WBC and built an entire championship around it.`,
    },
    {
      id: "innovation",
      icon: Star,
      title: "A Vehicle for Innovation and Transparency",
      content: `Every espresso in WEC is evaluated objectively. The data is public. The recipes are shared. The industry learns from each event.

When the best recipe wins, everyone can learn from it. When extraction parameters are published, every barista can replicate it. When the champion's product is sold, the industry gets better coffee.

This is how competition drives progress. This is what the manufacturer could not see. This is what the community always knew.`,
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cinnamon-950/20 to-transparent" />
        <div className="wec-container relative">
          <div className="max-w-4xl">
            <span className="text-sm text-cinnamon-400 font-medium uppercase tracking-wider">
              About WEC
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-sand-100 mt-3 mb-6">
              The World's Most{" "}
              <span className="wec-gradient-text">Objective</span> Espresso
              Competition
            </h1>
            <p className="text-lg sm:text-xl text-sand-400 leading-relaxed max-w-3xl">
              The World Espresso Championship exists to find the best espresso
              maker on Earth through blind, paired-comparison testing. Same
              coffee. Same machine. Only the barista differs.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="wec-section bg-[#140f0b]">
        <div className="wec-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#3a2a1f]">
                <img
                  src="/assets/event-35.jpg"
                  alt="WEC Competition"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <Eye className="w-8 h-8 text-cinnamon-400 mb-4" />
              <h2 className="text-3xl sm:text-4xl font-bold text-sand-100 mb-4">
                Our Mission
              </h2>
              <p className="text-sand-400 leading-relaxed mb-6">
                To seek the best coffee for the benefit of all. We believe that
                coffee is much more than just a drink — it's a force for good in
                the world and in the lives of everyone it touches.
              </p>
              <p className="text-sand-400 leading-relaxed mb-6">
                Every bean has a story, and every cup has the potential to
                create real impact. We bring together farmers, roasters, baristas
                and coffee lovers, to seek out and develop the best coffee,
                whatever it takes.
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Eye, label: "100% Blind Judging" },
                  { icon: FileText, label: "Public Recipe Data" },
                  { icon: Scale, label: "ISO 5495 Standard" },
                  { icon: Coffee, label: "Champion's Product" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <item.icon className="w-5 h-5 text-cinnamon-400" />
                    <span className="text-sm text-sand-300">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="wec-section">
        <div className="wec-container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <User className="w-8 h-8 text-cinnamon-400" />
                <span className="text-sm text-cinnamon-400 font-medium uppercase tracking-wider">
                  Founder
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-sand-100 mb-4">
                Tristan Creswick
              </h2>
              <p className="text-sand-400 leading-relaxed mb-4">
                Tristan founded the World Espresso Championship in 2022 to prove
                a simple idea: the best espresso should be decided by the cup —
                same coffee, same machine, blind judges — not by storytelling or
                politics.
              </p>
              <p className="text-sand-400 leading-relaxed mb-4">
                After years building WEC inside an equipment manufacturer, he
                left that path to make the championship independent. Today he
                runs WEC full-time: competition design, Scoring v3, tournament
                software, sponsor relationships, and the push toward Panama 2026
                at Café Unido.
              </p>
              <p className="text-sand-500 text-sm leading-relaxed">
                The goal is not another trophy. It is a transparent format the
                industry can trust — and a Champion&apos;s Coffee Product that
                turns winning into a real career.
              </p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="w-full max-w-[220px]">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-[#3a2a1f] bg-[#2a1f16]">
                  <img
                    src="/assets/founder-tristan.jpg"
                    alt="Tristan Creswick, founder of the World Espresso Championship"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <p className="mt-3 text-sm text-sand-500 text-center lg:text-left">
                  Four championships held since 2022. First independent finals:
                  Panama City · 26 October 2026.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="wec-section bg-[#140f0b]">
        <div className="wec-container">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-sand-100 mb-4">
              How It Works
            </h2>
            <p className="text-sand-400 max-w-2xl mx-auto">
              Five simple steps from qualification to champion.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { step: "01", title: "National Qualifier", desc: "Win your country's national espresso competition" },
              { step: "02", title: "World Finals", desc: "Join 31 other national champions in Panama" },
              { step: "03", title: "Single Elimination", desc: "Head-to-head matches with same coffee & equipment" },
              { step: "04", title: "Blind Judging", desc: "ISO 5495 paired comparison. No bias. No politics." },
              { step: "05", title: "Champion Crowned", desc: "Winner receives title, prize & Champion's Coffee deal" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 rounded-full bg-cinnamon-950/50 border border-cinnamon-800/50 flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-bold text-cinnamon-400">{item.step}</span>
                </div>
                <h3 className="text-base font-semibold text-sand-100 mb-2">{item.title}</h3>
                <p className="text-sm text-sand-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coffee sharing principle */}
      <section className="wec-section bg-[#140f0b]">
        <div className="wec-container">
          <div className="max-w-3xl mx-auto">
            <BookOpen className="w-8 h-8 text-cinnamon-400 mb-4" />
            <h2 className="text-3xl sm:text-4xl font-bold text-sand-100 mb-4">
              The coffee sharing principle
            </h2>
            <p className="text-sand-400 leading-relaxed mb-4">
              After the competition, the winning recipe should not disappear.
              Water, filtration, grinder, machine, tools, green coffee, roast
              profile, espresso recipe — whatever is needed so that{" "}
              <strong className="text-sand-200">
                anyone can access the ingredients and method to make championship
                coffee for themselves
              </strong>
              .
            </p>
            <p className="text-sand-500 text-sm leading-relaxed mb-6">
              That is how competition evolves espresso for the whole industry —
              not just the people who were in the room. The Champion&apos;s Coffee
              Product and the Innovation Lab are how we turn that principle into
              something people can buy, learn from, and build on.
            </p>
            <Link to="/vision">
              <Button
                variant="outline"
                className="border-sand-400/30 text-sand-200"
              >
                Read the full vision
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Accordion Sections */}
      <section className="wec-section">
        <div className="wec-container">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-sand-100 mb-8 text-center">
              Everything You Need to Know
            </h2>
            <div className="space-y-3">
              {accordionItems.map((item) => (
                <div key={item.id} className="wec-card rounded-lg overflow-hidden">
                  <button
                    onClick={() => setActiveAccordion(activeAccordion === item.id ? null : item.id)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-cinnamon-400" />
                      <span className="font-semibold text-sand-100">{item.title}</span>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-sand-500 transition-transform ${activeAccordion === item.id ? "rotate-180" : ""}`} />
                  </button>
                  {activeAccordion === item.id && (
                    <div className="px-5 pb-5 pt-0">
                      <div className="pl-8 border-l-2 border-cinnamon-800/50">
                        <p className="text-sand-400 text-sm leading-relaxed whitespace-pre-line">
                          {item.content}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* National Organisers */}
      <section className="wec-section">
        <div className="wec-container">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <Globe className="w-8 h-8 text-cinnamon-400 mb-4" />
              <h2 className="text-3xl sm:text-4xl font-bold text-sand-100 mb-4">
                National Organisers Wanted
              </h2>
              <p className="text-sand-400 leading-relaxed mb-6">
                We are looking for partners to host national competitions in
                every country. We need national organisers who can run
                qualifiers. OCC provides the rules, format, brand guidelines,
                training materials, and technical support.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  "The rules & competition format",
                  "Brand guidelines & assets",
                  "Training materials for judges",
                  "Technical support & guidance",
                  "Connection to the global WEC network",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-gold" />
                    <span className="text-sm text-sand-300">{item}</span>
                  </div>
                ))}
              </div>
              <div className="wec-card rounded-xl p-6">
                <h4 className="font-semibold text-sand-100 mb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-cinnamon-400" />
                  Local Partners Provide:
                </h4>
                <ul className="text-sm text-sand-400 space-y-1">
                  <li>• The venue</li>
                  <li>• The competitors</li>
                  <li>• The audience</li>
                  <li>• The media coverage</li>
                </ul>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-sand-100 mb-6">
                Apply to Be a National Organiser
              </h3>
              <form onSubmit={handleOrganiserSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    name="fullName"
                    type="text"
                    required
                    placeholder="Full Name *"
                    className="wec-input w-full px-4 py-3 rounded-lg text-sm"
                  />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="Email *"
                    className="wec-input w-full px-4 py-3 rounded-lg text-sm"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    name="country"
                    type="text"
                    required
                    placeholder="Country *"
                    className="wec-input w-full px-4 py-3 rounded-lg text-sm"
                  />
                  <input
                    name="city"
                    type="text"
                    placeholder="City"
                    className="wec-input w-full px-4 py-3 rounded-lg text-sm"
                  />
                </div>
                <input
                  name="organisation"
                  type="text"
                  placeholder="Organisation / Company"
                  className="wec-input w-full px-4 py-3 rounded-lg text-sm"
                />
                <input
                  name="phone"
                  type="tel"
                  placeholder="Phone Number"
                  className="wec-input w-full px-4 py-3 rounded-lg text-sm"
                />
                <textarea
                  name="experience"
                  rows={3}
                  placeholder="Event management experience"
                  className="wec-input w-full px-4 py-3 rounded-lg text-sm resize-none"
                />
                <textarea
                  name="venueDescription"
                  rows={3}
                  placeholder="Describe your proposed venue"
                  className="wec-input w-full px-4 py-3 rounded-lg text-sm resize-none"
                />
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    name="expectedCompetitors"
                    type="number"
                    placeholder="Expected competitors"
                    className="wec-input w-full px-4 py-3 rounded-lg text-sm"
                  />
                  <input
                    name="proposedDate"
                    type="text"
                    placeholder="Proposed date"
                    className="wec-input w-full px-4 py-3 rounded-lg text-sm"
                  />
                </div>
                <textarea
                  name="message"
                  rows={3}
                  placeholder="Additional message"
                  className="wec-input w-full px-4 py-3 rounded-lg text-sm resize-none"
                />
                <Button
                  type="submit"
                  className="w-full bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100"
                  disabled={createOrganiser.isPending}
                >
                  {createOrganiser.isPending ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="wec-section bg-[#140f0b]">
        <div className="wec-container text-center">
          <h2 className="text-3xl font-bold text-sand-100 mb-4">
            Ready to Compete?
          </h2>
          <p className="text-sand-400 max-w-xl mx-auto mb-8">
            Registration is open for WEC 2026 Panama. Limited to 32 competitors
            from around the world.
          </p>
          <Link to="/panama-2026">
            <Button
              size="lg"
              className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100 px-8"
            >
              Register Now
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

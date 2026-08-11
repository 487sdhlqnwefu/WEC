import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { trpc } from "@/providers/trpc";
import { toast } from "sonner";
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Star,
  Coffee,
  Handshake,
  ArrowRight,
  Check,
  Globe,
  Award,
  Crown,
} from "lucide-react";

export default function Panama2026() {
  const [regType, setRegType] = useState<"competitor" | "judge" | "volunteer">("competitor");
  const [activeTab, setActiveTab] = useState<"competitors" | "sponsors" | "register">("competitors");

  const createRegistration = trpc.registrations.create.useMutation({
    onSuccess: () => toast.success("Registration submitted successfully!"),
    onError: (err) => toast.error(err.message),
  });

  const createSponsor = trpc.sponsors.create.useMutation({
    onSuccess: () => toast.success("Sponsorship inquiry submitted! We'll be in touch."),
    onError: (err) => toast.error(err.message),
  });

  const handleRegSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    createRegistration.mutate({
      type: regType,
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || undefined,
      country: formData.get("country") as string,
      city: (formData.get("city") as string) || undefined,
      employer: (formData.get("employer") as string) || undefined,
      experience: (formData.get("experience") as string) || undefined,
      qualificationMethod: (formData.get("qualificationMethod") as string) || undefined,
      professionalBackground: (formData.get("professionalBackground") as string) || undefined,
      sensoryExperience: (formData.get("sensoryExperience") as string) || undefined,
      availability: (formData.get("availability") as string) || undefined,
      rolePreference: (formData.get("rolePreference") as string) || undefined,
      skills: (formData.get("skills") as string) || undefined,
      languages: (formData.get("languages") as string) || undefined,
      socialMedia: (formData.get("socialMedia") as string) || undefined,
      conflictOfInterest: (formData.get("conflictOfInterest") as string) || undefined,
      dietaryRequirements: (formData.get("dietaryRequirements") as string) || undefined,
      emergencyContact: (formData.get("emergencyContact") as string) || undefined,
      agreedToRules: formData.get("agreedToRules") === "on",
    });
    form.reset();
  };

  const handleSponsorSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    createSponsor.mutate({
      companyName: formData.get("companyName") as string,
      contactName: formData.get("contactName") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || undefined,
      tier: (formData.get("tier") as "title" | "green" | "gold" | "silver" | "supporting" | "custom") || "custom",
      budget: (formData.get("budget") as string) || undefined,
      message: (formData.get("message") as string) || undefined,
      website: (formData.get("website") as string) || undefined,
    });
    form.reset();
  };

  const sponsorTiers = [
    {
      name: "Presenting Partner",
      price: "€15,000–€25,000",
      description:
        "Lead equipment or brand partner. Closest association with the live, blind format.",
      features: [
        "'WEC 2026 presented with [Your Brand]' recognition",
        "On-site branding at Café Unido",
        "Logo on live bracket + website",
        "Social + LinkedIn campaign mentions",
        "2–4 team passes / hospitality",
        "Optional machine or product demo zone",
      ],
      highlighted: true,
    },
    {
      name: "Official Partner",
      price: "€7,500–€12,000",
      description:
        "Strong visibility for grinders, water, milk, or media brands that fit the sensory story.",
      features: [
        "Category exclusivity where possible",
        "Logo on website + event materials",
        "Live-board mention during finals",
        "Social media package",
        "2 team passes",
      ],
      highlighted: false,
    },
    {
      name: "Supporting Partner",
      price: "€2,500–€5,000",
      description:
        "Accessible entry for roasters, tools, and regional brands who want to stand with WEC.",
      features: [
        "Logo on website sponsor wall",
        "Social thank-you posts",
        "Name in event programme",
        "1 team pass",
      ],
      highlighted: false,
    },
    {
      name: "In-kind / Trade",
      price: "By agreement",
      description:
        "Coffee already covered by Café Unido. Open for machines, water, cups, media, travel support.",
      features: [
        "Negotiated visibility for real operational value",
        "Credit on site + live board where relevant",
        "Warm intro to competitor & judge network",
      ],
      highlighted: false,
    },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/event-36.jpg"
            alt="Panama"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1410]/80 via-[#1a1410]/90 to-[#1a1410]" />
        </div>
        <div className="wec-container relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 mb-8">
              <Star className="w-4 h-4 text-gold" />
              <span className="text-sm text-gold font-medium">
                Inaugural Champion's Coffee Product Year
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-sand-100 mb-6">
              WEC 2026{" "}
              <span className="wec-gradient-text">Panama</span>
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-6 mb-8 text-sand-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cinnamon-400" />
                <span>26 October 2026</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cinnamon-400" />
                <span>Café Unido, Panama City</span>
              </div>
            </div>
            <p className="text-lg sm:text-xl text-sand-400 max-w-2xl mx-auto mb-10">
              Café Unido hosts WEC 2026 and is the roaster sponsor. Same coffee.
              Same machine. Blind sensory judging under Scoring v3. The cup
              decides.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100 px-8 wec-glow"
                onClick={() => { setActiveTab("register"); document.getElementById("register")?.scrollIntoView({ behavior: "smooth" }); }}
              >
                <Trophy className="mr-2 w-5 h-5" />
                Register Now
              </Button>
              <Link to="/live/wec-2026-panama">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-sand-400/30 text-sand-200 hover:bg-sand-400/10 px-8"
                >
                  Live Bracket
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-sand-400/30 text-sand-200 hover:bg-sand-400/10 px-8"
                onClick={() => { setActiveTab("sponsors"); document.getElementById("sponsors")?.scrollIntoView({ behavior: "smooth" }); }}
              >
                <Handshake className="mr-2 w-5 h-5" />
                Become a Sponsor
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Info Cards */}
      <section className="wec-section bg-[#140f0b]">
        <div className="wec-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: Users, label: "Competitors", value: "32" },
              { icon: Trophy, label: "Prize Money", value: "€3,000" },
              { icon: Crown, label: "Champion's Product", value: "5-10% Royalty" },
              { icon: Globe, label: "Countries", value: "Worldwide" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="wec-card rounded-xl p-6 text-center"
              >
                <stat.icon className="w-8 h-8 text-cinnamon-400 mx-auto mb-3" />
                <div className="text-2xl sm:text-3xl font-bold text-sand-100">
                  {stat.value}
                </div>
                <div className="text-sm text-sand-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Register / Why Sponsor Tabs */}
      <section className="wec-section">
        <div className="wec-container">
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {[
              { id: "competitors" as const, label: "For Competitors", icon: Trophy },
              { id: "sponsors" as const, label: "For Sponsors", icon: Handshake },
              { id: "register" as const, label: "Register Now", icon: ArrowRight },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "bg-cinnamon-600 text-sand-100"
                    : "bg-[#231a14] text-sand-400 hover:text-sand-200 border border-[#3a2a1f]"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Competitors Content */}
          {activeTab === "competitors" && (
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-sand-100 mb-6">
                  Why Competitors Should Register
                </h2>
                <p className="text-sand-400 leading-relaxed mb-8">
                  The first WEC champion will be the first barista in history to
                  have a globally distributed coffee product named after them.
                  Not just a trophy. A career. A legacy. A revenue stream.
                </p>
                <div className="space-y-4">
                  {[
                    { icon: Trophy, text: "WEC 2026 World Champion title and trophy" },
                    { icon: Coffee, text: "Champion's Coffee Product — retail blend named after you, sold globally" },
                    { icon: DollarSign, text: "5-10% royalty on every bag sold (estimated €7,500+ in Year 1)" },
                    { icon: Globe, text: "Media coverage and profile feature on OCC platforms" },
                    { icon: Award, text: "Automatic invitation to defend title at WEC 2027" },
                    { icon: Users, text: "Lifetime OCC membership and alumni network access" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-cinnamon-950/50 border border-cinnamon-800/50 flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-4 h-4 text-cinnamon-400" />
                      </div>
                      <span className="text-sand-300 text-sm">{item.text}</span>
                    </div>
                  ))}
                </div>
                <p className="text-gold text-sm font-medium mt-8">
                  There will only be one first champion. One first product. One
                  first legacy. Will it be you?
                </p>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#3a2a1f]">
                  <img
                    src="/assets/event-25.jpg"
                    alt="Competitor"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Sponsors Content */}
          {activeTab === "sponsors" && (
            <div>
              <div className="text-center mb-10" id="sponsors">
                <h2 className="text-3xl sm:text-4xl font-bold text-sand-100 mb-4">
                  Partner with WEC 2026
                </h2>
                <p className="text-sand-400 max-w-3xl mx-auto mb-6">
                  Café Unido is confirmed as venue and roaster sponsor. We are
                  filling the remaining stack — equipment, water, tools, media —
                  with partners who want their name on the most objective espresso
                  format in coffee.
                </p>
                <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-4 px-5 py-3 rounded-xl bg-gold/10 border border-gold/30 text-sm">
                  <span className="text-gold font-medium">Funding target</span>
                  <span className="text-sand-200">
                    ~€20,000 cash + in-kind to run Panama cleanly
                  </span>
                </div>
              </div>

              <div className="wec-card rounded-xl p-6 mb-10 max-w-3xl mx-auto">
                <h3 className="font-semibold text-sand-100 mb-2">Why sponsor this?</h3>
                <ul className="space-y-2 text-sm text-sand-400">
                  <li>• Blind sensory format — your brand beside trust, not politics</li>
                  <li>• Public live bracket software — results the industry can watch</li>
                  <li>• Same week the global coffee community is already in Panama</li>
                  <li>• Honest packages sized for real partners (not fantasy title fees)</li>
                </ul>
                <Link to="/judging" className="inline-flex items-center text-sm text-cinnamon-400 hover:text-cinnamon-300 mt-4">
                  Read how Scoring v3 works
                  <ArrowRight className="ml-1 w-4 h-4" />
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {sponsorTiers.map((tier) => (
                  <div
                    key={tier.name}
                    className={`wec-card rounded-xl p-6 flex flex-col ${
                      tier.highlighted
                        ? "border-gold/50 ring-1 ring-gold/20"
                        : ""
                    }`}
                  >
                    {tier.highlighted && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gold/10 border border-gold/30 text-xs text-gold mb-3 self-start">
                        <Star className="w-3 h-3" />
                        Best fit for lead partners
                      </span>
                    )}
                    <h3 className="text-lg font-bold text-sand-100 mb-1">
                      {tier.name}
                    </h3>
                    <div className="text-xl font-bold text-gold mb-2">
                      {tier.price}
                    </div>
                    <p className="text-sm text-sand-500 mb-4 flex-1">
                      {tier.description}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {tier.features.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2 text-sm text-sand-400"
                        >
                          <Check className="w-4 h-4 text-cinnamon-400 mt-0.5 flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="mt-12 wec-card rounded-xl p-8">
                <h3 className="text-xl font-semibold text-sand-100 mb-4">
                  Submit Sponsorship Inquiry
                </h3>
                <form onSubmit={handleSponsorSubmit} className="grid sm:grid-cols-2 gap-4">
                  <input name="companyName" required placeholder="Company Name *" className="wec-input w-full px-4 py-3 rounded-lg text-sm" />
                  <input name="contactName" required placeholder="Contact Name *" className="wec-input w-full px-4 py-3 rounded-lg text-sm" />
                  <input name="email" type="email" required placeholder="Email *" className="wec-input w-full px-4 py-3 rounded-lg text-sm" />
                  <input name="phone" placeholder="Phone" className="wec-input w-full px-4 py-3 rounded-lg text-sm" />
                  <select name="tier" className="wec-input w-full px-4 py-3 rounded-lg text-sm" defaultValue="">
                    <option value="">Select Tier</option>
                    <option value="title">Title Sponsor (€250,000)</option>
                    <option value="green">Green Sponsor ($5,000+)</option>
                    <option value="gold">Gold Sponsor (€50,000)</option>
                    <option value="silver">Silver Sponsor (€25,000)</option>
                    <option value="supporting">Supporting Sponsor (€10,000)</option>
                    <option value="custom">Custom</option>
                  </select>
                  <input name="website" placeholder="Company Website" className="wec-input w-full px-4 py-3 rounded-lg text-sm" />
                  <input name="budget" placeholder="Budget Range" className="wec-input w-full px-4 py-3 rounded-lg text-sm" />
                  <textarea name="message" placeholder="Message" className="wec-input w-full px-4 py-3 rounded-lg text-sm resize-none sm:col-span-2" rows={3} />
                  <Button
                    type="submit"
                    className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100 sm:col-span-2"
                    disabled={createSponsor.isPending}
                  >
                    {createSponsor.isPending ? "Submitting..." : "Submit Inquiry"}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </form>
              </div>
            </div>
          )}

          {/* Register Form */}
          {activeTab === "register" && (
            <div id="register">
              <div className="text-center mb-8">
                <h2 className="text-3xl sm:text-4xl font-bold text-sand-100 mb-4">
                  Registration
                </h2>
                <p className="text-sand-400">
                  Choose your role and fill out the form below.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {[
                  { id: "competitor" as const, label: "Competitor", icon: Trophy },
                  { id: "judge" as const, label: "Judge", icon: Award },
                  { id: "volunteer" as const, label: "Volunteer", icon: Users },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setRegType(t.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      regType === t.id
                        ? "bg-cinnamon-600 text-sand-100"
                        : "bg-[#231a14] text-sand-400 hover:text-sand-200 border border-[#3a2a1f]"
                    }`}
                  >
                    <t.icon className="w-4 h-4" />
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="max-w-2xl mx-auto wec-card rounded-xl p-6 sm:p-8">
                {regType === "competitor" && (
                  <div className="mb-6 p-4 rounded-lg bg-cinnamon-950/30 border border-cinnamon-800/50">
                    <p className="text-sm text-cinnamon-300">
                      <strong>Eligibility:</strong> Open for current Barista
                      Champions attending WBC 2026, or top 3 National Espresso
                      Champions from 2021. Limited to 1 per country.
                    </p>
                  </div>
                )}
                {regType === "judge" && (
                  <div className="mb-6 p-4 rounded-lg bg-cinnamon-950/30 border border-cinnamon-800/50">
                    <p className="text-sm text-cinnamon-300">
                      <strong>Eligibility:</strong> Barista Champions (top 6),
                      Cup Tasters Champions, Q Graders, or WCC Sensory
                      Certification. No prior judging required — we train you.
                    </p>
                  </div>
                )}
                {regType === "volunteer" && (
                  <div className="mb-6 p-4 rounded-lg bg-cinnamon-950/30 border border-cinnamon-800/50">
                    <p className="text-sm text-cinnamon-300">
                      <strong>Open for anyone.</strong> Previous experience
                      preferred but not required. Roles include stage
                      management, competitor liaison, registration, social
                      media, and photography.
                    </p>
                  </div>
                )}

                <form onSubmit={handleRegSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input name="fullName" required placeholder="Full Name *" className="wec-input w-full px-4 py-3 rounded-lg text-sm" />
                    <input name="email" type="email" required placeholder="Email *" className="wec-input w-full px-4 py-3 rounded-lg text-sm" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <input name="country" required placeholder="Country *" className="wec-input w-full px-4 py-3 rounded-lg text-sm" />
                    <input name="phone" placeholder="Phone" className="wec-input w-full px-4 py-3 rounded-lg text-sm" />
                  </div>
                  <input name="employer" placeholder="Current Employer / Cafe" className="wec-input w-full px-4 py-3 rounded-lg text-sm" />
                  {regType === "competitor" && (
                    <>
                      <input name="qualificationMethod" placeholder="Qualification method (national champion / qualifier winner / wildcard)" className="wec-input w-full px-4 py-3 rounded-lg text-sm" />
                      <textarea name="experience" placeholder="Professional experience (years as barista)" className="wec-input w-full px-4 py-3 rounded-lg text-sm resize-none" rows={2} />
                    </>
                  )}
                  {regType === "judge" && (
                    <>
                      <input name="professionalBackground" placeholder="Professional background (barista, roaster, Q-grader, researcher)" className="wec-input w-full px-4 py-3 rounded-lg text-sm" />
                      <textarea name="sensoryExperience" placeholder="Sensory experience (years, qualifications)" className="wec-input w-full px-4 py-3 rounded-lg text-sm resize-none" rows={2} />
                      <textarea name="conflictOfInterest" placeholder="Conflict of interest declaration" className="wec-input w-full px-4 py-3 rounded-lg text-sm resize-none" rows={2} />
                    </>
                  )}
                  {regType === "volunteer" && (
                    <>
                      <input name="rolePreference" placeholder="Role preference" className="wec-input w-full px-4 py-3 rounded-lg text-sm" />
                      <textarea name="skills" placeholder="Skills and experience" className="wec-input w-full px-4 py-3 rounded-lg text-sm resize-none" rows={2} />
                    </>
                  )}
                  <textarea name="availability" placeholder="Availability for competition dates" className="wec-input w-full px-4 py-3 rounded-lg text-sm resize-none" rows={2} />
                  <input name="languages" placeholder="Languages spoken" className="wec-input w-full px-4 py-3 rounded-lg text-sm" />
                  <input name="socialMedia" placeholder="Social media handles (Instagram, LinkedIn)" className="wec-input w-full px-4 py-3 rounded-lg text-sm" />
                  <input name="emergencyContact" placeholder="Emergency contact" className="wec-input w-full px-4 py-3 rounded-lg text-sm" />
                  <input name="dietaryRequirements" placeholder="Dietary requirements / accessibility needs" className="wec-input w-full px-4 py-3 rounded-lg text-sm" />
                  <label className="flex items-center gap-3">
                    <input name="agreedToRules" type="checkbox" className="w-4 h-4 rounded border-[#3a2a1f] bg-[#1a1410] text-cinnamon-600" />
                    <span className="text-sm text-sand-400">
                      I agree to the competition rules and code of conduct
                    </span>
                  </label>
                  <Button
                    type="submit"
                    className="w-full bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100"
                    disabled={createRegistration.isPending}
                  >
                    {createRegistration.isPending
                      ? "Submitting..."
                      : `Register as ${regType.charAt(0).toUpperCase() + regType.slice(1)}`}
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

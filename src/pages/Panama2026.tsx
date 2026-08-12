import { useEffect, useId, useState } from "react";
import { Link } from "react-router";
import Seo from "@/components/Seo";
import ChampionsProductModule from "@/components/ChampionsProductModule";
import SoftwareShowcase from "@/components/SoftwareShowcase";
import { Button } from "@/components/ui/button";
import { formDataToRecord, submitNetlifyForm } from "@/lib/netlifyForm";
import { WEC_FACTS, SITE_URL } from "@/data/wecFacts";
import { toast } from "sonner";
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  Star,
  Coffee,
  Handshake,
  ArrowRight,
  Check,
  Globe,
  Award,
} from "lucide-react";

type RegType = "competitor" | "judge" | "volunteer";
type Panel = "competitors" | "sponsors" | "register";

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(() => {
    el.focus({ preventScroll: true });
  }, 400);
}

export default function Panama2026() {
  const formId = useId();
  const [regType, setRegType] = useState<RegType>("competitor");
  const [panel, setPanel] = useState<Panel>("competitors");
  const [regSubmitting, setRegSubmitting] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [sponsorSubmitting, setSponsorSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash === "sponsors") {
      setPanel("sponsors");
      requestAnimationFrame(() => scrollToId("sponsors"));
    } else if (hash === "competitor-registration" || hash === "register") {
      setPanel("register");
      setRegType("competitor");
      requestAnimationFrame(() => scrollToId("competitor-registration"));
    }
  }, []);

  const handleRegSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    if (formData.get("bot-field")) return;
    if (formData.get("privacyConsent") !== "on" || formData.get("agreedToRules") !== "on") {
      setStatusMsg("Please accept the rules and privacy notices to continue.");
      toast.error("Please accept the rules and privacy notices.");
      return;
    }
    setRegSubmitting(true);
    setStatusMsg("Submitting…");
    setRegSuccess(false);
    try {
      await submitNetlifyForm("wec-registration", {
        ...formDataToRecord(formData),
        type: regType,
        agreedToRules: "yes",
        privacyConsent: "yes",
      });
      setRegSuccess(true);
      setStatusMsg("Registration received. We will review and contact you by email.");
      toast.success("Registration submitted.");
      form.reset();
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : `Submission failed. Email ${WEC_FACTS.organisation.founderEmail}`;
      setStatusMsg(msg);
      toast.error(msg);
    } finally {
      setRegSubmitting(false);
    }
  };

  const handleSponsorSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setSponsorSubmitting(true);
    try {
      await submitNetlifyForm("wec-sponsor", formDataToRecord(formData));
      toast.success("Sponsorship enquiry submitted.");
      form.reset();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Submission failed");
    } finally {
      setSponsorSubmitting(false);
    }
  };

  const packages = WEC_FACTS.sponsorship.packages;
  const ev = WEC_FACTS.event2026;

  return (
    <div>
      <Seo
        title="WEC 2026 Panama | World Espresso Championship"
        description={`Register for WEC 2026 at Café Unido, Panama City on ${ev.dateDisplay}. Blind espresso championship with public scoring.`}
        path="/panama-2026"
        image={`${SITE_URL}/assets/og/panama-2026.jpg`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Event",
          name: ev.name,
          startDate: ev.dateISO,
          eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
          eventStatus: "https://schema.org/EventScheduled",
          location: {
            "@type": "Place",
            name: ev.venue,
            address: ev.addressDisplay,
          },
          organizer: {
            "@type": "Organization",
            name: WEC_FACTS.organisation.legalName,
            url: SITE_URL,
          },
          description: `${ev.independentEraNote} Registration: ${SITE_URL}${ev.registrationPath}`,
          url: `${SITE_URL}/panama-2026`,
        }}
      />

      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/assets/event-36.jpg"
            alt="Café Unido, Panama City — host venue for WEC 2026"
            className="w-full h-full object-cover opacity-20"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a1410]/80 via-[#1a1410]/90 to-[#1a1410]" />
        </div>
        <div className="wec-container relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30">
                <Star className="w-4 h-4 text-gold" aria-hidden />
                <span className="text-sm text-gold font-medium">
                  Café Unido · Venue &amp; Roaster Sponsor
                </span>
              </div>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-sand-100 mb-6">
              WEC 2026 <span className="wec-gradient-text">Panama</span>
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-6 mb-8 text-sand-400">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cinnamon-400" aria-hidden />
                <span>{ev.dateDisplay}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cinnamon-400" aria-hidden />
                <span>{ev.addressDisplay}</span>
              </div>
            </div>
            <p className="text-lg sm:text-xl text-sand-400 max-w-2xl mx-auto mb-6">
              Café Unido hosts WEC 2026 and is the roaster sponsor. Same coffee. Same machine.
              Blind sensory judging under {WEC_FACTS.scoring.version}. {ev.independentEraNote}
            </p>
            <p className="text-sm text-cinnamon-300 mb-10" role="status">
              Registration is open · {ev.confirmedCompetitors} / {ev.fieldSize} competitors confirmed
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100 px-8 wec-glow min-h-11"
                onClick={() => {
                  setPanel("register");
                  setRegType("competitor");
                  scrollToId("competitor-registration");
                }}
              >
                <Trophy className="mr-2 w-5 h-5" aria-hidden />
                Register
              </Button>
              <Link
                to={ev.livePath}
                className="inline-flex items-center justify-center min-h-11 px-8 rounded-md border border-sand-400/30 text-sand-200 hover:bg-sand-400/10"
              >
                Live Bracket
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-sand-400/30 text-sand-200 hover:bg-sand-400/10 px-8 min-h-11"
                onClick={() => {
                  setPanel("sponsors");
                  scrollToId("sponsors");
                }}
              >
                <Handshake className="mr-2 w-5 h-5" aria-hidden />
                Become a Sponsor
              </Button>
            </div>
          </div>
        </div>
      </section>

      <SoftwareShowcase className="bg-[#140f0b]" />

      <section className="wec-section">
        <div className="wec-container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { icon: Users, label: "Planned field", value: String(ev.fieldSize) },
              { icon: Trophy, label: "Title", value: "World Champion" },
              { icon: Coffee, label: "Champion's Product", value: "Ambition" },
              { icon: Globe, label: "Format", value: "Blind heats" },
            ].map((stat) => (
              <div key={stat.label} className="wec-card rounded-xl p-6 text-center">
                <stat.icon className="w-8 h-8 text-cinnamon-400 mx-auto mb-3" aria-hidden />
                <div className="text-2xl sm:text-3xl font-bold text-sand-100">{stat.value}</div>
                <div className="text-sm text-sand-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wec-section bg-[#140f0b]">
        <div className="wec-container">
          <div
            role="tablist"
            aria-label="Panama 2026 audiences"
            className="flex flex-wrap justify-center gap-2 mb-12"
          >
            {(
              [
                { id: "competitors" as const, label: "For Competitors", icon: Trophy },
                { id: "sponsors" as const, label: "For Sponsors", icon: Handshake },
                { id: "register" as const, label: "Register", icon: ArrowRight },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={panel === tab.id}
                aria-controls={`panel-${tab.id}`}
                tabIndex={panel === tab.id ? 0 : -1}
                onClick={() => setPanel(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium min-h-11 transition-all ${
                  panel === tab.id
                    ? "bg-cinnamon-600 text-sand-100"
                    : "bg-[#231a14] text-sand-400 hover:text-sand-200 border border-[#3a2a1f]"
                }`}
              >
                <tab.icon className="w-4 h-4" aria-hidden />
                {tab.label}
              </button>
            ))}
          </div>

          {panel === "competitors" && (
            <div
              role="tabpanel"
              id="panel-competitors"
              aria-labelledby="tab-competitors"
              className="grid lg:grid-cols-2 gap-12 items-center"
            >
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-sand-100 mb-6">
                  Why competitors register
                </h2>
                <p className="text-sand-400 leading-relaxed mb-6">
                  {ev.independentEraNote} Same coffee. Same machine. Blind cups. Results published
                  on a public live bracket.
                </p>
                <ul className="space-y-3 text-sand-300 text-sm mb-8">
                  <li className="flex gap-2">
                    <Check className="w-4 h-4 text-cinnamon-400 mt-0.5" aria-hidden />
                    World Espresso Champion title and trophy
                  </li>
                  <li className="flex gap-2">
                    <Check className="w-4 h-4 text-cinnamon-400 mt-0.5" aria-hidden />
                    Public Scoring v3 results
                  </li>
                  <li className="flex gap-2">
                    <Check className="w-4 h-4 text-cinnamon-400 mt-0.5" aria-hidden />
                    Champion&apos;s Product only if responsibly agreed — see transparency model
                  </li>
                </ul>
                <Button
                  className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100 min-h-11"
                  onClick={() => {
                    setPanel("register");
                    scrollToId("competitor-registration");
                  }}
                >
                  Register
                </Button>
              </div>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#3a2a1f]">
                <img
                  src="/assets/event-25.jpg"
                  alt="Competitors preparing espresso at a WEC heat"
                  className="w-full h-full object-cover"
                  width={1200}
                  height={900}
                />
              </div>
            </div>
          )}

          {panel === "sponsors" && (
            <div role="tabpanel" id="panel-sponsors" aria-labelledby="tab-sponsors">
              <div
                id="sponsors"
                tabIndex={-1}
                className="text-center mb-10 scroll-mt-36 outline-none"
              >
                <h2 className="text-3xl sm:text-4xl font-bold text-sand-100 mb-4">
                  {WEC_FACTS.sponsorship.heading}
                </h2>
                <p className="text-sand-400 max-w-3xl mx-auto mb-4">
                  {WEC_FACTS.sponsorship.intro}
                </p>
                <p className="text-sm text-sand-500 max-w-2xl mx-auto">
                  {WEC_FACTS.sponsorship.independencePrinciple}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {packages.map((tier) => (
                  <div
                    key={tier.id}
                    className={`wec-card rounded-xl p-6 flex flex-col ${
                      tier.highlighted ? "border-gold/50 ring-1 ring-gold/20" : ""
                    }`}
                  >
                    <h3 className="text-lg font-bold text-sand-100 mb-1">{tier.name}</h3>
                    <div className="text-xl font-bold text-gold mb-1">{tier.price}</div>
                    <p className="text-xs text-sand-500 mb-3">Status: {tier.availability}</p>
                    <p className="text-sm text-sand-500 mb-3 flex-1">{tier.description}</p>
                    <p className="text-xs text-sand-400 mb-2">
                      <span className="text-sand-300">Funds:</span> {tier.funds}
                    </p>
                    <ul className="space-y-2 mb-4">
                      {tier.deliverables.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-sand-400">
                          <Check className="w-4 h-4 text-cinnamon-400 mt-0.5 flex-shrink-0" aria-hidden />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-sand-500 mb-4">After the event: {tier.reportedAfter}</p>
                  </div>
                ))}
              </div>

              <div className="wec-card rounded-xl p-8">
                <h3 className="text-xl font-semibold text-sand-100 mb-4">Sponsorship enquiry</h3>
                <form onSubmit={handleSponsorSubmit} className="grid sm:grid-cols-2 gap-4" noValidate>
                  <p className="hidden" aria-hidden>
                    <label>
                      Don&apos;t fill this out
                      <input name="bot-field" tabIndex={-1} autoComplete="off" />
                    </label>
                  </p>
                  <div>
                    <label htmlFor={`${formId}-co`} className="block text-sm text-sand-300 mb-1">
                      Company name *
                    </label>
                    <input
                      id={`${formId}-co`}
                      name="companyName"
                      required
                      className="wec-input w-full px-4 py-3 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor={`${formId}-cn`} className="block text-sm text-sand-300 mb-1">
                      Contact name *
                    </label>
                    <input
                      id={`${formId}-cn`}
                      name="contactName"
                      required
                      autoComplete="name"
                      className="wec-input w-full px-4 py-3 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor={`${formId}-em`} className="block text-sm text-sand-300 mb-1">
                      Email *
                    </label>
                    <input
                      id={`${formId}-em`}
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      className="wec-input w-full px-4 py-3 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label htmlFor={`${formId}-tier`} className="block text-sm text-sand-300 mb-1">
                      Package of interest
                    </label>
                    <select
                      id={`${formId}-tier`}
                      name="tier"
                      className="wec-input w-full px-4 py-3 rounded-lg text-sm"
                      defaultValue=""
                    >
                      <option value="">Select package</option>
                      {packages.map((p) => (
                        <option key={p.id} value={p.formTier}>
                          {p.name} ({p.price})
                        </option>
                      ))}
                      <option value="custom">In-kind / trade</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label htmlFor={`${formId}-msg`} className="block text-sm text-sand-300 mb-1">
                      Message
                    </label>
                    <textarea
                      id={`${formId}-msg`}
                      name="message"
                      rows={3}
                      className="wec-input w-full px-4 py-3 rounded-lg text-sm resize-none"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100 sm:col-span-2 min-h-11"
                    disabled={sponsorSubmitting}
                  >
                    {sponsorSubmitting ? "Submitting…" : "Submit enquiry"}
                  </Button>
                </form>
              </div>
            </div>
          )}

          {panel === "register" && (
            <div role="tabpanel" id="panel-register" aria-labelledby="tab-register">
              <div
                id="competitor-registration"
                tabIndex={-1}
                className="max-w-2xl mx-auto scroll-mt-36 outline-none"
              >
                <div className="text-center mb-8">
                  <h2 className="text-3xl sm:text-4xl font-bold text-sand-100 mb-3">
                    Registration
                  </h2>
                  <p className="text-cinnamon-300 text-sm font-medium mb-2" role="status">
                    Registration is open
                  </p>
                  <p className="text-sand-400 text-sm">
                    Choose your role. After submission we review eligibility and contact you by
                    email. No registration deadline is published yet.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mb-8">
                  {(
                    [
                      { id: "competitor" as const, label: "Competitor", icon: Trophy },
                      { id: "judge" as const, label: "Judge", icon: Award },
                      { id: "volunteer" as const, label: "Volunteer", icon: Users },
                    ] as const
                  ).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setRegType(t.id);
                        setRegSuccess(false);
                      }}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium min-h-11 ${
                        regType === t.id
                          ? "bg-cinnamon-600 text-sand-100"
                          : "bg-[#231a14] text-sand-400 border border-[#3a2a1f]"
                      }`}
                    >
                      <t.icon className="w-4 h-4" aria-hidden />
                      {t.label}
                    </button>
                  ))}
                </div>

                <div className="wec-card rounded-xl p-6 sm:p-8">
                  <div className="mb-6 p-4 rounded-lg bg-cinnamon-950/30 border border-cinnamon-800/50">
                    <p className="text-sm text-cinnamon-300">
                      <strong>Eligibility:</strong>{" "}
                      {regType === "competitor"
                        ? WEC_FACTS.eligibility.competitor
                        : regType === "judge"
                          ? WEC_FACTS.eligibility.judge
                          : WEC_FACTS.eligibility.volunteer}
                    </p>
                  </div>

                  {regSuccess && (
                    <div
                      className="mb-4 p-4 rounded-lg bg-green-950/40 border border-green-800/50 text-sm text-green-200"
                      role="status"
                    >
                      Registration received. Check your email for follow-up from the WEC team.
                    </div>
                  )}

                  <form onSubmit={handleRegSubmit} className="space-y-4" noValidate>
                    <p className="hidden" aria-hidden>
                      <label>
                        Don&apos;t fill this out
                        <input name="bot-field" tabIndex={-1} autoComplete="off" />
                      </label>
                    </p>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor={`${formId}-name`} className="block text-sm text-sand-300 mb-1">
                          Full name *
                        </label>
                        <input
                          id={`${formId}-name`}
                          name="fullName"
                          required
                          autoComplete="name"
                          className="wec-input w-full px-4 py-3 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor={`${formId}-email`} className="block text-sm text-sand-300 mb-1">
                          Email *
                        </label>
                        <input
                          id={`${formId}-email`}
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          className="wec-input w-full px-4 py-3 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor={`${formId}-country`} className="block text-sm text-sand-300 mb-1">
                        Country / territory represented *
                      </label>
                      <input
                        id={`${formId}-country`}
                        name="country"
                        required
                        autoComplete="country-name"
                        className="wec-input w-full px-4 py-3 rounded-lg text-sm"
                      />
                    </div>
                    {regType === "competitor" && (
                      <>
                        <div>
                          <label
                            htmlFor={`${formId}-qual`}
                            className="block text-sm text-sand-300 mb-1"
                          >
                            National title or qualifying event *
                          </label>
                          <input
                            id={`${formId}-qual`}
                            name="qualificationMethod"
                            required
                            className="wec-input w-full px-4 py-3 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor={`${formId}-year`}
                            className="block text-sm text-sand-300 mb-1"
                          >
                            Year of title *
                          </label>
                          <input
                            id={`${formId}-year`}
                            name="titleYear"
                            required
                            inputMode="numeric"
                            className="wec-input w-full px-4 py-3 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor={`${formId}-org`}
                            className="block text-sm text-sand-300 mb-1"
                          >
                            Organiser / verification contact (optional)
                          </label>
                          <input
                            id={`${formId}-org`}
                            name="employer"
                            className="wec-input w-full px-4 py-3 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor={`${formId}-social`}
                            className="block text-sm text-sand-300 mb-1"
                          >
                            Public profile links (optional)
                          </label>
                          <input
                            id={`${formId}-social`}
                            name="socialMedia"
                            className="wec-input w-full px-4 py-3 rounded-lg text-sm"
                          />
                        </div>
                      </>
                    )}
                    {regType === "judge" && (
                      <div>
                        <label
                          htmlFor={`${formId}-bg`}
                          className="block text-sm text-sand-300 mb-1"
                        >
                          Professional / sensory background
                        </label>
                        <textarea
                          id={`${formId}-bg`}
                          name="professionalBackground"
                          rows={3}
                          className="wec-input w-full px-4 py-3 rounded-lg text-sm resize-none"
                        />
                      </div>
                    )}
                    {regType === "volunteer" && (
                      <div>
                        <label
                          htmlFor={`${formId}-role`}
                          className="block text-sm text-sand-300 mb-1"
                        >
                          Role preference
                        </label>
                        <input
                          id={`${formId}-role`}
                          name="rolePreference"
                          className="wec-input w-full px-4 py-3 rounded-lg text-sm"
                        />
                      </div>
                    )}

                    <label className="flex items-start gap-3 text-sm text-sand-400">
                      <input
                        name="agreedToRules"
                        type="checkbox"
                        className="mt-1 w-4 h-4 rounded border-[#3a2a1f]"
                        required
                      />
                      <span>
                        I agree to the{" "}
                        <Link to="/rules-and-integrity" className="text-cinnamon-400">
                          competition rules and code of conduct
                        </Link>{" "}
                        as published.
                      </span>
                    </label>
                    <label className="flex items-start gap-3 text-sm text-sand-400">
                      <input
                        name="privacyConsent"
                        type="checkbox"
                        className="mt-1 w-4 h-4 rounded border-[#3a2a1f]"
                        required
                      />
                      <span>
                        I consent to WEC processing this information as described in the{" "}
                        <Link to="/privacy" className="text-cinnamon-400">
                          Privacy Policy
                        </Link>
                        .
                      </span>
                    </label>

                    <div aria-live="polite" className="text-sm text-sand-500 min-h-5">
                      {statusMsg}
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100 min-h-11"
                      disabled={regSubmitting || !WEC_FACTS.features.registrationOpen}
                    >
                      {regSubmitting
                        ? "Submitting…"
                        : `Register as ${regType.charAt(0).toUpperCase()}${regType.slice(1)}`}
                    </Button>
                    <p className="text-xs text-sand-500 text-center">
                      If submission fails, email{" "}
                      <a
                        href={WEC_FACTS.organisation.founderMailto}
                        className="text-cinnamon-400"
                      >
                        {WEC_FACTS.organisation.founderEmail}
                      </a>
                      .
                    </p>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <ChampionsProductModule className="bg-[#1a1410]" />
    </div>
  );
}

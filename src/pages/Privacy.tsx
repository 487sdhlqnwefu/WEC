import Seo from "@/components/Seo";
import { LEGAL_IDENTITY } from "@/data/legalIdentity";
import { Link } from "react-router";

export default function Privacy() {
  const email = LEGAL_IDENTITY.privacyContactEmail;
  const processors = LEGAL_IDENTITY.processors;

  return (
    <div>
      <Seo
        title="Privacy & Data Use | World Espresso Championship"
        description="How the World Espresso Championship collects and uses information from registration and contact forms."
        path="/privacy"
        image="https://worldespressochampionship.com/assets/og/home.jpg"
      />
      <section className="wec-section">
        <div className="wec-container max-w-3xl">
          <h1 className="text-4xl font-bold text-sand-100 mb-4">Privacy &amp; Data Use</h1>
          <p className="text-sand-500 text-sm mb-8">
            Last updated: {LEGAL_IDENTITY.lastUpdated}
          </p>

          <div className="space-y-6 text-sand-400 leading-relaxed text-sm sm:text-base">
            <p>{LEGAL_IDENTITY.identityStatement}</p>
            <p>
              This page explains how personal information submitted through
              worldespressochampionship.com is handled. It is written in plain language and
              describes actual current practices — not legal advice.
            </p>

            <h2 className="text-xl font-semibold text-sand-100">Who receives your message</h2>
            <p>
              Online form submissions are reviewed by the WEC founder,{" "}
              {LEGAL_IDENTITY.founderName}. Contact for privacy requests:{" "}
              <a className="text-cinnamon-400" href={`mailto:${email}`}>
                {email}
              </a>
              .
            </p>

            <h2 className="text-xl font-semibold text-sand-100">What we collect</h2>
            <p>Only information needed to verify and contact people who want to take part or get in touch:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-sand-200">Competitor registration:</strong> full name, email,
                country/territory represented, national title or qualifying event, year of title,
                optional public profile links, agreement to eligibility/rules, privacy consent.
              </li>
              <li>
                <strong className="text-sand-200">Judge / volunteer registration:</strong> name,
                email, country, role-relevant experience, availability.
              </li>
              <li>
                <strong className="text-sand-200">Sponsor enquiry:</strong> company, contact name,
                email, optional phone, package of interest, message.
              </li>
              <li>
                <strong className="text-sand-200">Contact form:</strong> name, email, subject,
                message, optional company or phone.
              </li>
            </ul>
            <p>
              Initial registration does <strong className="text-sand-200">not</strong> collect
              passports, identity documents, travel details, home addresses, dietary information or
              other unnecessary sensitive data.
            </p>

            <h2 className="text-xl font-semibold text-sand-100">Why we collect it</h2>
            <p>
              To review eligibility, organise WEC 2026, respond to enquiries, and communicate about
              the championship. Where a form asks for consent, that consent is how we use the
              submission. We collect only what is needed for those purposes.
            </p>

            <h2 className="text-xl font-semibold text-sand-100">Who can access it</h2>
            <p>
              Submissions are accessible to {LEGAL_IDENTITY.founderName} and any people Tristan
              specifically asks to help organise the event (for example reviewing competitor
              eligibility). They are not sold and are not shared as a public mailing list.
            </p>

            <h2 className="text-xl font-semibold text-sand-100">Who processes or stores it</h2>
            <ul className="list-disc pl-5 space-y-2">
              {processors.map((p) => (
                <li key={p.name}>
                  <strong className="text-sand-200">{p.name}:</strong> {p.role}
                </li>
              ))}
            </ul>
            <p>
              Email notifications from those forms may be delivered to {email}. WEC does not sell
              personal information.
            </p>

            <h2 className="text-xl font-semibold text-sand-100">How long we keep it</h2>
            <p>{LEGAL_IDENTITY.retentionPractice}</p>

            <h2 className="text-xl font-semibold text-sand-100">
              Access, correction or deletion
            </h2>
            <p>
              Email{" "}
              <a className="text-cinnamon-400" href={`mailto:${email}`}>
                {email}
              </a>{" "}
              to ask what information WEC holds about you, to correct it, or to ask for it to be
              deleted. Please use the same email address you used on the form so the right record
              can be found.
            </p>

            <h2 className="text-xl font-semibold text-sand-100">
              Photography, video and research responses
            </h2>
            <p>
              Event photography and video are used to document the championship and communicate
              about WEC. Where specific consent is required for identifiable use, that will be
              handled with participants around the event — not hidden in this website notice.
            </p>
            <p>
              Innovation Lab or research responses that could reveal a competitor&apos;s private
              recipe or strategy during an active tournament window are not published in a way that
              disadvantages later-round opponents. Aggregated or post-event learning may be shared
              when it is fair and agreed.
            </p>

            <h2 className="text-xl font-semibold text-sand-100">Analytics and cookies</h2>
            <p>
              As of this update, the marketing site does not load a separate third-party analytics
              product beyond what the hosting platform may use to operate the site. If that changes,
              this page will be updated before activation.
            </p>

            <p>
              Competition rules are separate. See{" "}
              <Link className="text-cinnamon-400" to="/rules-and-integrity">
                Rules &amp; Integrity
              </Link>{" "}
              and{" "}
              <Link className="text-cinnamon-400" to="/terms">
                Website &amp; Participation Terms
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

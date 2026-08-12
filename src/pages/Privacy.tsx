import Seo from "@/components/Seo";
import { WEC_FACTS } from "@/data/wecFacts";
import { Link } from "react-router";

export default function Privacy() {
  const email = WEC_FACTS.organisation.founderEmail;
  return (
    <div>
      <Seo
        title="Privacy Policy | World Espresso Championship"
        description="How the World Espresso Championship collects and uses personal data from registration, contact and sponsorship forms."
        path="/privacy"
      />
      <section className="wec-section">
        <div className="wec-container max-w-3xl prose-invert">
          <h1 className="text-4xl font-bold text-sand-100 mb-6">Privacy Policy</h1>
          <p className="text-sand-500 text-sm mb-8">Last updated: 12 August 2026</p>

          <div className="space-y-6 text-sand-400 leading-relaxed text-sm sm:text-base">
            <p>
              This policy describes how the World Espresso Championship (WEC) handles personal
              information submitted through worldespressochampionship.com.
            </p>

            <h2 className="text-xl font-semibold text-sand-100">Who controls the data</h2>
            <p>
              Controllers: Tristan Creswick / World Espresso Championship. Contact:{" "}
              <a className="text-cinnamon-400" href={`mailto:${email}`}>
                {email}
              </a>
              .
            </p>

            <h2 className="text-xl font-semibold text-sand-100">What we collect</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-sand-200">Competitor registration:</strong> name, email,
                country/territory, qualifying title/event, year of title, optional public profile
                links, rules acknowledgement, privacy consent.
              </li>
              <li>
                <strong className="text-sand-200">Judge / volunteer registration:</strong> name,
                email, country, role-relevant experience fields, availability.
              </li>
              <li>
                <strong className="text-sand-200">Sponsor enquiry:</strong> company, contact name,
                email, phone (optional), package of interest, message.
              </li>
              <li>
                <strong className="text-sand-200">Contact form:</strong> name, email, subject,
                message, optional company/phone.
              </li>
              <li>
                <strong className="text-sand-200">National organiser applications:</strong> contact
                and event-planning information you choose to submit.
              </li>
            </ul>

            <h2 className="text-xl font-semibold text-sand-100">Purpose and legal basis</h2>
            <p>
              We process submissions to review eligibility, organise WEC 2026, respond to enquiries,
              and communicate about the championship. Where consent is requested on a form, that
              consent is the basis for processing. Otherwise processing is based on legitimate
              interests in running the event and responding to business enquiries.
            </p>

            <h2 className="text-xl font-semibold text-sand-100">Processors</h2>
            <p>
              Form submissions on the current production marketing site are handled by{" "}
              <strong className="text-sand-200">Netlify Forms</strong> (Netlify, Inc.). Hosting is
              provided by Netlify. Email notifications may be sent to {email}. We do not sell
              personal data.
            </p>

            <h2 className="text-xl font-semibold text-sand-100">Retention</h2>
            <p>
              Registration and enquiry records are retained for the planning and delivery of WEC
              2026 and a reasonable period afterward for audit and follow-up, then deleted or
              anonymised unless a longer retention is required by law or an ongoing agreement.
            </p>

            <h2 className="text-xl font-semibold text-sand-100">Photos, video and research</h2>
            <p>
              Event photography and Innovation Lab research data (if collected) will be handled
              under separate participant notices and consent at the event. This website privacy
              notice covers online form submissions only.
            </p>

            <h2 className="text-xl font-semibold text-sand-100">Analytics and cookies</h2>
            <p>
              As of this update, the marketing site does not load a third-party analytics script
              beyond what Netlify may provide at the infrastructure level. If analytics are added,
              this page will be updated before activation.
            </p>

            <h2 className="text-xl font-semibold text-sand-100">Your rights</h2>
            <p>
              You may request access, correction or deletion of your personal data by emailing{" "}
              <a className="text-cinnamon-400" href={`mailto:${email}`}>
                {email}
              </a>
              .
            </p>

            <p>
              Competition rules are separate from this privacy notice. See{" "}
              <Link className="text-cinnamon-400" to="/rules-and-integrity">
                Rules &amp; Integrity
              </Link>{" "}
              and{" "}
              <Link className="text-cinnamon-400" to="/terms">
                Terms of Use
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

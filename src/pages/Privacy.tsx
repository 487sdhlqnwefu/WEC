import LegalDocument from "@/components/LegalDocument";
import { SITE } from "@/config/site";

export default function Privacy() {
  return (
    <LegalDocument
      kind="privacy"
      title="Privacy Policy"
      lead="How the World Espresso Championship processes personal data collected through this website and related services."
    >
      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-sand-100">
          What we collect
        </h2>
        <p>
          We may collect identity and contact details you submit (such as name,
          email, phone, country, and organisation), registration and sponsorship
          form contents, store order details needed to fulfil purchases, and
          technical data such as IP address and basic device information when
          you use the site.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-sand-100">
          Why we process data
        </h2>
        <p>
          We process personal data to operate the championship (registrations,
          judging logistics, volunteering), respond to enquiries, fulfil store
          orders, improve the site, meet legal obligations, and — where you
          opt in — send updates about WEC events.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-sand-100">
          Processors & transfers
        </h2>
        <p>
          We use service providers for hosting, email delivery, authentication,
          and payment processing. Where data is transferred internationally, we
          rely on appropriate safeguards required by applicable law.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-sand-100">Your rights</h2>
        <p>
          Depending on your location, you may have rights to access, correct,
          delete, or restrict processing of your personal data, and to lodge a
          complaint with a supervisory authority. Contact the privacy email
          listed under Controller to exercise these rights.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-sand-100">Retention</h2>
        <p>
          We retain personal data only as long as needed for the purposes above,
          including championship records and legal compliance, then delete or
          anonymise it.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-sand-100">Contact</h2>
        <p>
          General site enquiries:{" "}
          <a
            href={`mailto:${SITE.contactEmail}`}
            className="text-cinnamon-400 hover:text-cinnamon-300"
          >
            {SITE.contactEmail}
          </a>
          . Privacy-specific requests use the privacy contact under Controller.
        </p>
      </section>
    </LegalDocument>
  );
}

import LegalDocument from "@/components/LegalDocument";
import { SITE } from "@/config/site";

export default function Terms() {
  return (
    <LegalDocument
      kind="terms"
      title="Terms of Service"
      lead="Terms that govern use of the World Espresso Championship website and related online services."
    >
      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-sand-100">Acceptance</h2>
        <p>
          By accessing {SITE.name} websites and tools, you agree to these Terms.
          If you do not agree, do not use the services.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-sand-100">
          Use of the site
        </h2>
        <p>
          You may use the site for lawful purposes related to learning about
          WEC, registering interest, purchasing offered products, and using
          published tools. You must not attempt to disrupt the service, scrape
          in abusive volume, or submit false registration information.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-sand-100">
          Registrations & events
        </h2>
        <p>
          Submitting a registration or enquiry does not guarantee acceptance.
          Event rules, eligibility, and schedules may change; official
          communications from WEC control in case of conflict with website copy.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-sand-100">Store & payments</h2>
        <p>
          Product availability, pricing, and fulfilment terms are presented at
          checkout. Payment processing is handled by our payment provider;
          chargebacks and refunds follow the policies stated at purchase time.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-sand-100">
          Intellectual property
        </h2>
        <p>
          WEC names, logos, competition formats, and site content are protected.
          You may not use them for commercial purposes without prior written
          permission, except for fair editorial reporting with accurate
          attribution.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-sand-100">Liability</h2>
        <p>
          The site and tools are provided on an “as is” basis to the fullest
          extent permitted by law. Nothing in these Terms excludes liability that
          cannot be excluded under applicable law.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-sand-100">Contact</h2>
        <p>
          Questions about these Terms:{" "}
          <a
            href={`mailto:${SITE.contactEmail}`}
            className="text-cinnamon-400 hover:text-cinnamon-300"
          >
            {SITE.contactEmail}
          </a>
          .
        </p>
      </section>
    </LegalDocument>
  );
}

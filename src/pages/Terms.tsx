import Seo from "@/components/Seo";
import { Link } from "react-router";

export default function Terms() {
  return (
    <div>
      <Seo
        title="Terms of Use | World Espresso Championship"
        description="Website terms for worldespressochampionship.com. Competition rules are published separately."
        path="/terms"
      />
      <section className="wec-section">
        <div className="wec-container max-w-3xl">
          <h1 className="text-4xl font-bold text-sand-100 mb-6">Terms of Use</h1>
          <p className="text-sand-500 text-sm mb-8">Last updated: 12 August 2026</p>

          <div className="space-y-6 text-sand-400 leading-relaxed text-sm sm:text-base">
            <p>
              These terms govern use of the World Espresso Championship (WEC) website at
              worldespressochampionship.com. By using the site you agree to these terms.
            </p>

            <h2 className="text-xl font-semibold text-sand-100">Website vs competition rules</h2>
            <p>
              These website terms are not the competition rulebook. Event eligibility, scoring,
              appeals and integrity rules are published at{" "}
              <Link className="text-cinnamon-400" to="/rules-and-integrity">
                /rules-and-integrity
              </Link>
              . Where an item is marked “To be published before competition,” it is not yet final.
            </p>

            <h2 className="text-xl font-semibold text-sand-100">Submissions</h2>
            <p>
              Registration and enquiry forms must contain accurate information. Submitting a form
              does not guarantee acceptance into the field, a partnership, or a response timeline
              beyond what we can reasonably deliver.
            </p>

            <h2 className="text-xl font-semibold text-sand-100">Content</h2>
            <p>
              Site content is provided for information about WEC. Logos, photography and software
              visuals remain owned by their respective rights holders. Do not scrape or republish
              competitor personal data from submissions you do not control.
            </p>

            <h2 className="text-xl font-semibold text-sand-100">Liability</h2>
            <p>
              The website is provided as-is. WEC is not liable for indirect losses arising from use
              of the site. Nothing in these terms excludes liability that cannot be excluded by law.
            </p>

            <h2 className="text-xl font-semibold text-sand-100">Contact</h2>
            <p>
              Questions:{" "}
              <Link className="text-cinnamon-400" to="/contact">
                Contact
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

import Seo from "@/components/Seo";
import { LEGAL_IDENTITY } from "@/data/legalIdentity";
import { Link } from "react-router";

export default function Terms() {
  const email = LEGAL_IDENTITY.generalContactEmail;

  return (
    <div>
      <Seo
        title="Website & Participation Terms | World Espresso Championship"
        description="Website and participation terms for the World Espresso Championship. Competition rules are published separately."
        path="/terms"
        image="https://worldespressochampionship.com/assets/og/home.jpg"
      />
      <section className="wec-section">
        <div className="wec-container max-w-3xl">
          <h1 className="text-4xl font-bold text-sand-100 mb-4">
            Website &amp; Participation Terms
          </h1>
          <p className="text-sand-500 text-sm mb-8">
            Last updated: {LEGAL_IDENTITY.lastUpdated}
          </p>

          <div className="space-y-6 text-sand-400 leading-relaxed text-sm sm:text-base">
            <p>{LEGAL_IDENTITY.identityStatement}</p>
            <p>
              These terms explain how to use worldespressochampionship.com and how participation
              works at a high level. They are not legal advice and they are not the full
              competition rulebook.
            </p>

            <h2 className="text-xl font-semibold text-sand-100">Website use</h2>
            <p>
              You may browse the site and use published forms for their stated purposes. Do not
              attempt to misuse, overload, scrape personal data from, or interfere with the website
              or live competition systems.
            </p>

            <h2 className="text-xl font-semibold text-sand-100">
              Championship eligibility and rules
            </h2>
            <p>
              Eligibility, scoring, integrity and outstanding rule items are published at{" "}
              <Link className="text-cinnamon-400" to="/rules-and-integrity">
                Rules &amp; Integrity
              </Link>
              . Where something is marked “To be published before competition,” it is not yet final.
            </p>

            <h2 className="text-xl font-semibold text-sand-100">Registration</h2>
            <p>
              Submitting a registration or enquiry form does not automatically guarantee acceptance
              into the field, a partnership, judging role, or volunteer place. WEC reviews
              submissions and contacts people by email.
            </p>

            <h2 className="text-xl font-semibold text-sand-100">Intellectual property</h2>
            <p>
              WEC names, logos, site copy, software visuals and event photography remain owned by
              their respective rights holders. You may link to public pages; do not present WEC
              materials as your own product or championship.
            </p>

            <h2 className="text-xl font-semibold text-sand-100">Photography and media</h2>
            <p>
              Where participants agree to photography or media use for the championship, that
              agreement governs how those images and recordings may be used. WEC aims to credit
              photographers where known.
            </p>

            <h2 className="text-xl font-semibold text-sand-100">
              Competition decisions and corrections
            </h2>
            <p>
              Heats are decided under the published scoring rules. Corrections follow the published
              process when one exists; items still listed as outstanding on Rules &amp; Integrity
              will be published before competition rather than invented here.
            </p>

            <h2 className="text-xl font-semibold text-sand-100">Sponsor independence</h2>
            <p>
              Commercial partners support the platform. They do not influence judging, ballots,
              seeding or results.
            </p>

            <h2 className="text-xl font-semibold text-sand-100">Prohibited misuse</h2>
            <p>
              Do not use the site or live systems to harass people, submit false registrations,
              attempt unauthorised admin access, manipulate results displays, or republish
              unpublished competitor strategy material obtained improperly.
            </p>

            <h2 className="text-xl font-semibold text-sand-100">Contact</h2>
            <p>
              Questions:{" "}
              <a className="text-cinnamon-400" href={`mailto:${email}`}>
                {email}
              </a>{" "}
              or the{" "}
              <Link className="text-cinnamon-400" to="/contact">
                Contact
              </Link>{" "}
              form. Privacy details are on{" "}
              <Link className="text-cinnamon-400" to="/privacy">
                Privacy &amp; Data Use
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

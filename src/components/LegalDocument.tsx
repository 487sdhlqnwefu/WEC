import type { ReactNode } from "react";
import { isLegalIdentityComplete, legalIdentity } from "@/config/legalIdentity";
import PageShell from "@/components/PageShell";
import { SITE } from "@/config/site";

type LegalDocumentProps = {
  kind: "privacy" | "terms";
  title: string;
  lead: string;
  children: ReactNode;
};

/**
 * Renders full legal copy only when `legalIdentity` is complete.
 * Incomplete identity shows a neutral holding page — no TODO text, no fake address.
 */
export default function LegalDocument({
  kind,
  title,
  lead,
  children,
}: LegalDocumentProps) {
  if (!isLegalIdentityComplete()) {
    return (
      <PageShell
        eyebrow="Legal"
        title={title}
        lead="These documents will be published when the organisational controller details are confirmed."
      >
        <section className="wec-section bg-[#140f0b]">
          <div className="wec-container max-w-2xl">
            <p className="text-sand-400 leading-relaxed">
              For urgent enquiries meanwhile, contact{" "}
              <a
                href={`mailto:${SITE.contactEmail}`}
                className="text-cinnamon-400 hover:text-cinnamon-300"
              >
                {SITE.contactEmail}
              </a>
              .
            </p>
          </div>
        </section>
      </PageShell>
    );
  }

  const updated = new Date().toISOString().slice(0, 10);

  return (
    <PageShell eyebrow="Legal" title={title} lead={lead}>
      <section className="wec-section bg-[#140f0b]">
        <div className="wec-container max-w-3xl prose-invert">
          <p className="text-sm text-sand-500 mb-8">Last updated: {updated}</p>
          <div className="space-y-6 text-sand-300 leading-relaxed text-[15px]">
            <section className="space-y-2">
              <h2 className="text-xl font-semibold text-sand-100">
                Controller
              </h2>
              <p>
                The controller for {kind === "privacy" ? "personal data" : "these terms"}{" "}
                is <strong className="text-sand-100">{legalIdentity.controllerName}</strong>
                {legalIdentity.registrationApplicable &&
                legalIdentity.registrationNumber
                  ? ` (registration no. ${legalIdentity.registrationNumber})`
                  : ""}
                , established in {legalIdentity.countryOfEstablishment}.
              </p>
              <p>
                Official business address: {legalIdentity.businessAddress}.
              </p>
              <p>
                Privacy contact:{" "}
                <a
                  href={`mailto:${legalIdentity.privacyEmail}`}
                  className="text-cinnamon-400 hover:text-cinnamon-300"
                >
                  {legalIdentity.privacyEmail}
                </a>
                .
              </p>
            </section>
            {children}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

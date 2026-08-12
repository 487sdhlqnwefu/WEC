import { Link } from "react-router";
import { Instagram, Mail, ExternalLink } from "lucide-react";
import { WEC_FACTS } from "@/data/wecFacts";

const footerLinks = {
  championship: [
    { label: "About WEC", href: "/about" },
    { label: "How Judging Works", href: "/judging" },
    { label: "Rules & Integrity", href: "/rules-and-integrity" },
    { label: "Innovation Lab", href: "/innovation" },
    { label: "Champions", href: "/champions" },
    { label: "History", href: "/history" },
    { label: "WEC 2026 Panama", href: "/panama-2026" },
    { label: "Live Bracket", href: "/live/wec-2026-panama" },
    { label: "Our Vision", href: "/vision" },
    { label: "Café Unido announcement", href: "/news/cafe-unido-confirmed-wec-2026" },
  ],
  participate: [
    { label: "Register", href: "/panama-2026#competitor-registration" },
    { label: "Become a Sponsor", href: "/panama-2026#sponsors" },
    { label: "National Organisers", href: "/about" },
  ],
  resources: [
    { label: "News & Media", href: "/news" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

export default function Footer() {
  const email = WEC_FACTS.organisation.founderEmail;
  const mailto = WEC_FACTS.organisation.founderMailto;

  return (
    <footer className="bg-[#140f0b] border-t border-[#3a2a1f]">
      <div className="wec-container py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img
                src="/assets/logo-white.png"
                alt="World Espresso Championship"
                className="h-12 w-12 object-contain"
                width={48}
                height={48}
              />
              <div>
                <span className="text-lg font-bold text-sand-100 tracking-wider block">
                  WORLD ESPRESSO
                </span>
                <span className="text-xs text-cinnamon-400 tracking-[0.2em]">CHAMPIONSHIP</span>
              </div>
            </Link>
            <p className="text-sm text-sand-400 leading-relaxed max-w-sm mb-4">
              A controlled, blind espresso championship. Same coffee. Same machine. Only the barista
              differs. {WEC_FACTS.organisation.coreLine}
            </p>
            <p className="text-xs text-sand-500 leading-relaxed max-w-sm mb-6">
              Reach the founder directly:{" "}
              <a href={mailto} className="text-cinnamon-400 hover:text-cinnamon-300">
                {email}
              </a>
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/worldespressochampionship"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-[#231a14] border border-[#3a2a1f] flex items-center justify-center text-sand-400 hover:text-cinnamon-400"
                aria-label="WEC on Instagram"
              >
                <Instagram className="w-5 h-5" aria-hidden />
              </a>
              <a
                href={mailto}
                title={email}
                className="w-11 h-11 rounded-full bg-[#231a14] border border-[#3a2a1f] flex items-center justify-center text-sand-400 hover:text-cinnamon-400"
                aria-label={`Email ${email}`}
              >
                <Mail className="w-5 h-5" aria-hidden />
              </a>
              <a
                href="https://objectivecoffeecommunity.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-full bg-[#231a14] border border-[#3a2a1f] flex items-center justify-center text-sand-400 hover:text-cinnamon-400"
                aria-label="Objective Coffee Community"
              >
                <ExternalLink className="w-5 h-5" aria-hidden />
              </a>
            </div>
          </div>

          {(
            [
              ["Championship", footerLinks.championship],
              ["Participate", footerLinks.participate],
              ["Resources", footerLinks.resources],
            ] as const
          ).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-sm font-semibold text-sand-200 uppercase tracking-wider mb-4">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      to={link.href}
                      className="text-sm text-sand-500 hover:text-cinnamon-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-[#3a2a1f] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-sand-600">
            &copy; {new Date().getFullYear()} World Espresso Championship. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <Link to="/privacy" className="text-xs text-sand-600 hover:text-sand-400">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-xs text-sand-600 hover:text-sand-400">
              Terms of Use
            </Link>
            <Link
              to={WEC_FACTS.partners.foundingEquipment.pagePath}
              className="text-xs text-sand-600 hover:text-sand-400"
            >
              {WEC_FACTS.partners.foundingEquipment.label}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

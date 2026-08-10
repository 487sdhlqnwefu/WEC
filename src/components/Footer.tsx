import { Link } from "react-router";
import { Instagram, Mail, ExternalLink } from "lucide-react";

const footerLinks = {
  championship: [
    { label: "About WEC", href: "/about" },
    { label: "History", href: "/history" },
    { label: "WEC 2026 Panama", href: "/panama-2026" },
    { label: "Live Bracket", href: "/live/wec-2026-panama" },
    { label: "Our Vision", href: "/vision" },
  ],
  participate: [
    { label: "Competitor Registration", href: "/panama-2026" },
    { label: "Judge Registration", href: "/panama-2026" },
    { label: "Volunteer", href: "/panama-2026" },
    { label: "National Organisers", href: "/about" },
  ],
  resources: [
    { label: "Champion's Coffee Store", href: "/store" },
    { label: "News & Media", href: "/news" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#140f0b] border-t border-[#3a2a1f]">
      <div className="wec-container py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img
                src="/assets/logo-white.png"
                alt="WEC"
                className="h-12 w-12 object-contain"
              />
              <div>
                <span className="text-lg font-bold text-sand-100 tracking-wider block">
                  WORLD ESPRESSO
                </span>
                <span className="text-xs text-cinnamon-400 tracking-[0.2em]">
                  CHAMPIONSHIP
                </span>
              </div>
            </Link>
            <p className="text-sm text-sand-400 leading-relaxed max-w-sm mb-6">
              The world's most objective espresso competition. Same coffee. Same
              machine. Only the barista differs. Winner takes a career, not just
              a trophy.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/worldespressochampionship"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#231a14] border border-[#3a2a1f] flex items-center justify-center text-sand-400 hover:text-cinnamon-400 hover:border-cinnamon-500/50 transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="mailto:hello@worldespressochampionship.com"
                className="w-10 h-10 rounded-full bg-[#231a14] border border-[#3a2a1f] flex items-center justify-center text-sand-400 hover:text-cinnamon-400 hover:border-cinnamon-500/50 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="https://objectivecoffeecommunity.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#231a14] border border-[#3a2a1f] flex items-center justify-center text-sand-400 hover:text-cinnamon-400 hover:border-cinnamon-500/50 transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-sm font-semibold text-sand-200 uppercase tracking-wider mb-4">
              Championship
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.championship.map((link) => (
                <li key={link.href}>
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

          <div>
            <h4 className="text-sm font-semibold text-sand-200 uppercase tracking-wider mb-4">
              Participate
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.participate.map((link) => (
                <li key={link.label}>
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

          <div>
            <h4 className="text-sm font-semibold text-sand-200 uppercase tracking-wider mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
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
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[#3a2a1f] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-sand-600">
            &copy; {new Date().getFullYear()} World Espresso Championship. All
            rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              to="/contact"
              className="text-xs text-sand-600 hover:text-sand-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/contact"
              className="text-xs text-sand-600 hover:text-sand-400 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

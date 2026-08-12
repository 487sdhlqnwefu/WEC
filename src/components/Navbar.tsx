import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { WEC_FACTS } from "@/data/wecFacts";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navLinks = WEC_FACTS.nav.primary.filter(
    (l) => WEC_FACTS.features.storeEnabled || l.href !== "/store",
  );

  return (
    <nav
      className="sticky top-0 z-50 bg-[#1a1410]/95 backdrop-blur-md border-b border-[#3a2a1f]/50"
      aria-label="Primary"
    >
      <div className="wec-container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img
              src="/assets/logo-white.png"
              alt="World Espresso Championship"
              className="h-10 w-10 lg:h-12 lg:w-12 object-contain"
              width={48}
              height={48}
            />
            <div className="hidden sm:block">
              <span className="text-sm lg:text-base font-bold text-sand-100 tracking-wider">
                WORLD ESPRESSO
              </span>
              <span className="block text-[10px] lg:text-xs text-cinnamon-400 tracking-[0.2em] -mt-1">
                CHAMPIONSHIP
              </span>
            </div>
          </Link>

          <div className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 py-2 text-sm transition-colors rounded-md min-h-11 inline-flex items-center ${
                  location.pathname === link.href.split("#")[0]
                    ? "text-cinnamon-400 bg-cinnamon-950/30"
                    : "text-sand-300 hover:text-sand-100 hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden xl:flex items-center gap-3">
            <Link to="/panama-2026#competitor-registration">
              <Button size="sm" className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100 min-h-11">
                Register
              </Button>
            </Link>
          </div>

          <div className="flex xl:hidden items-center gap-2">
            <Link to="/panama-2026#competitor-registration">
              <Button
                size="sm"
                className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100 text-xs min-h-11"
              >
                Register
              </Button>
            </Link>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-sand-200 min-h-11 min-w-11"
                  aria-label="Open menu"
                  aria-expanded={isOpen}
                  aria-controls="mobile-nav"
                >
                  <Menu className="h-6 w-6" aria-hidden />
                </Button>
              </SheetTrigger>
              <SheetContent
                id="mobile-nav"
                side="right"
                className="w-[300px] bg-[#1a1410] border-[#3a2a1f]"
              >
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col gap-1 mt-8">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        to={link.href}
                        className={`px-4 py-3 text-sm transition-colors rounded-lg min-h-11 inline-flex items-center ${
                          location.pathname === link.href.split("#")[0]
                            ? "text-cinnamon-400 bg-cinnamon-950/30 font-medium"
                            : "text-sand-300 hover:text-sand-100 hover:bg-white/5"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

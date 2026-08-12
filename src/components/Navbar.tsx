import { useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, User, LogOut, Shield } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Judging", href: "/judging" },
  { label: "Innovation Lab", href: "/innovation" },
  { label: "WEC 2026", href: "/panama-2026" },
  { label: "Live", href: "/live/wec-2026-panama" },
  { label: "Store", href: "/store" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-[#1a1410]/95 backdrop-blur-md border-b border-[#3a2a1f]/50">
      <div className="wec-container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img
              src="/assets/logo-white.png"
              alt="WEC"
              className="h-10 w-10 lg:h-12 lg:w-12 object-contain"
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

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-3 py-2 text-sm transition-colors rounded-md ${
                  location.pathname === link.href
                    ? "text-cinnamon-400 bg-cinnamon-950/30"
                    : "text-sand-300 hover:text-sand-100 hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden xl:flex items-center gap-3">
            {isAuthenticated && user?.role === "admin" && (
              <Link to="/admin">
                <Button variant="ghost" size="sm" className="text-gold hover:text-gold hover:bg-gold/10">
                  <Shield className="w-4 h-4 mr-1" />
                  Admin
                </Button>
              </Link>
            )}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-sand-300">{user?.name}</span>
                <Button variant="ghost" size="sm" onClick={logout} className="text-sand-400 hover:text-sand-200">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-sand-300 hover:text-sand-100">
                  <User className="w-4 h-4 mr-1" />
                  Sign In
                </Button>
              </Link>
            )}
            <Link to="/panama-2026">
              <Button size="sm" className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100">
                Register Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <div className="flex xl:hidden items-center gap-2">
            <Link to="/panama-2026">
              <Button size="sm" className="bg-cinnamon-600 hover:bg-cinnamon-500 text-sand-100 text-xs">
                Register
              </Button>
            </Link>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-sand-200">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-[#1a1410] border-[#3a2a1f]">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <div className="flex flex-col gap-1 mt-8">
                  {navLinks.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        to={link.href}
                        className={`px-4 py-3 text-sm transition-colors rounded-lg ${
                          location.pathname === link.href
                            ? "text-cinnamon-400 bg-cinnamon-950/30 font-medium"
                            : "text-sand-300 hover:text-sand-100 hover:bg-white/5"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                  <div className="border-t border-[#3a2a1f] my-3" />
                  {isAuthenticated && user?.role === "admin" && (
                    <SheetClose asChild>
                      <Link to="/admin" className="px-4 py-3 text-sm text-gold hover:bg-gold/10 rounded-lg flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    </SheetClose>
                  )}
                  {isAuthenticated ? (
                    <button
                      onClick={() => { logout(); setIsOpen(false); }}
                      className="px-4 py-3 text-sm text-sand-400 hover:text-sand-200 text-left flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  ) : (
                    <SheetClose asChild>
                      <Link to="/login" className="px-4 py-3 text-sm text-sand-300 hover:text-sand-100 flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Sign In
                      </Link>
                    </SheetClose>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

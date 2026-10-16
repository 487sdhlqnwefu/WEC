import { useEffect, useState, type ReactNode } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { Menu } from "lucide-react";
import {
  COLOURS,
  CONTACT_EMAIL,
  FOOTER,
  NAV,
  SIBLING_LINK,
  WBT_PATHS,
  WORDMARK,
} from "./copy";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/sonner";

const TITLES: Record<string, string> = {
  [WBT_PATHS.home]: "World Barista Tournament",
  [WBT_PATHS.how]: "How it works — World Barista Tournament",
  [WBT_PATHS.sitters]: "Sitters — World Barista Tournament",
  [WBT_PATHS.competitors]: "Competitors — World Barista Tournament",
  [WBT_PATHS.luck]: "Luck vs skill — World Barista Tournament",
  [WBT_PATHS.wec]: "WEC — World Barista Tournament",
  [WBT_PATHS.contact]: "Contact — World Barista Tournament",
};

function ColourRule() {
  return (
    <div className="flex h-1 w-full" aria-hidden>
      <span className="flex-1 bg-wbt-brown" />
      <span className="flex-1 bg-wbt-gold" />
      <span className="flex-1 bg-wbt-red" />
      <span className="flex-1 bg-wbt-purple" />
    </div>
  );
}

export default function WbtLayout() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.title = TITLES[location.pathname] ?? "World Barista Tournament";
    return () => {
      document.title = "World Espresso Championship";
    };
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-wbt-paper text-wbt-ink font-lexend">
      <ColourRule />
      <header className="sticky top-0 z-50 bg-wbt-cream/95 backdrop-blur border-b border-wbt-line">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link to={WBT_PATHS.home} className="leading-tight shrink-0">
            <span className="block text-sm font-bold tracking-[0.18em]">{WORDMARK.line1}</span>
            <span className="block text-[10px] tracking-[0.28em] text-wbt-brown">
              {WORDMARK.line2}
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => {
              const active = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`px-2.5 py-1.5 text-sm rounded-md ${
                    active
                      ? "bg-wbt-brown text-wbt-paper"
                      : "text-wbt-mute hover:text-wbt-ink hover:bg-wbt-paper"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to={WBT_PATHS.wecHome}
              className="hidden sm:inline text-xs text-wbt-mute hover:text-wbt-ink underline-offset-4 hover:underline"
            >
              {SIBLING_LINK}
            </Link>
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className="lg:hidden p-2 text-wbt-ink"
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-wbt-cream border-wbt-line w-[280px]">
                <SheetTitle className="sr-only">WBT menu</SheetTitle>
                <div className="flex flex-col gap-1 mt-8">
                  {NAV.map((item) => (
                    <SheetClose asChild key={item.href}>
                      <Link
                        to={item.href}
                        className="px-3 py-2 text-sm text-wbt-ink hover:bg-wbt-paper rounded-md"
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  ))}
                  <SheetClose asChild>
                    <Link
                      to={WBT_PATHS.wecHome}
                      className="px-3 py-2 text-sm text-wbt-mute"
                    >
                      {SIBLING_LINK}
                    </Link>
                  </SheetClose>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-wbt-line bg-wbt-cream">
        <ColourRule />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <p className="text-sm text-wbt-mute max-w-xl mb-6">{FOOTER.blurb}</p>
          <nav className="flex flex-wrap gap-x-4 gap-y-2 text-sm mb-8">
            {NAV.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-wbt-ink hover:text-wbt-brown"
              >
                {item.label}
              </Link>
            ))}
            <Link to={WBT_PATHS.wecHome} className="text-wbt-mute hover:text-wbt-ink">
              {SIBLING_LINK}
            </Link>
          </nav>
          <p className="text-xs text-wbt-mute">{FOOTER.legal}</p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-xs text-wbt-mute hover:text-wbt-ink mt-2 inline-block"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </footer>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#FBF6EE",
            border: "1px solid #D9CBB8",
            color: "#2A1F18",
          },
        }}
      />
    </div>
  );
}

export function PageShell({
  title,
  lede,
  children,
}: {
  title: string;
  lede: string;
  children: ReactNode;
}) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-balance max-w-3xl">
        {title}
      </h1>
      <p className="mt-4 text-lg text-wbt-mute max-w-2xl leading-relaxed">{lede}</p>
      <div className="mt-10 space-y-12">{children}</div>
    </div>
  );
}

const SWATCH: Record<string, string> = {
  Brown: "bg-wbt-brown",
  Gold: "bg-wbt-gold",
  Red: "bg-wbt-red",
  Purple: "bg-wbt-purple",
};

export function ColourBoard() {
  return (
    <ul className="grid sm:grid-cols-2 gap-3">
      {COLOURS.map((c) => (
        <li
          key={c.name}
          className="flex gap-3 items-start rounded-lg border border-wbt-line bg-wbt-cream p-4"
        >
          <span className={`mt-1 h-10 w-10 rounded-md shrink-0 ${SWATCH[c.name]}`} />
          <div>
            <p className="font-semibold">{c.name}</p>
            <p className="text-sm text-wbt-mute">{c.meaning}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

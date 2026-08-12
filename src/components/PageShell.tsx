import type { ReactNode } from "react";

type PageShellProps = {
  eyebrow?: string;
  title: string;
  lead: string;
  children?: ReactNode;
};

/** Shared public-page hero — one purpose, brand-forward. */
export default function PageShell({
  eyebrow,
  title,
  lead,
  children,
}: PageShellProps) {
  return (
    <div>
      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cinnamon-950/20 to-transparent" />
        <div className="wec-container relative">
          <div className="max-w-4xl">
            {eyebrow ? (
              <span className="text-sm text-cinnamon-400 font-medium uppercase tracking-wider">
                {eyebrow}
              </span>
            ) : null}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-sand-100 mt-3 mb-6">
              {title}
            </h1>
            <p className="text-lg sm:text-xl text-sand-400 leading-relaxed max-w-3xl">
              {lead}
            </p>
          </div>
        </div>
      </section>
      {children}
    </div>
  );
}

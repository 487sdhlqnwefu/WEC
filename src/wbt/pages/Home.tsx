import { Link } from "react-router";
import { HOME } from "../copy";
import { wbtHref } from "../host";
import { ColourBoard } from "../WbtLayout";

export default function WbtHome() {
  return (
    <div>
      <section className="relative overflow-hidden border-b border-wbt-line">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at 20% 0%, rgba(212,176,104,0.18), transparent 50%), radial-gradient(ellipse at 90% 80%, rgba(194,74,74,0.12), transparent 45%)",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <p className="text-[11px] uppercase tracking-[0.28em] text-wbt-gold mb-5">
            {HOME.eyebrow}
          </p>
          <h1 className="wbt-display text-5xl sm:text-7xl font-bold uppercase leading-[0.92] max-w-4xl">
            {HOME.h1}
          </h1>
          <p className="mt-6 text-lg text-wbt-mute max-w-2xl leading-relaxed">{HOME.lede}</p>
          <div className="mt-10 flex flex-col md:flex-row md:items-stretch gap-3 max-w-5xl">
            <Link to={wbtHref("sitters")} className="wbt-ticket block p-6 pl-8 hover:border-wbt-gold md:flex-1">
              <p className="text-[10px] uppercase tracking-[0.24em] text-wbt-gold mb-2">Door · silent</p>
              <h2 className="wbt-display text-3xl uppercase">{HOME.pathsSilentTitle}</h2>
              <p className="text-sm text-wbt-mute mt-3">{HOME.pathsSilent}</p>
              <p className="mt-5 text-xs uppercase tracking-[0.16em] text-wbt-ink">{HOME.sit} →</p>
            </Link>
            <p className="md:self-center md:max-w-[14rem] text-sm text-wbt-gold text-center px-2">
              {HOME.pass}
            </p>
            <Link to={wbtHref("festival")} className="wbt-ticket block p-6 pl-8 hover:border-wbt-red md:flex-1">
              <p className="text-[10px] uppercase tracking-[0.24em] text-wbt-red mb-2">Door · festival</p>
              <h2 className="wbt-display text-3xl uppercase">{HOME.pathsFestTitle}</h2>
              <p className="text-sm text-wbt-mute mt-3">{HOME.pathsFest}</p>
              <p className="mt-5 text-xs uppercase tracking-[0.16em] text-wbt-ink">{HOME.festival} →</p>
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to={wbtHref("competitors")}
              className="inline-flex border border-wbt-gold text-wbt-gold px-5 py-2.5 text-xs uppercase tracking-[0.16em] hover:bg-wbt-gold hover:text-wbt-paper"
            >
              {HOME.compete}
            </Link>
            <Link
              to={wbtHref("how")}
              className="text-xs uppercase tracking-[0.16em] text-wbt-mute hover:text-wbt-ink"
            >
              {HOME.how}
            </Link>
            <Link
              to={wbtHref("luck")}
              className="text-xs uppercase tracking-[0.16em] text-wbt-mute hover:text-wbt-ink"
            >
              {HOME.luckLink}
            </Link>
            <Link
              to={wbtHref("results")}
              className="text-xs uppercase tracking-[0.16em] text-wbt-mute hover:text-wbt-ink"
            >
              {HOME.resultsLink}
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 space-y-16">
        <section>
          <h2 className="wbt-display text-3xl uppercase mb-4">{HOME.productH2}</h2>
          <ul className="space-y-2 text-wbt-mute max-w-2xl">
            {HOME.product.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="wbt-display text-3xl uppercase mb-2">{HOME.colourH2}</h2>
          <p className="text-wbt-mute mb-6 max-w-2xl">{HOME.colourIntro}</p>
          <ColourBoard />
        </section>

        <section>
          <h2 className="wbt-display text-3xl uppercase mb-3">{HOME.barH2}</h2>
          <p className="text-wbt-mute max-w-2xl leading-relaxed">{HOME.bar}</p>
        </section>

        <section>
          <h2 className="wbt-display text-3xl uppercase mb-4">{HOME.whoH2}</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <article className="border border-wbt-line bg-wbt-cream p-6">
              <h3 className="wbt-display text-2xl uppercase mb-2">{HOME.sittersTitle}</h3>
              <p className="text-sm text-wbt-mute mb-3">{HOME.sittersBody}</p>
              <Link to={wbtHref("sitters")} className="text-xs uppercase tracking-[0.14em] text-wbt-gold">
                {HOME.sittersLink}
              </Link>
            </article>
            <article className="border border-wbt-line bg-wbt-cream p-6">
              <h3 className="wbt-display text-2xl uppercase mb-2">{HOME.competitorsTitle}</h3>
              <p className="text-sm text-wbt-mute mb-3">{HOME.competitorsBody}</p>
              <Link
                to={wbtHref("competitors")}
                className="text-xs uppercase tracking-[0.14em] text-wbt-gold"
              >
                {HOME.competitorsLink}
              </Link>
            </article>
            <article className="border border-wbt-line bg-wbt-cream p-6">
              <h3 className="wbt-display text-2xl uppercase mb-2">{HOME.festivalTitle}</h3>
              <p className="text-sm text-wbt-mute mb-3">{HOME.festivalBody}</p>
              <Link to={wbtHref("festival")} className="text-xs uppercase tracking-[0.14em] text-wbt-gold">
                {HOME.festivalLink}
              </Link>
            </article>
          </div>
        </section>

        <section>
          <h2 className="wbt-display text-3xl uppercase mb-3">{HOME.luckH2}</h2>
          <p className="text-wbt-mute max-w-2xl mb-3">{HOME.luck}</p>
          <Link to={wbtHref("luck")} className="text-xs uppercase tracking-[0.14em] text-wbt-gold">
            {HOME.luckLink}
          </Link>
        </section>

        <section>
          <h2 className="wbt-display text-3xl uppercase mb-3">{HOME.resultsH2}</h2>
          <p className="text-wbt-mute max-w-2xl mb-3">{HOME.results}</p>
          <Link to={wbtHref("results")} className="text-xs uppercase tracking-[0.14em] text-wbt-gold">
            {HOME.resultsLink}
          </Link>
        </section>

        <section>
          <h2 className="wbt-display text-3xl uppercase mb-3">{HOME.siblingH2}</h2>
          <p className="text-wbt-mute max-w-2xl mb-3">{HOME.sibling}</p>
          <Link to={wbtHref("wec")} className="text-xs uppercase tracking-[0.14em] text-wbt-gold">
            {HOME.siblingLink}
          </Link>
        </section>
      </div>
    </div>
  );
}

import { Link } from "react-router";
import { COLOURS, HOME, WBT_PATHS } from "../copy";
import { ColourBoard } from "../WbtLayout";

export default function WbtHome() {
  return (
    <div>
      <section className="border-b border-wbt-line bg-wbt-cream">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <p className="text-xs tracking-[0.25em] text-wbt-brown font-semibold mb-4">
            {HOME.eyebrow}
          </p>
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-balance max-w-3xl">
            {HOME.h1}
          </h1>
          <p className="mt-6 text-lg text-wbt-mute max-w-2xl leading-relaxed">{HOME.lede}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to={WBT_PATHS.sitters}
              className="inline-flex rounded-md bg-wbt-brown text-wbt-paper px-5 py-2.5 text-sm font-medium hover:bg-wbt-ink"
            >
              {HOME.sit}
            </Link>
            <Link
              to={WBT_PATHS.competitors}
              className="inline-flex rounded-md border border-wbt-ink text-wbt-ink px-5 py-2.5 text-sm font-medium hover:bg-wbt-paper"
            >
              {HOME.compete}
            </Link>
            <Link to={WBT_PATHS.how} className="text-sm text-wbt-mute hover:text-wbt-ink underline-offset-4 hover:underline">
              {HOME.how}
            </Link>
          </div>
          <div className="mt-10 flex gap-2" aria-hidden>
            {COLOURS.map((c) => (
              <span
                key={c.name}
                className={`h-2 w-12 rounded-full ${
                  c.name === "Brown"
                    ? "bg-wbt-brown"
                    : c.name === "Gold"
                      ? "bg-wbt-gold"
                      : c.name === "Red"
                        ? "bg-wbt-red"
                        : "bg-wbt-purple"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 space-y-14">
        <section>
          <h2 className="text-2xl font-semibold mb-4">{HOME.productH2}</h2>
          <ul className="space-y-2 text-wbt-mute max-w-2xl">
            {HOME.product.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">{HOME.colourH2}</h2>
          <p className="text-wbt-mute mb-4 max-w-2xl">{HOME.colourIntro}</p>
          <ColourBoard />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">{HOME.barH2}</h2>
          <p className="text-wbt-mute max-w-2xl leading-relaxed">{HOME.bar}</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">{HOME.whoH2}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <article className="rounded-lg border border-wbt-line bg-wbt-cream p-5">
              <h3 className="font-semibold mb-2">{HOME.sittersTitle}</h3>
              <p className="text-sm text-wbt-mute mb-3">{HOME.sittersBody}</p>
              <Link to={WBT_PATHS.sitters} className="text-sm text-wbt-brown hover:underline">
                {HOME.sittersLink}
              </Link>
            </article>
            <article className="rounded-lg border border-wbt-line bg-wbt-cream p-5">
              <h3 className="font-semibold mb-2">{HOME.competitorsTitle}</h3>
              <p className="text-sm text-wbt-mute mb-3">{HOME.competitorsBody}</p>
              <Link to={WBT_PATHS.competitors} className="text-sm text-wbt-brown hover:underline">
                {HOME.competitorsLink}
              </Link>
            </article>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">{HOME.luckH2}</h2>
          <p className="text-wbt-mute max-w-2xl mb-3">{HOME.luck}</p>
          <Link to={WBT_PATHS.luck} className="text-sm text-wbt-brown hover:underline">
            {HOME.luckLink}
          </Link>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">{HOME.siblingH2}</h2>
          <p className="text-wbt-mute max-w-2xl mb-3">{HOME.sibling}</p>
          <Link to={WBT_PATHS.wec} className="text-sm text-wbt-brown hover:underline">
            {HOME.siblingLink}
          </Link>
        </section>
      </div>
    </div>
  );
}

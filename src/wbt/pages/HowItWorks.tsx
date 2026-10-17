import { Link } from "react-router";
import { HOW } from "../copy";
import { wbtHref } from "../host";
import { PageShell } from "../WbtLayout";

export default function HowItWorks() {
  return (
    <PageShell title={HOW.h1} lede={HOW.lede}>
      <ol className="space-y-6">
        {HOW.steps.map((step, i) => (
          <li key={step.title} className="flex gap-4">
            <span className="wbt-display text-wbt-gold w-8 shrink-0 text-xl">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h2 className="wbt-display text-2xl uppercase">{step.title}</h2>
              <p className="text-wbt-mute mt-1 max-w-2xl">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <section>
        <h2 className="wbt-display text-3xl uppercase mb-3">{HOW.orderH2}</h2>
        <p className="text-wbt-mute max-w-2xl">{HOW.order}</p>
      </section>

      <section>
        <h2 className="wbt-display text-3xl uppercase mb-3">{HOW.hopperH2}</h2>
        {HOW.hopper.map((p) => (
          <p key={p} className="text-wbt-mute max-w-2xl mb-3">
            {p}
          </p>
        ))}
      </section>

      <section>
        <h2 className="wbt-display text-3xl uppercase mb-3">{HOW.stationH2}</h2>
        <p className="text-wbt-mute max-w-2xl">{HOW.station}</p>
      </section>

      <section>
        <h2 className="wbt-display text-3xl uppercase mb-3">{HOW.firstH2}</h2>
        <ul className="space-y-2 text-wbt-mute max-w-2xl">
          {HOW.first.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="mt-6 text-sm">
          <Link to={wbtHref("sitters")} className="text-wbt-gold hover:underline">
            Sitters
          </Link>
          <span className="text-wbt-mute"> · </span>
          <Link to={wbtHref("festival")} className="text-wbt-gold hover:underline">
            Festival
          </Link>
          <span className="text-wbt-mute"> · </span>
          <Link to={wbtHref("competitors")} className="text-wbt-gold hover:underline">
            Competitors
          </Link>
        </p>
      </section>
    </PageShell>
  );
}

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
            <span className="text-sm font-semibold text-wbt-brown w-6 shrink-0">{i + 1}</span>
            <div>
              <h2 className="font-semibold">{step.title}</h2>
              <p className="text-wbt-mute mt-1 max-w-2xl">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <section>
        <h2 className="text-2xl font-semibold mb-3">{HOW.orderH2}</h2>
        <p className="text-wbt-mute max-w-2xl">{HOW.order}</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">{HOW.hopperH2}</h2>
        {HOW.hopper.map((p) => (
          <p key={p} className="text-wbt-mute max-w-2xl mb-3">
            {p}
          </p>
        ))}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">{HOW.stationH2}</h2>
        <p className="text-wbt-mute max-w-2xl">{HOW.station}</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">{HOW.firstH2}</h2>
        <ul className="space-y-2 text-wbt-mute max-w-2xl">
          {HOW.first.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="mt-6 text-sm">
          <Link to={wbtHref("sitters")} className="text-wbt-brown hover:underline">
            Sitters
          </Link>
          <span className="text-wbt-mute"> · </span>
          <Link to={wbtHref("festival")} className="text-wbt-brown hover:underline">
            Festival
          </Link>
          <span className="text-wbt-mute"> · </span>
          <Link to={wbtHref("competitors")} className="text-wbt-brown hover:underline">
            Competitors
          </Link>
        </p>
      </section>
    </PageShell>
  );
}

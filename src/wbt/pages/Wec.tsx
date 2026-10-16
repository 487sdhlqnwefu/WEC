import { Link } from "react-router";
import { WBT_PATHS, WEC_PAGE } from "../copy";
import { PageShell } from "../WbtLayout";

export default function WecSibling() {
  return (
    <PageShell title={WEC_PAGE.h1} lede={WEC_PAGE.lede}>
      <ul className="space-y-3 text-wbt-mute max-w-2xl">
        {WEC_PAGE.lines.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-3">
        <Link
          to={WBT_PATHS.wecHome}
          className="inline-flex rounded-md bg-wbt-brown text-wbt-paper px-5 py-2.5 text-sm font-medium hover:bg-wbt-ink"
        >
          {WEC_PAGE.wecHome}
        </Link>
        <Link
          to={WBT_PATHS.home}
          className="inline-flex rounded-md border border-wbt-ink px-5 py-2.5 text-sm font-medium"
        >
          {WEC_PAGE.wbtHome}
        </Link>
      </div>
    </PageShell>
  );
}

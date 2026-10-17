import { RESULTS } from "../copy";
import { PageShell } from "../WbtLayout";

export default function Results() {
  return (
    <PageShell title={RESULTS.h1} lede={RESULTS.lede}>
      <section>
        <h2 className="wbt-display text-3xl uppercase mb-3">{RESULTS.likesH2}</h2>
        <p className="text-wbt-mute max-w-2xl">{RESULTS.likes}</p>
      </section>

      <section>
        <h2 className="wbt-display text-3xl uppercase mb-3">{RESULTS.commissionsH2}</h2>
        <p className="text-wbt-mute max-w-2xl">{RESULTS.commissions}</p>
      </section>

      <section>
        <h2 className="wbt-display text-3xl uppercase mb-3">{RESULTS.factH2}</h2>
        <p className="text-wbt-mute max-w-2xl">{RESULTS.fact}</p>
      </section>

      <section>
        <h2 className="wbt-display text-3xl uppercase mb-3">{RESULTS.emptyH2}</h2>
        <p className="text-wbt-mute max-w-2xl mb-6">{RESULTS.empty}</p>
        <div className="overflow-x-auto border border-wbt-line rounded-lg bg-wbt-cream">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-wbt-line">
                {RESULTS.columns.map((col) => (
                  <th key={col} className="px-4 py-3 font-semibold">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={3} className="px-4 py-8 text-wbt-mute">
                  Empty until event one locks.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </PageShell>
  );
}

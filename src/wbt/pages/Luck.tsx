import { LUCK } from "../copy";
import { PageShell } from "../WbtLayout";

export default function Luck() {
  return (
    <PageShell title={LUCK.h1} lede={LUCK.lede}>
      <section>
        <h2 className="wbt-display text-3xl uppercase mb-3">{LUCK.skillH2}</h2>
        <ul className="space-y-2 text-wbt-mute max-w-2xl mb-4">
          {LUCK.skill.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="text-wbt-mute max-w-2xl">{LUCK.skillClose}</p>
      </section>

      <section>
        <h2 className="wbt-display text-3xl uppercase mb-3">{LUCK.luckH2}</h2>
        <ul className="space-y-2 text-wbt-mute max-w-2xl mb-4">
          {LUCK.luck.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        <p className="text-wbt-mute max-w-2xl">{LUCK.luckClose}</p>
      </section>

      <section>
        <h2 className="wbt-display text-3xl uppercase mb-3">{LUCK.printH2}</h2>
        <p className="text-wbt-mute max-w-2xl mb-4">{LUCK.print}</p>
        <p className="text-wbt-mute max-w-2xl">{LUCK.close}</p>
      </section>
    </PageShell>
  );
}

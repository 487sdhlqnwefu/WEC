import { FESTIVAL } from "../copy";
import { PageShell } from "../WbtLayout";
import { Field, WbtForm } from "../WbtForm";

export default function Festival() {
  return (
    <PageShell title={FESTIVAL.h1} lede={FESTIVAL.lede}>
      <section>
        <h2 className="wbt-display text-3xl uppercase mb-3">{FESTIVAL.lookH2}</h2>
        <p className="text-wbt-mute max-w-2xl">{FESTIVAL.look}</p>
      </section>

      <section>
        <h2 className="wbt-display text-3xl uppercase mb-3">{FESTIVAL.prizesH2}</h2>
        <p className="text-wbt-mute max-w-2xl mb-4">{FESTIVAL.prizesIntro}</p>
        <ul className="space-y-2 text-wbt-mute max-w-2xl">
          {FESTIVAL.prizes.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="wbt-display text-3xl uppercase mb-3">{FESTIVAL.packsH2}</h2>
        <p className="text-wbt-mute max-w-2xl">{FESTIVAL.packs}</p>
      </section>

      <section>
        <h2 className="wbt-display text-3xl uppercase mb-3">{FESTIVAL.gamesH2}</h2>
        <p className="text-wbt-mute max-w-2xl">{FESTIVAL.games}</p>
      </section>

      <section>
        <h2 className="wbt-display text-3xl uppercase mb-3">{FESTIVAL.getH2}</h2>
        <ul className="space-y-2 text-wbt-mute max-w-2xl">
          {FESTIVAL.get.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="wbt-display text-3xl uppercase mb-3">{FESTIVAL.notH2}</h2>
        <p className="text-wbt-mute max-w-2xl">{FESTIVAL.not}</p>
      </section>

      <section>
        <h2 className="wbt-display text-3xl uppercase mb-2">{FESTIVAL.formH2}</h2>
        <p className="text-wbt-mute max-w-2xl mb-6">{FESTIVAL.formIntro}</p>
        <WbtForm
          subjectPrefix="[WBT festival]"
          submitLabel={FESTIVAL.submit}
          success={FESTIVAL.success}
          error={FESTIVAL.error}
        >
          <Field name="name" label={FESTIVAL.name} required />
          <Field name="email" label={FESTIVAL.email} type="email" required />
          <Field name="city" label={FESTIVAL.city} />
          <Field name="note" label={FESTIVAL.note} as="textarea" />
        </WbtForm>
      </section>
    </PageShell>
  );
}

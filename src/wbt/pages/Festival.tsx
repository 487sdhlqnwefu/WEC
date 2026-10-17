import { FESTIVAL } from "../copy";
import { PageShell } from "../WbtLayout";
import { Field, WbtForm } from "../WbtForm";

export default function Festival() {
  return (
    <PageShell title={FESTIVAL.h1} lede={FESTIVAL.lede}>
      <section>
        <h2 className="text-2xl font-semibold mb-3">{FESTIVAL.whoH2}</h2>
        <ul className="space-y-2 text-wbt-mute max-w-2xl">
          {FESTIVAL.who.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">{FESTIVAL.gamesH2}</h2>
        <p className="text-wbt-mute max-w-2xl">{FESTIVAL.games}</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">{FESTIVAL.coffeeH2}</h2>
        <p className="text-wbt-mute max-w-2xl">{FESTIVAL.coffee}</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">{FESTIVAL.moneyH2}</h2>
        <p className="text-wbt-mute max-w-2xl">{FESTIVAL.money}</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">{FESTIVAL.formH2}</h2>
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

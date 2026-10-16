import { COMPETITORS } from "../copy";
import { PageShell } from "../WbtLayout";
import { Check, Field, WbtForm } from "../WbtForm";

export default function Competitors() {
  return (
    <PageShell title={COMPETITORS.h1} lede={COMPETITORS.lede}>
      <section>
        <h2 className="text-2xl font-semibold mb-3">{COMPETITORS.winH2}</h2>
        {COMPETITORS.win.map((p) => (
          <p key={p} className="text-wbt-mute max-w-2xl mb-3">
            {p}
          </p>
        ))}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">{COMPETITORS.barH2}</h2>
        <ul className="space-y-2 text-wbt-mute max-w-2xl">
          {COMPETITORS.bar.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">{COMPETITORS.listH2}</h2>
        {COMPETITORS.list.map((p) => (
          <p key={p} className="text-wbt-mute max-w-2xl mb-3">
            {p}
          </p>
        ))}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">{COMPETITORS.kitH2}</h2>
        <p className="text-wbt-mute max-w-2xl">{COMPETITORS.kit}</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">{COMPETITORS.fieldH2}</h2>
        <p className="text-wbt-mute max-w-2xl">{COMPETITORS.field}</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">{COMPETITORS.formH2}</h2>
        <p className="text-wbt-mute max-w-2xl mb-6">{COMPETITORS.formIntro}</p>
        <WbtForm
          subjectPrefix="[WBT competitor]"
          submitLabel={COMPETITORS.submit}
          success={COMPETITORS.success}
          error={COMPETITORS.error}
          extraMessage={(data) =>
            [
              data.get("compete") ? "Wants to compete: yes" : "Wants to compete: no",
              data.get("listHelp") ? "Help with coffee list: yes" : "Help with coffee list: no",
            ].join("\n")
          }
        >
          <Field name="name" label={COMPETITORS.name} required />
          <Field name="email" label={COMPETITORS.email} type="email" required />
          <Field name="city" label={COMPETITORS.city} />
          <Check name="compete" label={COMPETITORS.compete} />
          <Check name="listHelp" label={COMPETITORS.listHelp} />
          <Field name="note" label={COMPETITORS.note} as="textarea" />
        </WbtForm>
      </section>
    </PageShell>
  );
}

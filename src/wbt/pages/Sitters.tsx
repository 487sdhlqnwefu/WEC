import { SITTERS } from "../copy";
import { PageShell } from "../WbtLayout";
import { Check, Field, WbtForm } from "../WbtForm";

export default function Sitters() {
  return (
    <PageShell title={SITTERS.h1} lede={SITTERS.lede}>
      <section>
        <h2 className="text-2xl font-semibold mb-3">{SITTERS.seatH2}</h2>
        <ol className="space-y-2 text-wbt-mute max-w-2xl list-decimal list-inside">
          {SITTERS.seat.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">{SITTERS.whoH2}</h2>
        {SITTERS.who.map((p) => (
          <p key={p} className="text-wbt-mute max-w-2xl mb-3">
            {p}
          </p>
        ))}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-3">{SITTERS.oweH2}</h2>
        <ul className="space-y-2 text-wbt-mute max-w-2xl">
          {SITTERS.owe.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">{SITTERS.formH2}</h2>
        <p className="text-wbt-mute max-w-2xl mb-6">{SITTERS.formIntro}</p>
        <WbtForm
          subjectPrefix="[WBT sitter]"
          submitLabel={SITTERS.submit}
          success={SITTERS.success}
          error={SITTERS.error}
          extraMessage={(data) =>
            data.get("weekly") ? "Drinks coffee at least weekly: yes" : ""
          }
        >
          <Field name="name" label={SITTERS.name} required />
          <Field name="email" label={SITTERS.email} type="email" required />
          <Field name="city" label={SITTERS.city} />
          <Check name="weekly" label={SITTERS.weekly} required />
          <Field name="note" label={SITTERS.note} as="textarea" />
        </WbtForm>
      </section>
    </PageShell>
  );
}

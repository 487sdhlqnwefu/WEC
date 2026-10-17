import { useState } from "react";
import { CONTACT, CONTACT_EMAIL } from "../copy";
import { PageShell } from "../WbtLayout";
import { Field, WbtForm } from "../WbtForm";

export default function WbtContact() {
  const [about, setAbout] = useState<string>(CONTACT.aboutOptions[0].value);

  return (
    <PageShell title={CONTACT.h1} lede={CONTACT.lede}>
      <p>
        <a className="text-wbt-brown hover:underline" href={`mailto:${CONTACT_EMAIL}`}>
          {CONTACT.email}
        </a>
      </p>
      <WbtForm
        subjectPrefix={`[WBT contact] ${about}`}
        submitLabel={CONTACT.submit}
        success={CONTACT.success}
        error={CONTACT.error}
        extraMessage={(data) => `About: ${String(data.get("about") || about)}`}
      >
        <Field name="name" label={CONTACT.name} required />
        <Field name="email" label={CONTACT.emailLabel} type="email" required />
        <label className="block">
          <span className="block text-sm font-medium mb-1">{CONTACT.about}</span>
          <select
            name="about"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="w-full rounded-md border border-wbt-line bg-wbt-cream px-3 py-2 text-sm"
          >
            {CONTACT.aboutOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
        {about === "Unpaid kit loan" ? (
          <p className="text-sm text-wbt-mute">{CONTACT.kitHint}</p>
        ) : null}
        {about === "Silent-path till" ? (
          <p className="text-sm text-wbt-mute">{CONTACT.posHint}</p>
        ) : null}
        <Field name="message" label={CONTACT.message} as="textarea" required />
      </WbtForm>
    </PageShell>
  );
}

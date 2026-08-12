/**
 * Submit forms on static Netlify hosting (no /api/trpc backend).
 * Requires matching hidden forms in public/forms.html at deploy time.
 */
export async function submitNetlifyForm(
  formName: string,
  fields: Record<string, string>,
): Promise<void> {
  const body = new URLSearchParams({
    "form-name": formName,
    ...fields,
  });

  const res = await fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    throw new Error(
      "Could not send your form. Please email hello@worldespressochampionship.com",
    );
  }
}

export function formDataToRecord(formData: FormData): Record<string, string> {
  const out: Record<string, string> = {};
  formData.forEach((value, key) => {
    if (key === "bot-field") return;
    out[key] = String(value);
  });
  return out;
}

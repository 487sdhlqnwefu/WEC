import { useState, type FormEvent, type ReactNode } from "react";
import { toast } from "sonner";
import { trpc } from "@/providers/trpc";

type Props = {
  subjectPrefix: string;
  submitLabel: string;
  success: string;
  error: string;
  children: ReactNode;
  extraMessage?: (form: FormData) => string;
};

export function WbtForm({
  subjectPrefix,
  submitLabel,
  success,
  error,
  children,
  extraMessage,
}: Props) {
  const [pending, setPending] = useState(false);
  const createContact = trpc.contacts.create.useMutation();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const city = String(data.get("city") || "").trim();
    const note = String(data.get("note") || data.get("message") || "").trim();
    const extras = extraMessage?.(data) ?? "";
    const message = [extras, note].filter(Boolean).join("\n\n") || "Interest registered.";

    setPending(true);
    try {
      await createContact.mutateAsync({
        type: "general",
        name,
        email,
        subject: `${subjectPrefix}${city ? ` ${city}` : ""}`.slice(0, 255),
        message,
        company: city || undefined,
      });
      toast.success(success);
      form.reset();
    } catch {
      toast.error(error);
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-xl">
      {children}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center bg-wbt-gold text-wbt-paper px-5 py-2.5 text-xs uppercase tracking-[0.16em] font-medium hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}

export function Field({
  name,
  label,
  type = "text",
  required,
  as = "input",
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  as?: "input" | "textarea";
}) {
  const cls =
    "w-full rounded-md border border-wbt-line bg-wbt-cream px-3 py-2 text-sm text-wbt-ink placeholder:text-wbt-mute/70";
  return (
    <label className="block">
      <span className="block text-sm font-medium mb-1">
        {label}
        {required ? " *" : ""}
      </span>
      {as === "textarea" ? (
        <textarea name={name} required={required} rows={4} className={cls} />
      ) : (
        <input name={name} type={type} required={required} className={cls} />
      )}
    </label>
  );
}

export function Check({ name, label, required }: { name: string; label: string; required?: boolean }) {
  return (
    <label className="flex items-start gap-2 text-sm">
      <input
        name={name}
        type="checkbox"
        value="yes"
        required={required}
        className="mt-1"
      />
      <span>
        {label}
        {required ? " *" : ""}
      </span>
    </label>
  );
}

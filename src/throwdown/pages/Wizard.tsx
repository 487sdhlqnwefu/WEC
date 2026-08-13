import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { classifyCompetitorCount } from "@throwdown/tiers";

const steps = ["Host", "Coffee", "Format", "Review"];

export default function ThrowdownWizard() {
  const navigate = useNavigate();
  const { data: me } = trpc.throwdown.me.useQuery();
  const [step, setStep] = useState(0);
  const [expected, setExpected] = useState(4);
  const [form, setForm] = useState({
    name: "",
    hostName: "",
    hostLogoUrl: "",
    timezone: "UTC",
    venue: "",
    city: "",
    country: "",
    description: "",
    coffeeName: "",
    coffeeType: "blend" as "blend" | "single_origin",
    coffeeNotes: "",
    espressoMachine: "",
    grinder: "",
    basket: "",
    waterSpec: "",
    otherControls: "",
    judgingFormat: "wec_v3" as "wec_v3" | "simple_ab",
    judgeCount: 3,
  });
  const tier = useMemo(() => classifyCompetitorCount(expected), [expected]);
  const create = trpc.throwdown.createEvent.useMutation({
    onSuccess: (event) => navigate(`/throwdown/events/${event.id}`),
    onError: (err) => toast.error(err.message),
  });
  const validateLogo = trpc.throwdown.validateLogo.useMutation();

  if (!me) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <h1 className="text-2xl font-semibold text-sand-100">Create a free member profile first</h1>
        <Button className="mt-6 bg-cinnamon-600" onClick={() => navigate("/throwdown/sign-in")}>
          Sign in
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.2em] text-cinnamon-400">
        Setup {step + 1} of {steps.length} · {steps[step]}
      </p>
      <div className="mt-3 flex gap-1" aria-hidden>
        {steps.map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded ${i <= step ? "bg-cinnamon-500" : "bg-[#3a2a1f]"}`} />
        ))}
      </div>
      <h1 className="mt-6 text-3xl font-bold text-sand-100">Event setup</h1>

      {step === 0 && (
        <div className="mt-8 space-y-4">
          <Field label="Event name" value={form.name} onChange={(name) => setForm({ ...form, name })} />
          <Field label="Host café, roaster, or organisation" value={form.hostName} onChange={(hostName) => setForm({ ...form, hostName })} />
          <Field label="Host logo URL (optional)" value={form.hostLogoUrl} onChange={(hostLogoUrl) => setForm({ ...form, hostLogoUrl })} />
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            aria-label="Upload host logo"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              try {
                await validateLogo.mutateAsync({ mime: file.type, size: file.size });
                toast.success("Logo file looks safe. Paste a hosted URL for now, or keep this file for later S3 upload.");
              } catch (err) {
                toast.error(err instanceof Error ? err.message : "Logo rejected");
              }
            }}
          />
          <Field label="IANA timezone" value={form.timezone} onChange={(timezone) => setForm({ ...form, timezone })} />
          <Field label="Venue" value={form.venue} onChange={(venue) => setForm({ ...form, venue })} />
          <Field label="City" value={form.city} onChange={(city) => setForm({ ...form, city })} />
          <Field label="Country" value={form.country} onChange={(country) => setForm({ ...form, country })} />
          <div>
            <Label>Public description</Label>
            <Textarea className="mt-1 bg-[#1a1410]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="mt-8 space-y-4">
          <Field label="Coffee name" value={form.coffeeName} onChange={(coffeeName) => setForm({ ...form, coffeeName })} />
          <label className="block text-sm">
            Coffee type
            <select
              className="mt-1 w-full rounded-md border border-[#3a2a1f] bg-[#1a1410] p-2"
              value={form.coffeeType}
              onChange={(e) => setForm({ ...form, coffeeType: e.target.value as "blend" | "single_origin" })}
            >
              <option value="blend">Blend</option>
              <option value="single_origin">Single origin</option>
            </select>
          </label>
          <Field label="Producer / origin / process / roaster notes" value={form.coffeeNotes} onChange={(coffeeNotes) => setForm({ ...form, coffeeNotes })} />
          <Field label="Espresso machine" value={form.espressoMachine} onChange={(espressoMachine) => setForm({ ...form, espressoMachine })} />
          <Field label="Grinder" value={form.grinder} onChange={(grinder) => setForm({ ...form, grinder })} />
          <Field label="Basket" value={form.basket} onChange={(basket) => setForm({ ...form, basket })} />
          <Field label="Water specification" value={form.waterSpec} onChange={(waterSpec) => setForm({ ...form, waterSpec })} />
          <Field label="Other shared controls" value={form.otherControls} onChange={(otherControls) => setForm({ ...form, otherControls })} />
        </div>
      )}

      {step === 2 && (
        <div className="mt-8 space-y-4">
          <label className="block text-sm">
            Expected competitors
            <Input
              type="number"
              inputMode="numeric"
              min={2}
              max={64}
              className="mt-1 bg-[#1a1410]"
              value={expected}
              onChange={(e) => setExpected(Number(e.target.value))}
            />
          </label>
          <div className="wec-card p-4 text-sm text-sand-300">
            {tier.ok ? (
              <p>
                {tier.tier === "free"
                  ? "This is a Free Espresso Throwdown (2–4 competitors)."
                  : "This is a Premium Espresso Tournament. The licence is USD 300 once for this event."}
              </p>
            ) : (
              <p>{tier.message}</p>
            )}
          </div>
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">Judging format</legend>
            <label className="flex gap-2 text-sm">
              <input
                type="radio"
                name="format"
                checked={form.judgingFormat === "wec_v3"}
                onChange={() => setForm({ ...form, judgingFormat: "wec_v3", judgeCount: 3 })}
              />
              Official WEC Scoring v3 — exactly 3 judges. Tactile 15, Taste 10, Flavour 8.
            </label>
            <label className="flex gap-2 text-sm">
              <input
                type="radio"
                name="format"
                checked={form.judgingFormat === "simple_ab"}
                onChange={() => setForm({ ...form, judgingFormat: "simple_ab", judgeCount: 3 })}
              />
              Simple Blind A/B — 1, 3, or 5 judges choose the better cup.
            </label>
          </fieldset>
          {form.judgingFormat === "simple_ab" && (
            <label className="block text-sm">
              Judges per heat
              <select
                className="mt-1 w-full rounded-md border border-[#3a2a1f] bg-[#1a1410] p-2"
                value={form.judgeCount}
                onChange={(e) => setForm({ ...form, judgeCount: Number(e.target.value) })}
              >
                <option value={1}>1</option>
                <option value={3}>3</option>
                <option value={5}>5</option>
              </select>
            </label>
          )}
        </div>
      )}

      {step === 3 && (
        <div className="mt-8 space-y-3 text-sm text-sand-300">
          <p><strong className="text-sand-100">{form.name}</strong> hosted by {form.hostName}</p>
          <p>Coffee: {form.coffeeName} ({form.coffeeType.replace("_", " ")})</p>
          <p>
            {tier.ok && tier.tier === "premium" ? "Premium Espresso Tournament · USD 300" : "Free Espresso Throwdown"}
          </p>
          <p>
            {form.judgingFormat === "wec_v3" ? "Official WEC Scoring v3" : "Simple Blind A/B"} · {form.judgeCount} judges per heat
          </p>
          <p>You will invite competitors, the Cup Steward, and judges on the organiser desk after this draft is created.</p>
        </div>
      )}

      <div className="mt-10 flex justify-between">
        <Button variant="outline" disabled={step === 0} onClick={() => setStep(step - 1)}>
          Back
        </Button>
        {step < 3 ? (
          <Button className="bg-cinnamon-600 text-sand-100" onClick={() => setStep(step + 1)}>
            Continue
          </Button>
        ) : (
          <Button
            className="bg-cinnamon-600 text-sand-100"
            disabled={!tier.ok || create.isPending}
            onClick={() =>
              create.mutate({
                name: form.name,
                hostName: form.hostName,
                hostLogoUrl: form.hostLogoUrl || null,
                timezone: form.timezone,
                venue: form.venue || null,
                city: form.city || null,
                country: form.country || null,
                description: form.description || null,
                coffeeName: form.coffeeName,
                coffeeType: form.coffeeType,
                coffeeNotes: form.coffeeNotes || null,
                espressoMachine: form.espressoMachine || null,
                grinder: form.grinder || null,
                basket: form.basket || null,
                waterSpec: form.waterSpec || null,
                otherControls: form.otherControls || null,
                tier: tier.ok ? tier.tier : "free",
                judgingFormat: form.judgingFormat,
                judgeCount: form.judgingFormat === "wec_v3" ? 3 : form.judgeCount,
              })
            }
          >
            {create.isPending ? "Creating…" : "Create draft"}
          </Button>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <Input className="mt-1 bg-[#1a1410]" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

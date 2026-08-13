import { useEffect, useState } from "react";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router";

export default function ThrowdownProfile() {
  const navigate = useNavigate();
  const { data: me, isLoading } = trpc.throwdown.me.useQuery();
  const utils = trpc.useUtils();
  const [form, setForm] = useState({
    displayName: "",
    country: "",
    city: "",
    organisation: "",
    roleTitle: "",
  });
  useEffect(() => {
    if (me) {
      setForm({
        displayName: me.displayName,
        country: me.country,
        city: me.city ?? "",
        organisation: me.organisation ?? "",
        roleTitle: me.roleTitle ?? "",
      });
    }
  }, [me]);
  const save = trpc.throwdown.updateProfile.useMutation({
    onSuccess: async () => {
      await utils.throwdown.me.invalidate();
      toast.success("Profile saved");
    },
    onError: (err) => toast.error(err.message),
  });
  if (isLoading) return <p className="p-8 text-sand-400">Loading profile…</p>;
  if (!me) {
    navigate("/throwdown/sign-in");
    return null;
  }
  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="text-3xl font-bold text-sand-100">Member profile</h1>
      <p className="mt-2 text-sm text-sand-500">{me.email}</p>
      <form
        className="mt-8 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate({
            ...form,
            city: form.city || null,
            organisation: form.organisation || null,
            roleTitle: form.roleTitle || null,
          });
        }}
      >
        <Field label="Display name" value={form.displayName} onChange={(v) => setForm({ ...form, displayName: v })} />
        <Field label="Country" value={form.country} onChange={(v) => setForm({ ...form, country: v })} />
        <Field label="City (optional)" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
        <Field label="Café / roaster / organisation" value={form.organisation} onChange={(v) => setForm({ ...form, organisation: v })} />
        <Field label="Coffee role / title" value={form.roleTitle} onChange={(v) => setForm({ ...form, roleTitle: v })} />
        <Button type="submit" className="bg-cinnamon-600 text-sand-100" disabled={save.isPending}>
          Save profile
        </Button>
      </form>
      <Link to="/throwdown/dashboard" className="mt-6 inline-block text-sm text-sand-400 hover:text-sand-200">
        Back to my events
      </Link>
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

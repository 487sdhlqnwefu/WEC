import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function WlatProfile() {
  const me = trpc.wlat.me.useQuery();
  const update = trpc.wlat.updateProfile.useMutation();
  const member = me.data?.member;
  const [bio, setBio] = useState("");
  if (!member) return <div className="p-10">Sign in to edit your profile.</div>;
  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">Member profile</h1>
      <label className="text-sm">Display name</label>
      <Input defaultValue={member.displayName} id="dn" className="mb-3 bg-[#1b140f] border-[#3a2a1f]" />
      <label className="text-sm">Public bio</label>
      <Textarea value={bio || member.publicBio || ""} onChange={(e) => setBio(e.target.value)} className="mb-3 bg-[#1b140f] border-[#3a2a1f]" />
      <Button
        className="bg-cinnamon-600"
        onClick={() =>
          update.mutate({
            displayName: (document.getElementById("dn") as HTMLInputElement).value,
            publicBio: bio,
            publicProfileConsent: true,
          })
        }
      >
        Save
      </Button>
    </div>
  );
}

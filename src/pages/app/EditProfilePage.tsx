import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Camera } from "lucide-react";
import { Avatar, Button, Input, Textarea } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/Toast";

export function EditProfilePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    fullName: user.fullName,
    headline: user.headline,
    location: user.location,
    organisationName: user.organisationName ?? "",
    about: user.about ?? "",
  });
  const [saving, setSaving] = useState(false);

  const save = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast("Profile updated.", "success");
      navigate(`/profile/${user.username}`);
    }, 500);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold text-navy-800">Edit profile</h1>
      <p className="mt-1 text-sm text-ink-600">Keep your professional identity accurate and up to date.</p>

      <div className="mt-6 rounded-xl border border-ink-100 bg-white p-5 shadow-card space-y-5">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar src={user.avatarUrl} name={user.fullName} size="xl" />
            <button className="absolute bottom-0 right-0 rounded-full bg-navy-700 p-1.5 text-white" aria-label="Change photo" onClick={() => toast("Photo upload is available once Supabase Storage is connected.", "info")}>
              <Camera size={14} />
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-navy-800">Profile photo</p>
            <p className="text-xs text-ink-500">JPG or PNG, up to 5MB.</p>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">Full name</label>
          <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">Professional headline</label>
          <Input value={form.headline} onChange={(e) => setForm({ ...form, headline: e.target.value })} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">Location</label>
            <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">Organisation</label>
            <Input value={form.organisationName} onChange={(e) => setForm({ ...form, organisationName: e.target.value })} />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink-700">About</label>
          <Textarea rows={5} value={form.about} onChange={(e) => setForm({ ...form, about: e.target.value })} />
        </div>

        <div className="flex justify-end gap-2 border-t border-ink-100 pt-4">
          <Button variant="secondary" onClick={() => navigate(-1)}>Cancel</Button>
          <Button onClick={save} loading={saving}>Save changes</Button>
        </div>
      </div>
    </div>
  );
}

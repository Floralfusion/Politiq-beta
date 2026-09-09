import { useState } from "react";
import { Bell, Lock, Trash2, ShieldCheck, CreditCard } from "lucide-react";
import { Button, ConfirmDialog, Badge } from "@/components/ui";
import { useAuth } from "@/hooks/useAuth";
import { useDemoStore } from "@/demo/store";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/Toast";
import { formatINR } from "@/lib/utils";

const notifPrefs = ["Connection requests", "Messages", "Contact requests", "Verification updates", "Job matches", "Event reminders"];

export function SettingsPage() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const subscriptions = useDemoStore((s) => s.subscriptions);
  const resetDemoData = useDemoStore((s) => s.resetDemoData);
  const [prefs, setPrefs] = useState<Record<string, boolean>>(Object.fromEntries(notifPrefs.map((p) => [p, true])));
  const [deleteOpen, setDeleteOpen] = useState(false);

  const sub = subscriptions[0];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold text-navy-800">Settings</h1>

      <section className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">
        <h2 className="flex items-center gap-2 font-semibold text-navy-800 text-sm mb-4"><Bell size={16} /> Notification preferences</h2>
        <div className="space-y-3">
          {notifPrefs.map((p) => (
            <label key={p} className="flex items-center justify-between text-sm text-ink-700">
              {p}
              <input
                type="checkbox"
                checked={prefs[p]}
                onChange={(e) => setPrefs({ ...prefs, [p]: e.target.checked })}
                className="h-4 w-4 rounded border-ink-300 text-navy-700 focus:ring-navy-500"
              />
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">
        <h2 className="flex items-center gap-2 font-semibold text-navy-800 text-sm mb-4"><CreditCard size={16} /> Subscription</h2>
        {sub ? (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-ink-700">POLITIQ Verified — {formatINR(sub.priceInPaise)}/month</p>
              <p className="text-xs text-ink-400">Renews {sub.renewsAt}</p>
            </div>
            <Badge tone="success">Active</Badge>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-sm text-ink-600">No active subscription.</p>
            <Button size="sm" onClick={() => navigate("/pricing")}><ShieldCheck size={14} /> Get Verified</Button>
          </div>
        )}
      </section>

      <section className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">
        <h2 className="flex items-center gap-2 font-semibold text-navy-800 text-sm mb-4"><Lock size={16} /> Privacy</h2>
        <p className="text-sm text-ink-600">POLITIQ never shares your private contact details without your explicit approval and confirmed payment.</p>
        <Button variant="secondary" size="sm" className="mt-3" onClick={() => { resetDemoData(); toast("Demo data reset.", "info"); }}>
          Reset demo data
        </Button>
      </section>

      <section className="rounded-xl border border-danger-100 bg-white p-5 shadow-card">
        <h2 className="flex items-center gap-2 font-semibold text-danger-600 text-sm mb-2"><Trash2 size={16} /> Delete account</h2>
        <p className="text-sm text-ink-600">This permanently removes your profile, connections and messages. This cannot be undone.</p>
        <Button variant="danger" size="sm" className="mt-3" onClick={() => setDeleteOpen(true)}>Delete my account</Button>
      </section>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => { signOut(); setDeleteOpen(false); navigate("/"); toast("Account deleted.", "info"); }}
        title="Delete your account?"
        description="This action is permanent and cannot be undone. All your data will be removed."
        confirmLabel="Delete account"
        destructive
      />
    </div>
  );
}

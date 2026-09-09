import { useState } from "react";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button, Input, Badge } from "@/components/ui";
import { useDemoStore } from "@/demo/store";
import { toast } from "@/components/ui/Toast";
import { adminUsers } from "@/demo/seedData";
import { formatINR } from "@/lib/utils";
import { PAYMENTS_DEMO_MODE } from "@/constants/config";

export function AdminSettingsPage() {
  const plan = useDemoStore((s) => s.pricingPlans[0]);
  const updatePricingPlan = useDemoStore((s) => s.updatePricingPlan);
  const [priceRupees, setPriceRupees] = useState(String(plan.priceInPaise / 100));
  const [benefitsText, setBenefitsText] = useState(plan.benefits.join("\n"));

  const save = () => {
    const paise = Math.round(parseFloat(priceRupees) * 100);
    if (isNaN(paise) || paise <= 0) {
      toast("Enter a valid price.", "error");
      return;
    }
    updatePricingPlan(plan.id, paise, benefitsText.split("\n").filter(Boolean));
    toast("Pricing updated. This now reflects live on /pricing.", "success");
  };

  return (
    <div className="max-w-2xl space-y-6">
      <AdminPageHeader title="Settings" description="Platform-wide configuration." />

      <section className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">
        <h2 className="font-semibold text-navy-800 text-sm mb-1">POLITIQ Verified pricing</h2>
        <p className="text-xs text-ink-500 mb-4">Configurable from here rather than hard-coded — reflects immediately on the public pricing page.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">Monthly price (INR)</label>
            <Input value={priceRupees} onChange={(e) => setPriceRupees(e.target.value)} inputMode="decimal" />
            <p className="mt-1 text-xs text-ink-400">Current: {formatINR(plan.priceInPaise)}/month</p>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-700">Benefits (one per line)</label>
            <textarea value={benefitsText} onChange={(e) => setBenefitsText(e.target.value)} rows={4} className="w-full rounded-lg border border-ink-200 px-3 py-2 text-sm outline-none focus:border-navy-500" />
          </div>
        </div>
        <Button className="mt-4" size="sm" onClick={save}>Save pricing</Button>
      </section>

      <section className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">
        <h2 className="font-semibold text-navy-800 text-sm mb-3">Payment provider</h2>
        <div className="flex items-center justify-between text-sm">
          <span className="text-ink-600">Cashfree</span>
          <Badge tone={PAYMENTS_DEMO_MODE ? "warning" : "success"}>{PAYMENTS_DEMO_MODE ? "Demo mode" : "Live"}</Badge>
        </div>
        <p className="mt-2 text-xs text-ink-400">
          Set CASHFREE_APP_ID / CASHFREE_SECRET_KEY as server-only environment variables and VITE_PAYMENTS_DEMO_MODE=false to go live. Secret keys are never exposed to the browser.
        </p>
      </section>

      <section className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">
        <h2 className="font-semibold text-navy-800 text-sm mb-3">Admin roles (RBAC)</h2>
        <div className="space-y-2">
          {adminUsers.map((a) => (
            <div key={a.id} className="flex items-center justify-between text-sm">
              <span className="text-ink-700">{a.name} <span className="text-ink-400">({a.email})</span></span>
              <Badge tone="navy">{a.role.replaceAll("_", " ")}</Badge>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-ink-400">Roles are enforced server-side in Supabase Edge Functions and RLS policies — never only in the UI.</p>
      </section>
    </div>
  );
}

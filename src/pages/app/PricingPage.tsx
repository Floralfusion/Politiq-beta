import { useState } from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { Button, Badge } from "@/components/ui";
import { PaymentModal } from "@/components/PaymentModal";
import { useDemoStore } from "@/demo/store";
import { formatINR } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/components/ui/Toast";

/**
 * Pricing is intentionally read from the demo store (which stands in for `system_settings` /
 * a `pricing_plans` table) rather than hard-coded, so admins can change the price from
 * /admin/settings and it reflects here immediately — see requirement #21.
 */
export function PricingPage() {
  const plan = useDemoStore((s) => s.pricingPlans[0]);
  const subscriptions = useDemoStore((s) => s.subscriptions);
  const { user } = useAuth();
  const [payOpen, setPayOpen] = useState(false);

  const isSubscribed = subscriptions.some((s) => s.profileId === user.id && s.status === "ACTIVE");

  return (
    <div className="container-page py-12 sm:py-16">
      <div className="text-center max-w-xl mx-auto">
        <ShieldCheck className="mx-auto text-navy-700" size={32} />
        <h1 className="mt-4 text-3xl font-semibold text-navy-800">POLITIQ Verified</h1>
        <p className="mt-2 text-ink-600">Stand out with a verified badge, priority verification review and higher visibility across POLITIQ.</p>
      </div>

      <div className="mx-auto mt-10 max-w-md rounded-2xl border border-navy-100 bg-white p-8 shadow-raised">
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-semibold text-navy-800">{formatINR(plan.priceInPaise)}</span>
          <span className="text-ink-500">/{plan.billingPeriod}</span>
        </div>
        <ul className="mt-6 space-y-3">
          {plan.benefits.map((b) => (
            <li key={b} className="flex items-start gap-2.5 text-sm text-ink-700">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-success-500" /> {b}
            </li>
          ))}
        </ul>

        {isSubscribed ? (
          <div className="mt-7 text-center">
            <Badge tone="success">Active subscription</Badge>
            <p className="mt-2 text-xs text-ink-500">Renews {subscriptions[0]?.renewsAt}</p>
          </div>
        ) : (
          <Button className="mt-7 w-full" size="lg" onClick={() => setPayOpen(true)}>
            Subscribe with Cashfree
          </Button>
        )}
        <p className="mt-3 text-center text-[11px] text-ink-400">Billed monthly via Cashfree. Cancel anytime from Settings.</p>
      </div>

      <PaymentModal
        open={payOpen}
        onClose={() => setPayOpen(false)}
        purpose="POLITIQ_VERIFIED_SUBSCRIPTION"
        amountInPaise={plan.priceInPaise}
        description="POLITIQ Verified — monthly subscription"
        onSuccess={() => {
          setPayOpen(false);
          toast("Subscription activated. Your verified badge will appear once identity/professional verification is approved.", "success");
        }}
      />
    </div>
  );
}

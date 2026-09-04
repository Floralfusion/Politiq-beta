import { useState } from "react";
import { ShieldCheck, Loader2, CreditCard } from "lucide-react";
import { Modal, Button, Badge } from "@/components/ui";
import { formatINR } from "@/lib/utils";
import { paymentService } from "@/services/paymentService";
import { PAYMENTS_DEMO_MODE } from "@/constants/config";
import { toast } from "@/components/ui/Toast";
import type { PaymentRecord } from "@/types";

export function PaymentModal({
  open,
  onClose,
  purpose,
  amountInPaise,
  description,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  purpose: PaymentRecord["purpose"];
  amountInPaise: number;
  description: string;
  onSuccess: () => void;
}) {
  const [status, setStatus] = useState<"idle" | "processing" | "success">("idle");

  const pay = async () => {
    setStatus("processing");
    try {
      const order = await paymentService.createOrder({ purpose, amountInPaise, profileName: description });
      if (order.status === "SUCCESS") {
        setStatus("success");
        toast("Payment confirmed by server.", "success");
        setTimeout(() => {
          onSuccess();
          setStatus("idle");
        }, 900);
      }
    } catch {
      setStatus("idle");
      toast("Payment failed. Please try again.", "error");
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Complete payment">
      <div className="flex items-center gap-2 mb-3">
        <CreditCard size={16} className="text-navy-700" />
        <span className="text-sm font-medium text-navy-800">Cashfree Payments</span>
        {PAYMENTS_DEMO_MODE && <Badge tone="warning">Demo mode</Badge>}
      </div>
      <p className="text-sm text-ink-600">{description}</p>
      <div className="mt-4 flex items-center justify-between rounded-lg bg-ink-50 p-3">
        <span className="text-sm text-ink-600">Amount payable</span>
        <span className="text-lg font-semibold text-navy-800">{formatINR(amountInPaise)}</span>
      </div>
      {PAYMENTS_DEMO_MODE && (
        <p className="mt-3 text-xs text-ink-400">
          This is a simulated Cashfree transaction for the Beta demo — no real charge is made. Once real
          CASHFREE_APP_ID / CASHFREE_SECRET_KEY are added and demo mode is turned off, this button launches
          the real Cashfree Checkout, and confirmation only happens after the server verifies Cashfree's webhook.
        </p>
      )}
      <Button className="mt-5 w-full" onClick={pay} loading={status === "processing"} disabled={status === "success"}>
        {status === "success" ? (
          <><ShieldCheck size={16} /> Payment confirmed</>
        ) : status === "processing" ? (
          <><Loader2 size={16} className="animate-spin" /> Processing with Cashfree...</>
        ) : (
          `Pay ${formatINR(amountInPaise)}`
        )}
      </Button>
    </Modal>
  );
}

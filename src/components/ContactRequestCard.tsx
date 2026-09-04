import { Link } from "react-router-dom";
import type { ContactRequest } from "@/types";
import { Avatar, Badge, Button, VerificationBadge } from "@/components/ui";
import { formatINR, timeAgo } from "@/lib/utils";

const statusTone: Record<ContactRequest["status"], "navy" | "success" | "warning" | "danger" | "neutral"> = {
  REQUESTED: "warning",
  APPROVED: "navy",
  DECLINED: "danger",
  EXPIRED: "neutral",
  CANCELLED: "neutral",
  PAYMENT_PENDING: "warning",
  PAID: "navy",
  CONTACT_UNLOCKED: "success",
};

export function ContactRequestCard({
  request,
  direction,
  onApprove,
  onDecline,
  onPay,
}: {
  request: ContactRequest;
  direction: "incoming" | "outgoing";
  onApprove?: () => void;
  onDecline?: () => void;
  onPay?: () => void;
}) {
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-4 shadow-card">
      <div className="flex items-start gap-3">
        <Link to={`/profile/${request.recipient.username}`}>
          <Avatar src={request.recipient.avatarUrl} name={request.recipient.fullName} size="md" />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <p className="truncate font-semibold text-navy-800 text-sm">{request.recipient.fullName}</p>
          </div>
          <p className="truncate text-xs text-ink-500">{request.recipient.headline}</p>
          <p className="mt-1 text-xs text-ink-400">{timeAgo(request.createdAt)}</p>
        </div>
        <Badge tone={statusTone[request.status]}>{request.status.replaceAll("_", " ")}</Badge>
      </div>
      {request.message && <p className="mt-3 rounded-lg bg-ink-50 p-3 text-sm text-ink-600">{request.message}</p>}
      <div className="mt-3 flex items-center justify-between">
        <p className="text-sm text-ink-500">Access fee: <span className="font-medium text-navy-800">{formatINR(request.feeInPaise)}</span></p>
        <div className="flex gap-2">
          {direction === "incoming" && request.status === "REQUESTED" && (
            <>
              <Button size="sm" onClick={onApprove}>Approve</Button>
              <Button size="sm" variant="secondary" onClick={onDecline}>Decline</Button>
            </>
          )}
          {direction === "outgoing" && request.status === "APPROVED" && (
            <Button size="sm" onClick={onPay}>
              Pay {formatINR(request.feeInPaise)} to unlock
            </Button>
          )}
          {direction === "outgoing" && request.status === "CONTACT_UNLOCKED" && (
            <VerificationBadge size={14} />
          )}
        </div>
      </div>
    </div>
  );
}

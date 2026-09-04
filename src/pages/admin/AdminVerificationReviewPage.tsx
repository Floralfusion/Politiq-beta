import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FileText } from "lucide-react";
import { Button, Textarea, EmptyState, Badge } from "@/components/ui";
import { useDemoStore } from "@/demo/store";
import { profiles } from "@/demo/seedData";
import { toast } from "@/components/ui/Toast";

export function AdminVerificationReviewPage() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const requests = useDemoStore((s) => s.verificationRequests);
  const adminReviewVerification = useDemoStore((s) => s.adminReviewVerification);
  const [reason, setReason] = useState("");
  const request = requests.find((r) => r.id === requestId);
  const user = profiles[0];

  if (!request) return <EmptyState title="Verification request not found" />;

  return (
    <div className="max-w-xl">
      <div className="rounded-xl border border-ink-100 bg-white p-6 shadow-card">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-navy-800">{user.fullName} — {request.type.charAt(0) + request.type.slice(1).toLowerCase()} verification</p>
          <Badge tone="warning">{request.status.replaceAll("_", " ")}</Badge>
        </div>
        <div className="mt-4 space-y-2">
          {request.documents.length === 0 ? (
            <p className="text-sm text-ink-500">No documents submitted.</p>
          ) : (
            request.documents.map((d) => (
              <p key={d.id} className="flex items-center gap-1.5 text-sm text-ink-700"><FileText size={14} /> {d.fileName}</p>
            ))
          )}
        </div>
        <div className="mt-5">
          <label className="mb-1.5 block text-sm font-medium text-ink-700">Rejection reason (if declining)</label>
          <Textarea rows={3} value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Explain what's missing or incorrect..." />
        </div>
        <div className="mt-5 flex gap-2">
          <Button
            onClick={() => { adminReviewVerification(request.id, true); toast("Verification approved. Badge will appear on the user's profile.", "success"); navigate("/admin/verifications"); }}
          >
            Approve
          </Button>
          <Button
            variant="danger"
            onClick={() => { adminReviewVerification(request.id, false, reason || "Documents did not meet requirements."); toast("Verification rejected.", "info"); navigate("/admin/verifications"); }}
          >
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
}

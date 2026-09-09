import { useRef, useState } from "react";
import { ShieldCheck, FileText, UploadCloud, Clock, XCircle, AlertCircle } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { useDemoStore } from "@/demo/store";
import { toast } from "@/components/ui/Toast";
import type { VerificationRequest, VerificationStatus } from "@/types";

const typeCopy: Record<VerificationRequest["type"], { title: string; description: string; requirements: string[] }> = {
  IDENTITY: { title: "Identity verification", description: "Confirm you are who you say you are.", requirements: ["Government-issued photo ID", "Selfie for liveness match"] },
  PROFESSIONAL: { title: "Professional verification", description: "Confirm your current professional role.", requirements: ["Employment letter or offer letter", "Official email or ID card"] },
  ORGANISATION: { title: "Organisation verification", description: "Confirm your affiliation with an organisation.", requirements: ["Authorization letter", "Organisation registration document"] },
  EXPERIENCE: { title: "Experience verification", description: "Confirm past roles listed on your profile.", requirements: ["Relieving/experience letter", "Reference contact (optional)"] },
};

const statusTone: Record<VerificationStatus, "neutral" | "warning" | "success" | "danger" | "navy"> = {
  NOT_STARTED: "neutral",
  DRAFT: "neutral",
  SUBMITTED: "warning",
  UNDER_REVIEW: "warning",
  VERIFIED: "success",
  REJECTED: "danger",
  NEEDS_MORE_INFORMATION: "warning",
  EXPIRED: "neutral",
};

function StatusIcon({ status }: { status: VerificationStatus }) {
  if (status === "VERIFIED") return <ShieldCheck size={18} className="text-success-500" />;
  if (status === "REJECTED") return <XCircle size={18} className="text-danger-500" />;
  if (status === "UNDER_REVIEW" || status === "SUBMITTED") return <Clock size={18} className="text-warning-500" />;
  return <AlertCircle size={18} className="text-ink-400" />;
}

export function VerificationPage() {
  const requests = useDemoStore((s) => s.verificationRequests);
  const submitVerification = useDemoStore((s) => s.submitVerification);
  const [uploadingType, setUploadingType] = useState<VerificationRequest["type"] | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerUpload = (type: VerificationRequest["type"]) => {
    setUploadingType(type);
    fileInputRef.current?.click();
  };

  const onFileChosen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadingType) {
      submitVerification(uploadingType, file.name);
      toast(`Document uploaded. Your ${typeCopy[uploadingType].title.toLowerCase()} is now under review.`, "success");
    }
    e.target.value = "";
    setUploadingType(null);
  };

  const verifiedCount = requests.filter((r) => r.status === "VERIFIED").length;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex items-center gap-3">
        <ShieldCheck size={26} className="text-navy-700" />
        <div>
          <h1 className="text-2xl font-semibold text-navy-800">Verification Centre</h1>
          <p className="text-sm text-ink-600">Build trust with a verified professional identity. {verifiedCount}/{requests.length} verified.</p>
        </div>
      </div>

      <input ref={fileInputRef} type="file" className="hidden" onChange={onFileChosen} accept=".pdf,.jpg,.jpeg,.png" />

      <div className="mt-6 space-y-4">
        {requests.map((r) => (
          <div key={r.id} className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <StatusIcon status={r.status} />
                <div>
                  <p className="font-semibold text-navy-800 text-sm">{typeCopy[r.type].title}</p>
                  <p className="text-xs text-ink-500 mt-0.5">{typeCopy[r.type].description}</p>
                </div>
              </div>
              <Badge tone={statusTone[r.status]}>{r.status.replaceAll("_", " ")}</Badge>
            </div>

            <div className="mt-3 rounded-lg bg-ink-50 p-3">
              <p className="text-xs font-medium text-ink-500 mb-1.5">Requirements</p>
              <ul className="space-y-1">
                {typeCopy[r.type].requirements.map((req) => (
                  <li key={req} className="flex items-center gap-1.5 text-xs text-ink-600"><FileText size={11} /> {req}</li>
                ))}
              </ul>
            </div>

            {r.documents.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {r.documents.map((d) => (
                  <p key={d.id} className="flex items-center gap-1.5 text-xs text-ink-600"><FileText size={12} /> {d.fileName} • uploaded {new Date(d.uploadedAt).toLocaleDateString("en-IN")}</p>
                ))}
              </div>
            )}

            {r.rejectionReason && (
              <p className="mt-3 rounded-lg bg-danger-50 p-3 text-xs text-danger-600">Rejection reason: {r.rejectionReason}</p>
            )}

            <div className="mt-4 flex items-center justify-between text-xs text-ink-400">
              <span>{r.submittedAt ? `Submitted ${new Date(r.submittedAt).toLocaleDateString("en-IN")}` : "Not submitted"}</span>
              {(r.status === "NOT_STARTED" || r.status === "REJECTED" || r.status === "NEEDS_MORE_INFORMATION") && (
                <Button size="sm" onClick={() => triggerUpload(r.type)}>
                  <UploadCloud size={14} /> Upload document
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-6 text-xs text-ink-400">
        Documents are stored privately and are never made public. Only authorised verification reviewers can access them via signed, time-limited URLs.
      </p>
    </div>
  );
}

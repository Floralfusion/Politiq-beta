import { BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export function VerificationBadge({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <span title="Verified on POLITIQ" className={cn("inline-flex text-navy-700", className)}>
      <BadgeCheck size={size} fill="#152A54" className="text-white" strokeWidth={0} />
    </span>
  );
}

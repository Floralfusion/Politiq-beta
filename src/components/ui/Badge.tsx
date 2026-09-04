import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "navy" | "success" | "warning" | "danger" | "neutral" | "gold";

const toneClasses: Record<Tone, string> = {
  navy: "bg-navy-50 text-navy-700",
  success: "bg-success-50 text-success-600",
  warning: "bg-warning-50 text-warning-600",
  danger: "bg-danger-50 text-danger-600",
  neutral: "bg-ink-100 text-ink-600",
  gold: "bg-gold-50 text-gold-600",
};

export function Badge({ children, tone = "neutral", className }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium", toneClasses[tone], className)}>
      {children}
    </span>
  );
}

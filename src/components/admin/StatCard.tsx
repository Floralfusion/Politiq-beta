import type { LucideIcon } from "lucide-react";

export function StatCard({ label, value, icon: Icon, tone = "navy" }: { label: string; value: string | number; icon: LucideIcon; tone?: "navy" | "success" | "warning" | "danger" }) {
  const toneClasses = { navy: "bg-navy-50 text-navy-700", success: "bg-success-50 text-success-600", warning: "bg-warning-50 text-warning-600", danger: "bg-danger-50 text-danger-600" };
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-5 shadow-card">
      <div className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${toneClasses[tone]}`}>
        <Icon size={18} />
      </div>
      <p className="mt-3 text-2xl font-semibold text-navy-800">{value}</p>
      <p className="text-xs text-ink-500">{label}</p>
    </div>
  );
}

import { cn } from "@/lib/utils";

interface TabsProps {
  tabs: { id: string; label: string; count?: number }[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, active, onChange, className }: TabsProps) {
  return (
    <div className={cn("flex items-center gap-1 overflow-x-auto no-scrollbar border-b border-ink-100", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "relative shrink-0 px-3.5 py-2.5 text-sm font-medium transition-colors",
            active === tab.id ? "text-navy-700" : "text-ink-500 hover:text-ink-700"
          )}
        >
          {tab.label}
          {typeof tab.count === "number" && <span className="ml-1.5 text-xs text-ink-400">{tab.count}</span>}
          {active === tab.id && <span className="absolute left-0 right-0 -bottom-px h-0.5 bg-navy-700 rounded-full" />}
        </button>
      ))}
    </div>
  );
}

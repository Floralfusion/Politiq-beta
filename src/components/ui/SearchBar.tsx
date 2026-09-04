import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchBar({
  value,
  onChange,
  placeholder = "Search people, organisations, services, jobs...",
  className,
  onSubmit,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  onSubmit?: () => void;
}) {
  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
      className={cn("relative w-full", className)}
    >
      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
        className="h-10 w-full rounded-lg border border-ink-200 bg-ink-50/60 pl-10 pr-3 text-sm text-ink-900 placeholder:text-ink-400 outline-none transition-colors focus:border-navy-500 focus:bg-white"
      />
    </form>
  );
}

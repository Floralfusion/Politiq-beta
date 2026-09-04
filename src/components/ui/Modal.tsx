import { type ReactNode, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-navy-950/50 animate-fade-in" onClick={onClose} />
      <div className={cn("relative w-full max-w-md rounded-2xl bg-white shadow-popover animate-fade-in", className)}>
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100">
            <h2 className="text-base font-semibold text-navy-800">{title}</h2>
            <button onClick={onClose} aria-label="Close dialog" className="rounded-md p-1 text-ink-400 hover:bg-ink-100 hover:text-ink-600">
              <X size={18} />
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
        {footer && <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-ink-100">{footer}</div>}
      </div>
    </div>
  );
}

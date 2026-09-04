import { type ReactNode, useEffect } from "react";
import { X } from "lucide-react";

export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:hidden" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-navy-950/50 animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white shadow-popover animate-sheet-up">
        <div className="sticky top-0 flex items-center justify-between bg-white px-5 py-4 border-b border-ink-100">
          <span className="mx-auto absolute left-1/2 -translate-x-1/2 -top-2 h-1 w-10 rounded-full bg-ink-200" />
          <h2 className="text-base font-semibold text-navy-800">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded-md p-1 text-ink-400 hover:bg-ink-100">
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

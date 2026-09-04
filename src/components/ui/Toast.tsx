import { create } from "zustand";
import { CheckCircle2, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastItem {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

interface ToastStore {
  toasts: ToastItem[];
  push: (message: string, type?: ToastItem["type"]) => void;
  dismiss: (id: number) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  push: (message, type = "info") =>
    set((s) => {
      const id = Date.now() + Math.random();
      setTimeout(() => set((s2) => ({ toasts: s2.toasts.filter((t) => t.id !== id) })), 3500);
      return { toasts: [...s.toasts, { id, message, type }] };
    }),
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

export function toast(message: string, type: "success" | "error" | "info" = "info") {
  useToastStore.getState().push(message, type);
}

const icons = { success: CheckCircle2, error: XCircle, info: Info };
const iconColors = { success: "text-success-500", error: "text-danger-500", info: "text-navy-600" };

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto z-[100] flex flex-col gap-2 items-end">
      {toasts.map((t) => {
        const Icon = icons[t.type];
        return (
          <div
            key={t.id}
            className={cn(
              "flex w-full sm:w-auto sm:min-w-[280px] max-w-sm items-start gap-2.5 rounded-xl bg-navy-900 text-white px-4 py-3 shadow-popover animate-fade-in"
            )}
          >
            <Icon size={18} className={cn("mt-0.5 shrink-0", iconColors[t.type])} />
            <p className="text-sm leading-snug">{t.message}</p>
          </div>
        );
      })}
    </div>
  );
}

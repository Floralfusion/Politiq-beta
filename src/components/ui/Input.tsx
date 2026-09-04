import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, error, ...props }, ref) => (
  <div className="w-full">
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-lg border bg-white px-3 text-sm text-ink-900 placeholder:text-ink-400 outline-none transition-colors",
        error ? "border-danger-500 focus:border-danger-500" : "border-ink-200 focus:border-navy-500",
        className
      )}
      {...props}
    />
    {error && <p className="mt-1 text-xs text-danger-500">{error}</p>}
  </div>
));
Input.displayName = "Input";

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }>(
  ({ className, error, ...props }, ref) => (
    <div className="w-full">
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-lg border bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 outline-none transition-colors resize-none",
          error ? "border-danger-500 focus:border-danger-500" : "border-ink-200 focus:border-navy-500",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-danger-500">{error}</p>}
    </div>
  )
);
Textarea.displayName = "Textarea";

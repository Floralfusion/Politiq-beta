import { AlertTriangle } from "lucide-react";
import { Button } from "./Button";

export function ErrorState({ message = "Something went wrong.", onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      <AlertTriangle className="h-8 w-8 text-danger-500 mb-3" />
      <h3 className="text-base font-semibold text-navy-800">We couldn't load this</h3>
      <p className="mt-1.5 max-w-sm text-sm text-ink-500">{message}</p>
      {onRetry && (
        <Button className="mt-5" onClick={onRetry} size="sm" variant="secondary">
          Try again
        </Button>
      )}
    </div>
  );
}

import type { ReactNode } from "react";
import { Button } from "./Button";

export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      {icon && <div className="mb-4 text-ink-300">{icon}</div>}
      <h3 className="text-base font-semibold text-navy-800">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-ink-500">{description}</p>}
      {actionLabel && onAction && (
        <Button className="mt-5" onClick={onAction} size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

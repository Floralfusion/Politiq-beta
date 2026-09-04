import { Bell, MessageCircle, UserPlus, UserCheck, ShieldCheck, ShieldAlert, CreditCard, Briefcase, Calendar, Users2 } from "lucide-react";
import type { NotificationItem } from "@/types";
import { Avatar } from "@/components/ui";
import { timeAgo, cn } from "@/lib/utils";

const iconMap: Record<NotificationItem["type"], typeof Bell> = {
  CONNECTION_REQUEST: UserPlus,
  CONNECTION_ACCEPTED: UserCheck,
  MESSAGE: MessageCircle,
  FOLLOW: UserPlus,
  CONTACT_REQUEST: ShieldAlert,
  CONTACT_APPROVED: ShieldCheck,
  PAYMENT_CONFIRMED: CreditCard,
  VERIFICATION_SUBMITTED: ShieldAlert,
  VERIFICATION_APPROVED: ShieldCheck,
  VERIFICATION_REJECTED: ShieldAlert,
  JOB: Briefcase,
  EVENT: Calendar,
  GROUP: Users2,
};

export function NotificationListItem({ notification, onClick }: { notification: NotificationItem; onClick?: () => void }) {
  const Icon = iconMap[notification.type] ?? Bell;
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors hover:bg-ink-50",
        !notification.read && "bg-navy-50/50"
      )}
    >
      {notification.actorAvatarUrl ? (
        <Avatar src={notification.actorAvatarUrl} name={notification.title} size="sm" />
      ) : (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-50 text-navy-700">
          <Icon size={15} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-navy-800">{notification.title}</p>
        <p className="text-sm text-ink-600">{notification.body}</p>
        <p className="mt-0.5 text-xs text-ink-400">{timeAgo(notification.createdAt)}</p>
      </div>
      {!notification.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-navy-600" />}
    </button>
  );
}

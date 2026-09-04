import type { LucideIcon } from "lucide-react";
import {
  Home, Compass, Users, MessageSquare, Briefcase, Calendar, Users2,
  Bookmark, Search, ShieldCheck, User as UserIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
}

export const sidebarPrimaryNav: NavItem[] = [
  { label: "Feed", to: "/home", icon: Home },
  { label: "Discover", to: "/discover", icon: Compass },
  { label: "Network", to: "/network", icon: Users },
  { label: "Messages", to: "/messages", icon: MessageSquare },
  { label: "Jobs", to: "/jobs", icon: Briefcase },
  { label: "Events", to: "/events", icon: Calendar },
  { label: "Groups", to: "/groups", icon: Users2 },
  { label: "Bookmarks", to: "/bookmarks", icon: Bookmark },
  { label: "Saved Searches", to: "/saved-searches", icon: Search },
];

export const topNav: NavItem[] = [
  { label: "Home", to: "/home", icon: Home },
  { label: "Network", to: "/network", icon: Users },
  { label: "Jobs", to: "/jobs", icon: Briefcase },
  { label: "Messaging", to: "/messages", icon: MessageSquare },
];

export const mobileBottomNav: NavItem[] = [
  { label: "Home", to: "/home", icon: Home },
  { label: "Discover", to: "/discover", icon: Compass },
  { label: "Network", to: "/network", icon: Users },
  { label: "Messages", to: "/messages", icon: MessageSquare },
  { label: "Profile", to: "/profile/me", icon: UserIcon },
];

export const adminSidebarNav: { label: string; to: string; icon: LucideIcon }[] = [
  { label: "Dashboard", to: "/admin", icon: Home },
  { label: "Users", to: "/admin/users", icon: Users },
  { label: "Verification", to: "/admin/verifications", icon: ShieldCheck },
  { label: "Organisations", to: "/admin/organisations", icon: Briefcase },
  { label: "Posts", to: "/admin/posts", icon: MessageSquare },
  { label: "Reports", to: "/admin/reports", icon: ShieldCheck },
  { label: "Contact requests", to: "/admin/contact-requests", icon: Users },
  { label: "Payments", to: "/admin/payments", icon: Briefcase },
  { label: "Subscriptions", to: "/admin/subscriptions", icon: Briefcase },
  { label: "Jobs", to: "/admin/jobs", icon: Briefcase },
  { label: "Groups", to: "/admin/groups", icon: Users2 },
  { label: "Events", to: "/admin/events", icon: Calendar },
  { label: "Audit logs", to: "/admin/audit-logs", icon: ShieldCheck },
  { label: "Settings", to: "/admin/settings", icon: UserIcon },
];

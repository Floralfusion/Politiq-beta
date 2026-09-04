import { type ReactNode, useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Bell, ChevronDown, LogOut, Settings, UserIcon, Eye, ShieldCheck, Users as UsersIcon, type LucideIcon } from "lucide-react";
import { sidebarPrimaryNav, mobileBottomNav, topNav } from "@/constants/nav";
import { Avatar, SearchBar, Dropdown, DropdownItem, Badge } from "@/components/ui";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useDemoStore } from "@/demo/store";
import { APP_NAME, APP_TAGLINE, DEMO_MODE } from "@/constants/config";

function Logo() {
  return (
    <Link to="/home" className="flex flex-col leading-none shrink-0">
      <span className="font-serif text-xl font-semibold tracking-tight text-navy-800">{APP_NAME}</span>
      <span className="hidden sm:block text-[10px] text-ink-400">{APP_TAGLINE}</span>
    </Link>
  );
}

function SidebarLink({ to, icon: Icon, label, badge }: { to: string; icon: LucideIcon; label: string; badge?: number }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
          isActive ? "bg-navy-700 text-white" : "text-ink-700 hover:bg-ink-100"
        )
      }
    >
      <Icon size={18} />
      <span className="flex-1">{label}</span>
      {!!badge && <Badge tone="danger">{badge}</Badge>}
    </NavLink>
  );
}

export function AppLayout() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [query, setQuery] = useState("");
  const notifications = useDemoStore((s) => s.notifications);
  const conversations = useDemoStore((s) => s.conversations);
  const unreadNotifications = notifications.filter((n) => !n.read).length;
  const unreadMessages = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  const onSearchSubmit = () => {
    if (query.trim()) navigate(`/discover?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div className="min-h-screen bg-ink-50">
      {DEMO_MODE && (
        <div className="bg-navy-800 text-white text-center text-xs py-1.5 px-4">
          Beta demo mode — data resets are local to your browser. Connect real Clerk/Supabase/Cashfree keys to go live.
        </div>
      )}

      {/* Top header */}
      <header className="sticky top-0 z-30 border-b border-ink-100 bg-white">
        <div className="container-page flex h-16 items-center gap-4">
          <Logo />
          <SearchBar value={query} onChange={setQuery} onSubmit={onSearchSubmit} className="hidden md:block max-w-md" />
          <nav className="ml-auto hidden lg:flex items-center gap-1">
            {topNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "relative flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                    isActive ? "text-navy-800" : "text-ink-500 hover:text-navy-700"
                  )
                }
              >
                <item.icon size={19} />
                {item.label}
                {item.to === "/messages" && unreadMessages > 0 && (
                  <span className="absolute -top-0.5 right-1 h-4 min-w-4 rounded-full bg-danger-500 px-1 text-[9px] leading-4 text-white text-center">
                    {unreadMessages}
                  </span>
                )}
              </NavLink>
            ))}
            <NavLink to="/notifications" className={({ isActive }) => cn("relative flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-xs font-medium", isActive ? "text-navy-800" : "text-ink-500 hover:text-navy-700")}>
              <Bell size={19} />
              Notifications
              {unreadNotifications > 0 && (
                <span className="absolute -top-0.5 right-1.5 h-4 min-w-4 rounded-full bg-danger-500 px-1 text-[9px] leading-4 text-white text-center">
                  {unreadNotifications}
                </span>
              )}
            </NavLink>
          </nav>

          <div className="ml-auto lg:ml-0 flex items-center gap-2">
            <Link to="/notifications" className="lg:hidden relative rounded-lg p-2 text-ink-600 hover:bg-ink-100" aria-label="Notifications">
              <Bell size={20} />
              {unreadNotifications > 0 && <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-danger-500" />}
            </Link>
            <Dropdown
              trigger={
                <button className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-ink-100">
                  <Avatar src={user.avatarUrl} name={user.fullName} size="sm" />
                  <span className="hidden md:block text-sm font-medium text-ink-800">{user.fullName.split(" ")[0]}</span>
                  <ChevronDown size={14} className="hidden md:block text-ink-400" />
                </button>
              }
            >
              <DropdownItem onClick={() => navigate(`/profile/${user.username}`)}>
                <UserIcon size={14} /> View profile
              </DropdownItem>
              <DropdownItem onClick={() => navigate("/verification")}>
                <ShieldCheck size={14} /> Verification centre
              </DropdownItem>
              <DropdownItem onClick={() => navigate("/settings")}>
                <Settings size={14} /> Settings
              </DropdownItem>
              <DropdownItem
                onClick={() => {
                  signOut();
                  navigate("/");
                }}
                danger
              >
                <LogOut size={14} /> Log out
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
        <div className="container-page pb-3 md:hidden">
          <SearchBar value={query} onChange={setQuery} onSubmit={onSearchSubmit} />
        </div>
      </header>

      <div className="container-page grid grid-cols-1 gap-6 py-6 lg:grid-cols-[240px_1fr]">
        {/* Left sidebar (desktop) */}
        <aside className="hidden lg:block">
          <nav className="sticky top-24 space-y-6">
            <div className="space-y-1">
              {sidebarPrimaryNav.map((item) => (
                <SidebarLink key={item.to} {...item} badge={item.to === "/messages" ? unreadMessages : undefined} />
              ))}
            </div>
            <div className="rounded-xl border border-ink-100 bg-white p-4">
              <p className="text-xs font-medium text-ink-500 mb-2">Profile activity</p>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-ink-500 flex items-center gap-1.5"><Eye size={13}/> Profile views</span><span className="font-medium text-navy-800">{user.followersCount}</span></div>
                <div className="flex justify-between"><span className="text-ink-500 flex items-center gap-1.5"><UsersIcon size={13}/> Connections</span><span className="font-medium text-navy-800">{user.connectionsCount}</span></div>
              </div>
            </div>
            {!user.isVerified && (
              <div className="rounded-xl border border-navy-100 bg-navy-50 p-4">
                <p className="text-sm font-semibold text-navy-800">POLITIQ Verified</p>
                <p className="mt-1 text-xs text-ink-600">Build credibility and unlock more opportunities.</p>
                <Link to="/pricing" className="mt-3 inline-flex h-8 items-center rounded-lg bg-navy-700 px-3 text-xs font-medium text-white hover:bg-navy-800">
                  Get Verified
                </Link>
              </div>
            )}
          </nav>
        </aside>

        {/* Main content */}
        <main className="min-w-0 pb-20 lg:pb-0">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-ink-100 bg-white lg:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        {mobileBottomNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn("flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium", isActive ? "text-navy-700" : "text-ink-400")
            }
          >
            <item.icon size={20} />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export function RightSidebar({ children }: { children: ReactNode }) {
  return <aside className="hidden xl:block xl:w-[320px] shrink-0 space-y-4">{children}</aside>;
}

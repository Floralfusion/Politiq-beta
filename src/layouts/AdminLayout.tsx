import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LogOut, ArrowLeft } from "lucide-react";
import { adminSidebarNav } from "@/constants/nav";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui";
import { adminUsers } from "@/demo/seedData";

export function AdminLayout() {
  const navigate = useNavigate();
  const currentAdmin = adminUsers[0];

  return (
    <div className="min-h-screen bg-ink-50 lg:flex">
      <aside className="lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-ink-100 bg-navy-900 text-white">
        <div className="p-5">
          <p className="font-serif text-lg font-semibold">POLITIQ Admin</p>
          <p className="text-xs text-navy-300">Internal operations console</p>
        </div>
        <nav className="px-3 pb-4 space-y-0.5 overflow-x-auto lg:overflow-visible flex lg:block gap-1 lg:gap-0">
          {adminSidebarNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/admin"}
              className={({ isActive }) =>
                cn(
                  "flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap",
                  isActive ? "bg-white/10 text-white" : "text-navy-200 hover:bg-white/5 hover:text-white"
                )
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-2.5 border-t border-white/10 p-4 mt-4">
          <Avatar name={currentAdmin.name} size="sm" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{currentAdmin.name}</p>
            <p className="truncate text-xs text-navy-300">{currentAdmin.role.replaceAll("_", " ")}</p>
          </div>
          <button onClick={() => navigate("/home")} className="ml-auto p-1.5 text-navy-300 hover:text-white" aria-label="Exit admin">
            <LogOut size={16} />
          </button>
        </div>
      </aside>
      <div className="flex-1 min-w-0">
        <div className="lg:hidden flex items-center gap-2 border-b border-ink-100 bg-white px-4 py-3">
          <button onClick={() => navigate("/home")} className="p-1 text-ink-600" aria-label="Back to app"><ArrowLeft size={18} /></button>
          <span className="text-sm font-medium text-navy-800">Admin console</span>
        </div>
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

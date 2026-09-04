import { Link, NavLink, Outlet } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui";
import { APP_NAME, APP_TAGLINE } from "@/constants/config";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Discover", to: "/discover" },
  { label: "Verification", to: "/why-verification" },
  { label: "Pricing", to: "/pricing" },
];

export function PublicLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-30 border-b border-ink-100 bg-white/95 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between">
          <Link to="/" className="flex flex-col leading-none">
            <span className="font-serif text-xl font-semibold tracking-tight text-navy-800">{APP_NAME}</span>
            <span className="hidden sm:block text-[10px] text-ink-400">{APP_TAGLINE}</span>
          </Link>
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => cn("text-sm font-medium", isActive ? "text-navy-800" : "text-ink-600 hover:text-navy-700")}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="hidden md:flex items-center gap-2">
            <Link to="/login"><Button variant="ghost" size="sm">Log in</Button></Link>
            <Link to="/signup"><Button size="sm">Join POLITIQ</Button></Link>
          </div>
          <button className="md:hidden p-2 text-ink-700" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {open && (
          <div className="md:hidden border-t border-ink-100 px-4 py-4 space-y-3">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block text-sm font-medium text-ink-700">
                {l.label}
              </Link>
            ))}
            <div className="flex gap-2 pt-2">
              <Link to="/login" className="flex-1" onClick={() => setOpen(false)}><Button variant="secondary" size="sm" className="w-full">Log in</Button></Link>
              <Link to="/signup" className="flex-1" onClick={() => setOpen(false)}><Button size="sm" className="w-full">Join</Button></Link>
            </div>
          </div>
        )}
      </header>
      <Outlet />
      <footer className="border-t border-ink-100 bg-ink-50">
        <div className="container-page py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-serif text-lg font-semibold text-navy-800">{APP_NAME}</p>
            <p className="text-xs text-ink-500">{APP_TAGLINE}</p>
          </div>
          <p className="text-xs text-ink-400">© {new Date().getFullYear()} POLITIQ. All rights reserved. Beta.</p>
        </div>
      </footer>
    </div>
  );
}

import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, FolderKanban, ListChecks, Users, BarChart3,
  LogOut, Menu, X, Sparkles,
} from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/lib/auth";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Projects", icon: FolderKanban },
  { to: "/tasks", label: "Tasks", icon: ListChecks },
  { to: "/team", label: "Team", icon: Users },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuth((s) => s.user);
  const signOut = useAuth((s) => s.signOut);

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/login" });
  };

  return (
    <div className="min-h-screen flex bg-background relative overflow-hidden">
      <div className="absolute -top-40 -left-32 w-[600px] h-[600px] rounded-full pointer-events-none"
           style={{ background: "radial-gradient(circle, oklch(0.62 0.22 285 / 0.08), transparent 70%)" }} />
      <div className="absolute -bottom-40 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none"
           style={{ background: "radial-gradient(circle, oklch(0.55 0.24 305 / 0.07), transparent 70%)" }} />

      {/* Mobile topbar */}
      <header className="md:hidden fixed top-0 inset-x-0 z-30 bg-sidebar/90 backdrop-blur border-b border-sidebar-border px-4 py-3 flex items-center justify-between">
        <Logo size="sm" />
        <button onClick={() => setOpen((v) => !v)} aria-label="Toggle menu"
          className="p-2 rounded-md hover:bg-sidebar-accent">
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-sidebar border-r border-sidebar-border z-20 flex flex-col transition-transform md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-5 border-b border-sidebar-border hidden md:block">
          <Logo />
        </div>
        <nav className="flex-1 p-3 mt-14 md:mt-0 space-y-1">
          {nav.map((item) => {
            const active = location.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link key={item.to} to={item.to} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  active
                    ? "bg-gradient-brand text-white shadow-glow"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}>
                <Icon size={16} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
            <div className="w-9 h-9 rounded-full bg-gradient-brand flex items-center justify-center text-white text-sm font-semibold">
              {user?.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name ?? "User"}</p>
              <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
            </div>
            <button onClick={handleSignOut} aria-label="Sign out"
              className="p-2 rounded-md hover:bg-sidebar-accent text-muted-foreground hover:text-foreground">
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {open && <div onClick={() => setOpen(false)} className="md:hidden fixed inset-0 bg-black/50 z-10" />}

      {/* Main */}
      <main className="flex-1 min-w-0 relative z-10 pt-14 md:pt-0">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 md:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-7">
      <div>
        <h1 className="font-display font-extrabold text-2xl md:text-3xl tracking-tight flex items-center gap-2">
          <Sparkles size={18} className="text-primary" />
          {title}
        </h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

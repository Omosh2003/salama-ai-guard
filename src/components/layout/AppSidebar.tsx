import { NavLink, useLocation } from "react-router-dom";
import {
  Shield,
  LayoutDashboard,
  Activity,
  Mail,
  Bell,
  Building2,
  Settings,
  FileText,
  Search,
} from "lucide-react";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/threats", icon: Shield, label: "Threats" },
  { to: "/anomalies", icon: Activity, label: "Anomalies" },
  { to: "/phishing", icon: Mail, label: "Phishing Scanner" },
  { to: "/alerts", icon: Bell, label: "Alerts" },
  { to: "/organizations", icon: Building2, label: "Organizations" },
  { to: "/reports", icon: FileText, label: "Reports" },
];

export default function AppSidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-sidebar">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-border px-6 py-5">
        <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary">
          <Shield className="h-5 w-5 text-primary-foreground" />
          <div className="absolute inset-0 animate-pulse-ring rounded-lg bg-primary/30" />
        </div>
        <div>
          <h1 className="font-heading text-lg font-bold text-foreground">
            Salama<span className="text-gradient">Net</span>
          </h1>
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            AI Security
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Search...</span>
          <kbd className="ml-auto rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          Monitor
        </p>
        {navItems.map((item) => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary/10 text-primary shadow-glow"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <item.icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} />
              {item.label}
              {item.label === "Alerts" && (
                <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">
                  3
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <NavLink
          to="/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground hover:bg-sidebar-accent"
        >
          <Settings className="h-4 w-4" />
          Settings
        </NavLink>
        <div className="mt-3 rounded-lg border border-border bg-secondary/30 p-3">
          <p className="text-[10px] font-mono uppercase text-muted-foreground">System Status</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            <span className="text-xs text-primary">All Systems Operational</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

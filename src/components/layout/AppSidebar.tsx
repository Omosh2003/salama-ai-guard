import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
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
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/threats", icon: Shield, label: "Threats" },
  { to: "/anomalies", icon: Activity, label: "Anomalies" },
  { to: "/phishing", icon: Mail, label: "Phishing Scanner" },
  { to: "/alerts", icon: Bell, label: "Alerts", badge: 3 },
  { to: "/organizations", icon: Building2, label: "Organizations" },
  { to: "/reports", icon: FileText, label: "Reports" },
];

export default function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-sidebar">
      {/* Logo */}
      <SidebarHeader className="border-b border-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-primary">
            <Shield className="h-5 w-5 text-primary-foreground" />
            <div className="absolute inset-0 animate-pulse-ring rounded-lg bg-primary/30" />
          </div>
          {!collapsed && (
            <div className="overflow-hidden">
              <h1 className="font-heading text-lg font-bold text-foreground">
                Salama<span className="text-gradient">Net</span>
              </h1>
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                AI Security
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Search - only when expanded */}
        {!collapsed && (
          <div className="px-3 py-3">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Search...</span>
              <kbd className="ml-auto rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                ⌘K
              </kbd>
            </div>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Monitor
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                    >
                      <RouterNavLink
                        to={item.to}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                          isActive
                            ? "bg-primary/10 text-primary shadow-glow"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        }`}
                      >
                        <item.icon className={`h-4 w-4 flex-shrink-0 ${isActive ? "text-primary" : ""}`} />
                        <span>{item.label}</span>
                        {item.badge && !collapsed && (
                          <span className="ml-auto flex h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">
                            {item.badge}
                          </span>
                        )}
                      </RouterNavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <RouterNavLink
                to="/settings"
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm ${
                  location.pathname === "/settings"
                    ? "bg-primary/10 text-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <Settings className="h-4 w-4 flex-shrink-0" />
                <span>Settings</span>
              </RouterNavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {!collapsed && (
          <div className="mt-2 rounded-lg border border-border bg-secondary/30 p-3">
            <p className="text-[10px] font-mono uppercase text-muted-foreground">System Status</p>
            <div className="mt-1 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="text-xs text-primary">All Systems Operational</span>
            </div>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

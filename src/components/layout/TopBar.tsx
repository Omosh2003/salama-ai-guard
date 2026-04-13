import { Bell, User, ChevronDown } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function TopBar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:h-16 sm:px-6">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        <div className="hidden sm:block">
          <h2 className="font-heading text-base font-semibold text-foreground sm:text-lg">
            Security Operations Center
          </h2>
          <p className="text-[10px] text-muted-foreground sm:text-xs">
            Last updated: <span className="font-mono text-primary">2 min ago</span>
          </p>
        </div>
        <h2 className="font-heading text-sm font-semibold text-foreground sm:hidden">
          SOC
        </h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Live indicator */}
        <div className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 sm:gap-2 sm:px-3 sm:py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span className="text-[10px] font-medium text-primary sm:text-xs">LIVE</span>
        </div>

        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
            3
          </span>
        </button>

        {/* User */}
        <button className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-2 py-1.5 text-sm transition-colors hover:bg-secondary sm:px-3">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-primary sm:h-7 sm:w-7">
            <User className="h-3 w-3 text-primary-foreground sm:h-4 sm:w-4" />
          </div>
          <span className="hidden text-foreground sm:inline">Admin</span>
          <ChevronDown className="hidden h-3 w-3 text-muted-foreground sm:block" />
        </button>
      </div>
    </header>
  );
}

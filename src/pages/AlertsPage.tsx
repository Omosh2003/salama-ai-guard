import { useEffect, useState } from "react";
import { Bell, CheckCircle, AlertTriangle, XCircle, Info, Loader2, Check } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";

type AlertLevel = "critical" | "high" | "medium" | "low" | "info";

interface AlertRow {
  id: string;
  title: string;
  message: string | null;
  severity: AlertLevel;
  is_read: boolean;
  created_at: string;
}

const levelConfig = {
  critical: { icon: XCircle, cls: "border-destructive/30 bg-destructive/5 text-destructive" },
  high: { icon: AlertTriangle, cls: "border-warning/30 bg-warning/5 text-warning" },
  medium: { icon: AlertTriangle, cls: "border-accent/30 bg-accent/5 text-accent" },
  low: { icon: Info, cls: "border-primary/30 bg-primary/5 text-primary" },
  info: { icon: CheckCircle, cls: "border-border bg-muted text-muted-foreground" },
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<AlertRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("alerts")
        .select("id, title, message, severity, is_read, created_at")
        .order("created_at", { ascending: false });
      if (!error && data) setAlerts(data as AlertRow[]);
      setLoading(false);
    };
    load();

    const channel = supabase
      .channel("alerts-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "alerts" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const a = payload.new as AlertRow;
            setAlerts((curr) => (curr.some((x) => x.id === a.id) ? curr : [a, ...curr]));
          } else if (payload.eventType === "UPDATE") {
            const a = payload.new as AlertRow;
            setAlerts((curr) => curr.map((x) => (x.id === a.id ? a : x)));
          } else if (payload.eventType === "DELETE") {
            const id = (payload.old as { id: string }).id;
            setAlerts((curr) => curr.filter((x) => x.id !== id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const markRead = async (id: string) => {
    const prev = alerts;
    setAlerts((curr) => curr.map((a) => (a.id === id ? { ...a, is_read: true } : a)));
    const { error } = await supabase.from("alerts").update({ is_read: true }).eq("id", id);
    if (error) {
      setAlerts(prev);
      toast.error("Failed to mark as read");
    }
  };

  const markAllRead = async () => {
    const unread = alerts.filter((a) => !a.is_read).map((a) => a.id);
    if (unread.length === 0) return;
    const prev = alerts;
    setAlerts((curr) => curr.map((a) => ({ ...a, is_read: true })));
    const { error } = await supabase.from("alerts").update({ is_read: true }).in("id", unread);
    if (error) {
      setAlerts(prev);
      toast.error("Failed to mark all as read");
    } else {
      toast.success(`Marked ${unread.length} alert(s) as read`);
    }
  };

  const unreadCount = alerts.filter((a) => !a.is_read).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-destructive/10 p-2.5">
            <Bell className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-foreground">Alert Center</h2>
            <p className="text-xs text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread alert(s)` : "All caught up"}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
          >
            <Check className="h-3.5 w-3.5" />
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : alerts.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          No alerts yet.
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert, i) => {
            const config = levelConfig[alert.severity];
            const Icon = config.icon;
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`flex items-start gap-4 rounded-xl border p-4 shadow-card transition-all hover:shadow-glow ${config.cls} ${
                  !alert.is_read ? "ring-1 ring-current/20" : "opacity-70"
                }`}
              >
                <Icon className="mt-0.5 h-5 w-5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold">{alert.title}</h4>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  {alert.message && <p className="mt-1 text-xs opacity-80">{alert.message}</p>}
                </div>
                {!alert.is_read && (
                  <button
                    onClick={() => markRead(alert.id)}
                    className="flex flex-shrink-0 items-center gap-1 rounded-md border border-current/30 bg-current/5 px-2 py-1 text-[10px] font-medium transition-colors hover:bg-current/10"
                    title="Mark as read"
                  >
                    <Check className="h-3 w-3" />
                    Read
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

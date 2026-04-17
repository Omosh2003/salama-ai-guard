import { useEffect, useState } from "react";
import { Bell, CheckCircle, AlertTriangle, XCircle, Info, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";

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
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-destructive/10 p-2.5">
          <Bell className="h-5 w-5 text-destructive" />
        </div>
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">Alert Center</h2>
          <p className="text-xs text-muted-foreground">
            Real-time security alerts & notifications
          </p>
        </div>
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
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold">{alert.title}</h4>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  {alert.message && <p className="mt-1 text-xs opacity-80">{alert.message}</p>}
                </div>
                {!alert.is_read && (
                  <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-current" />
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

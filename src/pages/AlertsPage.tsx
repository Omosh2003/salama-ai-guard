import { Bell, CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";
import { motion } from "framer-motion";

const alerts = [
  {
    id: 1,
    level: "critical" as const,
    title: "Brute Force Attack Detected",
    message: "Multiple failed SSH login attempts from 41.215.130.12. Auto-blocked after 5 attempts.",
    time: "2 min ago",
    read: false,
  },
  {
    id: 2,
    level: "high" as const,
    title: "Phishing Campaign Targeting Faculty",
    message: "12 phishing emails detected targeting faculty staff with credential harvesting links.",
    time: "15 min ago",
    read: false,
  },
  {
    id: 3,
    level: "high" as const,
    title: "Unusual Data Transfer",
    message: "2.3GB transfer to external IP from database server detected outside business hours.",
    time: "32 min ago",
    read: false,
  },
  {
    id: 4,
    level: "medium" as const,
    title: "SSL Certificate Expiring",
    message: "The SSL certificate for portal.university.ac.ke expires in 7 days.",
    time: "1 hour ago",
    read: true,
  },
  {
    id: 5,
    level: "low" as const,
    title: "Port Scan Detected",
    message: "Sequential port scan from 103.45.67.89. No vulnerabilities exploited.",
    time: "2 hours ago",
    read: true,
  },
  {
    id: 6,
    level: "info" as const,
    title: "AI Model Updated",
    message: "Anomaly detection model retrained with latest network data. Accuracy: 97.3%.",
    time: "3 hours ago",
    read: true,
  },
];

const levelConfig = {
  critical: { icon: XCircle, cls: "border-destructive/30 bg-destructive/5 text-destructive" },
  high: { icon: AlertTriangle, cls: "border-warning/30 bg-warning/5 text-warning" },
  medium: { icon: AlertTriangle, cls: "border-accent/30 bg-accent/5 text-accent" },
  low: { icon: Info, cls: "border-primary/30 bg-primary/5 text-primary" },
  info: { icon: CheckCircle, cls: "border-border bg-muted text-muted-foreground" },
};

export default function AlertsPage() {
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

      <div className="space-y-3">
        {alerts.map((alert, i) => {
          const config = levelConfig[alert.level];
          const Icon = config.icon;
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`flex items-start gap-4 rounded-xl border p-4 shadow-card transition-all hover:shadow-glow ${config.cls} ${
                !alert.read ? "ring-1 ring-current/20" : "opacity-70"
              }`}
            >
              <Icon className="mt-0.5 h-5 w-5 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">{alert.title}</h4>
                  <span className="text-[10px] font-mono text-muted-foreground">{alert.time}</span>
                </div>
                <p className="mt-1 text-xs opacity-80">{alert.message}</p>
              </div>
              {!alert.read && (
                <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-current" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

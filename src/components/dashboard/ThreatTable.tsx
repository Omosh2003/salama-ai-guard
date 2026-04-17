import { ThreatEvent, ThreatLevel } from "@/lib/mock-data";
import { motion } from "framer-motion";

const severityBadge: Record<ThreatLevel, string> = {
  critical: "bg-destructive/10 text-destructive border-destructive/30",
  high: "bg-warning/10 text-warning border-warning/30",
  medium: "bg-accent/10 text-accent border-accent/30",
  low: "bg-primary/10 text-primary border-primary/30",
  info: "bg-muted text-muted-foreground border-border",
};

const statusBadge: Record<string, string> = {
  active: "bg-destructive/10 text-destructive hover:bg-destructive/20",
  investigating: "bg-warning/10 text-warning hover:bg-warning/20",
  resolved: "bg-primary/10 text-primary hover:bg-primary/20",
  dismissed: "bg-muted text-muted-foreground hover:bg-muted/70",
};

export default function ThreatTable({
  threats,
  onCycleStatus,
}: {
  threats: ThreatEvent[];
  onCycleStatus?: (id: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border shadow-card text-xs sm:text-sm">
      <div className="border-b border-border bg-card px-5 py-4">
        <h3 className="font-heading text-sm font-semibold text-foreground">
          Recent Threat Events
        </h3>
        {onCycleStatus && (
          <p className="mt-1 text-[10px] text-muted-foreground">
            Click a status to advance: active → investigating → resolved → dismissed
          </p>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {["Time", "Type", "Source", "Target", "Severity", "Status"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {threats.map((t, i) => (
              <motion.tr
                key={t.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-border/50 bg-card transition-colors hover:bg-secondary/30"
              >
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {new Date(t.timestamp).toLocaleTimeString()}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-foreground">{t.type}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{t.source}</td>
                <td className="px-4 py-3 text-xs text-foreground">{t.target}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${severityBadge[t.severity]}`}
                  >
                    {t.severity}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {onCycleStatus ? (
                    <button
                      onClick={() => onCycleStatus(t.id)}
                      className={`inline-flex cursor-pointer rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize transition-colors ${statusBadge[t.status]}`}
                      title="Click to advance status"
                    >
                      {t.status}
                    </button>
                  ) : (
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${statusBadge[t.status]}`}
                    >
                      {t.status}
                    </span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

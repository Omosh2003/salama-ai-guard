import { useEffect, useState } from "react";
import { Shield, Wifi, AlertTriangle, Clock } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import ThreatTable from "@/components/dashboard/ThreatTable";
import TrafficChart from "@/components/dashboard/TrafficChart";
import ThreatPieChart from "@/components/dashboard/ThreatPieChart";
import { networkStats, severityDistribution } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { useThreats } from "@/hooks/useThreats";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { threats, loading } = useThreats();
  const [alertCount, setAlertCount] = useState<number | null>(null);

  useEffect(() => {
    import("@/integrations/supabase/client").then(({ supabase }) => {
      supabase
        .from("alerts")
        .select("id", { count: "exact", head: true })
        .then(({ count }) => setAlertCount(count ?? 0));
    });
  }, []);

  const detected = threats.length;
  const blocked = threats.filter((t) => t.status === "resolved" || t.status === "dismissed").length;
  const active = threats.filter((t) => t.status === "active").length;

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <StatCard
          title="Threats Detected"
          value={loading ? "..." : detected}
          subtitle={`${active} currently active`}
          icon={AlertTriangle}
          trend={{ value: 12, positive: false }}
          variant="danger"
        />
        <StatCard
          title="Threats Blocked"
          value={loading ? "..." : blocked}
          subtitle={detected > 0 ? `${Math.round((blocked / detected) * 100)}% block rate` : "—"}
          icon={Shield}
          trend={{ value: 8, positive: true }}
          variant="primary"
        />
        <StatCard
          title="Open Alerts"
          value={alertCount ?? "..."}
          subtitle={networkStats.bandwidth}
          icon={Wifi}
          variant="default"
        />
        <StatCard
          title="System Uptime"
          value={networkStats.uptime}
          subtitle={`Last scan: ${networkStats.lastScan}`}
          icon={Clock}
          variant="primary"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <TrafficChart />
        </div>
        <ThreatPieChart />
      </div>

      {/* Severity Overview */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-border bg-card p-5 shadow-card"
      >
        <h3 className="mb-4 font-heading text-sm font-semibold text-foreground">
          Severity Distribution
        </h3>
        <div className="flex items-end gap-6">
          {severityDistribution.map((s) => (
            <div key={s.name} className="flex flex-col items-center gap-2">
              <span className="font-heading text-xl font-bold text-foreground">{s.count}</span>
              <div
                className="w-14 rounded-t-md transition-all"
                style={{
                  height: `${s.count * 5}px`,
                  backgroundColor: s.color,
                  opacity: 0.8,
                }}
              />
              <span className="text-[10px] font-medium uppercase text-muted-foreground">
                {s.name}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Threat Events Table */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <ThreatTable threats={threats} />
      )}
    </div>
  );
}

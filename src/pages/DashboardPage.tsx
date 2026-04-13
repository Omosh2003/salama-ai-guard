import { Shield, Wifi, AlertTriangle, Activity, Lock, Clock } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import ThreatTable from "@/components/dashboard/ThreatTable";
import TrafficChart from "@/components/dashboard/TrafficChart";
import ThreatPieChart from "@/components/dashboard/ThreatPieChart";
import { networkStats, recentThreats, severityDistribution } from "@/lib/mock-data";
import { motion } from "framer-motion";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Threats Detected"
          value={networkStats.threatsDetected}
          subtitle="Last 24 hours"
          icon={AlertTriangle}
          trend={{ value: 12, positive: false }}
          variant="danger"
        />
        <StatCard
          title="Threats Blocked"
          value={networkStats.threatsBlocked}
          subtitle={`${Math.round((networkStats.threatsBlocked / networkStats.threatsDetected) * 100)}% block rate`}
          icon={Shield}
          trend={{ value: 8, positive: true }}
          variant="primary"
        />
        <StatCard
          title="Active Connections"
          value={networkStats.activeConnections}
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
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
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
      <ThreatTable threats={recentThreats} />
    </div>
  );
}

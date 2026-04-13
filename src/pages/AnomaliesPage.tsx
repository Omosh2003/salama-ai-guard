import { anomalyData } from "@/lib/mock-data";
import { Activity } from "lucide-react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const chartData = anomalyData.map((a) => ({
  metric: a.metric,
  expected: a.expectedValue,
  actual: a.actualValue,
}));

export default function AnomaliesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-accent/10 p-2.5">
          <Activity className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">Anomaly Detection</h2>
          <p className="text-xs text-muted-foreground">
            AI-powered behavioral analysis using Isolation Forest
          </p>
        </div>
      </div>

      {/* Deviation Chart */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-card">
        <h3 className="mb-4 font-heading text-sm font-semibold text-foreground">
          Expected vs Actual Values
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
            <XAxis
              dataKey="metric"
              tick={{ fontSize: 11, fill: "hsl(215, 12%, 55%)" }}
              axisLine={{ stroke: "hsl(220, 14%, 18%)" }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(215, 12%, 55%)" }}
              axisLine={{ stroke: "hsl(220, 14%, 18%)" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220, 18%, 10%)",
                border: "1px solid hsl(220, 14%, 18%)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Bar dataKey="expected" fill="hsl(160, 84%, 44%)" radius={[4, 4, 0, 0]} name="Expected" />
            <Bar dataKey="actual" fill="hsl(0, 72%, 55%)" radius={[4, 4, 0, 0]} name="Actual" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Anomaly Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {anomalyData.map((a, i) => (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl border border-border bg-card p-5 shadow-card"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-heading text-sm font-semibold text-foreground">{a.metric}</p>
                <p className="text-xs text-muted-foreground">{a.source}</p>
              </div>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${
                  a.severity === "critical"
                    ? "border-destructive/30 bg-destructive/10 text-destructive"
                    : a.severity === "high"
                    ? "border-warning/30 bg-warning/10 text-warning"
                    : "border-accent/30 bg-accent/10 text-accent"
                }`}
              >
                {a.severity}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div>
                <p className="text-[10px] uppercase text-muted-foreground">Expected</p>
                <p className="font-mono text-lg font-bold text-primary">{a.expectedValue}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-muted-foreground">Actual</p>
                <p className="font-mono text-lg font-bold text-destructive">{a.actualValue}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-muted-foreground">Deviation</p>
                <p className="font-mono text-lg font-bold text-warning">{a.deviation}σ</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { trafficTimeline } from "@/lib/mock-data";

export default function TrafficChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <h3 className="mb-4 font-heading text-sm font-semibold text-foreground">
        Network Traffic (24h)
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={trafficTimeline}>
          <defs>
            <linearGradient id="normalGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(160, 84%, 44%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(160, 84%, 44%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="suspiciousGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(38, 92%, 55%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(38, 92%, 55%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="blockedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(0, 72%, 55%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(0, 72%, 55%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 18%)" />
          <XAxis
            dataKey="hour"
            tick={{ fontSize: 10, fill: "hsl(215, 12%, 55%)" }}
            axisLine={{ stroke: "hsl(220, 14%, 18%)" }}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "hsl(215, 12%, 55%)" }}
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
          <Legend wrapperStyle={{ fontSize: "11px" }} />
          <Area
            type="monotone"
            dataKey="normal"
            stroke="hsl(160, 84%, 44%)"
            fillOpacity={1}
            fill="url(#normalGrad)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="suspicious"
            stroke="hsl(38, 92%, 55%)"
            fillOpacity={1}
            fill="url(#suspiciousGrad)"
            strokeWidth={2}
          />
          <Area
            type="monotone"
            dataKey="blocked"
            stroke="hsl(0, 72%, 55%)"
            fillOpacity={1}
            fill="url(#blockedGrad)"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

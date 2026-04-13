import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: { value: number; positive: boolean };
  variant?: "default" | "primary" | "danger" | "warning";
}

const variantStyles = {
  default: "border-border bg-card",
  primary: "border-primary/20 bg-primary/5",
  danger: "border-destructive/20 bg-destructive/5",
  warning: "border-warning/20 bg-warning/5",
};

const iconVariants = {
  default: "bg-secondary text-foreground",
  primary: "bg-primary/10 text-primary",
  danger: "bg-destructive/10 text-destructive",
  warning: "bg-warning/10 text-warning",
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = "default",
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border p-5 shadow-card transition-all hover:shadow-glow ${variantStyles[variant]}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <p className="mt-2 font-heading text-3xl font-bold text-foreground">{value}</p>
          {subtitle && (
            <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <p
              className={`mt-1 text-xs font-medium ${
                trend.positive ? "text-primary" : "text-destructive"
              }`}
            >
              {trend.positive ? "↑" : "↓"} {Math.abs(trend.value)}% from last hour
            </p>
          )}
        </div>
        <div className={`rounded-lg p-2.5 ${iconVariants[variant]}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}

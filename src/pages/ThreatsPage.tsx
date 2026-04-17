import ThreatTable from "@/components/dashboard/ThreatTable";
import { Shield, Filter, Loader2 } from "lucide-react";
import { useThreats } from "@/hooks/useThreats";

export default function ThreatsPage() {
  const { threats, loading, cycleStatus } = useThreats();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-destructive/10 p-2.5">
            <Shield className="h-5 w-5 text-destructive" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-foreground">Threat Detection</h2>
            <p className="text-xs text-muted-foreground">AI-powered threat monitoring & analysis</p>
          </div>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-border bg-secondary/50 px-4 py-2 text-sm text-foreground transition-colors hover:bg-secondary">
          <Filter className="h-4 w-4" />
          Filter
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {[
              { label: "Active", count: threats.filter(t => t.status === "active").length, cls: "text-destructive bg-destructive/10 border-destructive/20" },
              { label: "Investigating", count: threats.filter(t => t.status === "investigating").length, cls: "text-warning bg-warning/10 border-warning/20" },
              { label: "Resolved", count: threats.filter(t => t.status === "resolved").length, cls: "text-primary bg-primary/10 border-primary/20" },
              { label: "Dismissed", count: threats.filter(t => t.status === "dismissed").length, cls: "text-muted-foreground bg-muted border-border" },
            ].map(s => (
              <div key={s.label} className={`rounded-xl border p-4 ${s.cls}`}>
                <p className="text-2xl font-heading font-bold">{s.count}</p>
                <p className="text-xs font-medium uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>

          <ThreatTable threats={threats} onCycleStatus={cycleStatus} />
        </>
      )}
    </div>
  );
}

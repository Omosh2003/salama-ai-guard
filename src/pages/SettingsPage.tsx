import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-muted p-2.5">
          <Settings className="h-5 w-5 text-muted-foreground" />
        </div>
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">Settings</h2>
          <p className="text-xs text-muted-foreground">Platform configuration</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[
          { title: "API Keys", desc: "Manage integration keys for external services" },
          { title: "Alert Preferences", desc: "Configure email and SMS notification rules" },
          { title: "Organization", desc: "Manage tenant settings and user access" },
          { title: "AI Models", desc: "View and retrain anomaly detection models" },
          { title: "Network Rules", desc: "Firewall rules and traffic policies" },
          { title: "Data Retention", desc: "Configure log retention and export policies" },
        ].map((s, i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-glow">
            <h3 className="text-sm font-semibold text-foreground">{s.title}</h3>
            <p className="mt-1 text-xs text-muted-foreground">{s.desc}</p>
            <button className="mt-3 text-xs font-medium text-primary hover:underline">
              Configure →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

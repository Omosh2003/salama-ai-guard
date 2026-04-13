import { FileText, Download } from "lucide-react";

const reports = [
  { name: "Weekly Threat Summary", date: "Apr 7 – Apr 13, 2026", type: "Automated" },
  { name: "Phishing Campaign Analysis", date: "Apr 12, 2026", type: "Incident" },
  { name: "Network Anomaly Report", date: "Apr 10, 2026", type: "AI Generated" },
  { name: "Monthly Security Audit", date: "March 2026", type: "Compliance" },
  { name: "Vulnerability Assessment", date: "Apr 5, 2026", type: "Penetration Test" },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2.5">
          <FileText className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">Reports</h2>
          <p className="text-xs text-muted-foreground">Security reports & compliance documents</p>
        </div>
      </div>

      <div className="space-y-3">
        {reports.map((r, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-card transition-all hover:shadow-glow"
          >
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-semibold text-foreground">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                {r.type}
              </span>
              <button className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

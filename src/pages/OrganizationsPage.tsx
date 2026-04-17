import { useEffect, useState } from "react";
import { Building2, Shield, AlertTriangle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface OrgRow {
  id: string;
  name: string;
  type: string;
  status: string;
  threats: number;
}

export default function OrganizationsPage() {
  const [orgs, setOrgs] = useState<OrgRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [{ data: orgData }, { data: threatData }] = await Promise.all([
        supabase.from("organizations").select("id, name, type, status").order("name"),
        supabase.from("threats").select("organization_id").in("status", ["active", "investigating"]),
      ]);
      if (orgData) {
        const counts = new Map<string, number>();
        (threatData ?? []).forEach((t: any) => {
          if (t.organization_id) counts.set(t.organization_id, (counts.get(t.organization_id) ?? 0) + 1);
        });
        setOrgs(orgData.map((o) => ({ ...o, threats: counts.get(o.id) ?? 0 })));
      }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-accent/10 p-2.5">
          <Building2 className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="font-heading text-xl font-bold text-foreground">Organizations</h2>
          <p className="text-xs text-muted-foreground">Multi-tenant security management</p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {orgs.map((org, i) => (
            <motion.div
              key={org.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-glow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                    <Building2 className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{org.name}</h3>
                    <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      {org.type}
                    </span>
                  </div>
                </div>
                {org.status === "protected" ? (
                  <Shield className="h-5 w-5 text-primary" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-warning" />
                )}
              </div>
              <div className="mt-4 flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2">
                <span className="text-xs text-muted-foreground">Active Threats</span>
                <span
                  className={`font-mono text-sm font-bold ${
                    org.threats > 10 ? "text-destructive" : org.threats > 5 ? "text-warning" : "text-primary"
                  }`}
                >
                  {org.threats}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                    org.status === "protected"
                      ? "bg-primary/10 text-primary"
                      : "bg-warning/10 text-warning"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {org.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

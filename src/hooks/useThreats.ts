import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { ThreatEvent, ThreatLevel } from "@/lib/mock-data";
import { toast } from "sonner";

const statusFlow: Record<ThreatEvent["status"], ThreatEvent["status"]> = {
  active: "investigating",
  investigating: "resolved",
  resolved: "dismissed",
  dismissed: "active",
};

export function useThreats() {
  const [threats, setThreats] = useState<ThreatEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("threats")
        .select("id, type, source, target, severity, status, description, created_at")
        .order("created_at", { ascending: false });
      if (!error && data) {
        setThreats(
          data.map((t) => ({
            id: t.id,
            timestamp: t.created_at,
            type: t.type,
            source: t.source,
            target: t.target,
            severity: t.severity as ThreatLevel,
            description: t.description ?? "",
            status: t.status as ThreatEvent["status"],
          }))
        );
      }
      setLoading(false);
    };
    load();
  }, []);

  const updateStatus = async (id: string, status: ThreatEvent["status"]) => {
    const prev = threats;
    setThreats((curr) => curr.map((t) => (t.id === id ? { ...t, status } : t)));
    const { error } = await supabase.from("threats").update({ status }).eq("id", id);
    if (error) {
      setThreats(prev);
      toast.error("Failed to update threat status");
    } else {
      toast.success(`Threat marked as ${status}`);
    }
  };

  const cycleStatus = (id: string) => {
    const t = threats.find((x) => x.id === id);
    if (!t) return;
    updateStatus(id, statusFlow[t.status]);
  };

  return { threats, loading, updateStatus, cycleStatus };
}

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

type ThreatRow = {
  id: string;
  type: string;
  source: string;
  target: string;
  severity: string;
  status: string;
  description: string | null;
  created_at: string;
};

const mapThreat = (t: ThreatRow): ThreatEvent => ({
  id: t.id,
  timestamp: t.created_at,
  type: t.type,
  source: t.source,
  target: t.target,
  severity: t.severity as ThreatLevel,
  description: t.description ?? "",
  status: t.status as ThreatEvent["status"],
});

export function useThreats() {
  const [threats, setThreats] = useState<ThreatEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from("threats")
        .select("id, type, source, target, severity, status, description, created_at")
        .order("created_at", { ascending: false });
      if (!error && data) setThreats(data.map(mapThreat));
      setLoading(false);
    };
    load();

    const channel = supabase
      .channel("threats-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "threats" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            const t = mapThreat(payload.new as ThreatRow);
            setThreats((curr) => (curr.some((x) => x.id === t.id) ? curr : [t, ...curr]));
          } else if (payload.eventType === "UPDATE") {
            const t = mapThreat(payload.new as ThreatRow);
            setThreats((curr) => curr.map((x) => (x.id === t.id ? t : x)));
          } else if (payload.eventType === "DELETE") {
            const id = (payload.old as { id: string }).id;
            setThreats((curr) => curr.filter((x) => x.id !== id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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

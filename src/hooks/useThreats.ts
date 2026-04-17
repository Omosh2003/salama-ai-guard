import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { ThreatEvent, ThreatLevel } from "@/lib/mock-data";

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

  return { threats, loading };
}

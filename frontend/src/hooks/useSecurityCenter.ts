import { useCallback, useEffect, useState } from "react";
import { getSocket } from "../services/socketClient";
import {
  deleteSecurityEvent,
  dismissSecurityEvent,
  fetchSecurityOverview,
  type RiskScore,
  type SecurityEvent,
  type SecurityEventType,
} from "../services/securityService";

export const useSecurityCenter = (typeFilter?: SecurityEventType | "") => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [risk, setRisk] = useState<RiskScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchSecurityOverview({
        type: typeFilter || undefined,
        limit: 100,
      });
      setEvents(data.events);
      setRisk(data.risk);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to load security data.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [typeFilter]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return undefined;

    const refreshSecurity = () => {
      void load();
    };

    socket.on("monitor:checked", refreshSecurity);
    socket.on("analytics:updated", refreshSecurity);
    socket.on("dashboard:update", refreshSecurity);

    return () => {
      socket.off("monitor:checked", refreshSecurity);
      socket.off("analytics:updated", refreshSecurity);
      socket.off("dashboard:update", refreshSecurity);
    };
  }, [load]);

  const dismiss = async (id: string) => {
    const result = await dismissSecurityEvent(id);
    setRisk(result.risk);
    await load();
  };

  const remove = async (id: string) => {
    const result = await deleteSecurityEvent(id);
    setRisk(result.risk);
    await load();
  };

  return { events, risk, loading, error, refresh: load, dismiss, remove };
};

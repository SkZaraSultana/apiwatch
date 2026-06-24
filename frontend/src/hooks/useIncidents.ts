import { useCallback, useEffect, useState } from "react";
import { getSocket } from "../services/socketClient";
import {
  deleteIncident,
  listIncidents,
  updateIncidentStatus,
  type Incident,
  type IncidentStatus,
  type IncidentSummary,
} from "../services/incidentService";

export const useIncidents = (statusFilter?: IncidentStatus | "") => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [summary, setSummary] = useState<IncidentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchIncidents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listIncidents({
        status: statusFilter || undefined,
        limit: 100,
      });
      setIncidents(data.incidents);
      setSummary(data.summary);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to load incidents.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return undefined;

    const handleRefresh = () => {
      void fetchIncidents();
    };

    socket.on("incident:created", handleRefresh);
    socket.on("incident:resolved", handleRefresh);
    socket.on("incident:updated", handleRefresh);

    return () => {
      socket.off("incident:created", handleRefresh);
      socket.off("incident:resolved", handleRefresh);
      socket.off("incident:updated", handleRefresh);
    };
  }, [fetchIncidents]);

  const changeStatus = async (
    id: string,
    status: IncidentStatus,
    note?: string
  ) => {
    const result = await updateIncidentStatus(id, { status, note });
    setIncidents((prev) =>
      prev.map((incident) =>
        incident.id === id ? result.incident : incident
      )
    );
    await fetchIncidents();
    return result.incident;
  };

  const remove = async (id: string) => {
    await deleteIncident(id);
    await fetchIncidents();
  };

  return {
    incidents,
    summary,
    loading,
    error,
    refresh: fetchIncidents,
    changeStatus,
    remove,
  };
};

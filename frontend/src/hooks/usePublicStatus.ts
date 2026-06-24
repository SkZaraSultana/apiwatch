import { useCallback, useEffect, useState } from "react";
import { getSocket } from "../services/socketClient";
import {
  fetchPublicStatus,
  type PublicStatus,
} from "../services/publicStatusService";

const POLL_INTERVAL_MS = 15000;

export const usePublicStatus = (slug: string | undefined) => {
  const [status, setStatus] = useState<PublicStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!slug) {
      setError("Status page URL is invalid.");
      setLoading(false);
      return;
    }

    try {
      const data = await fetchPublicStatus(slug);
      setStatus(data);
      setError("");
    } catch (_err) {
      setError("Status page not found or is not published.");
      setStatus(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    load();
    const timer = window.setInterval(load, POLL_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [load]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return undefined;

    const refresh = () => {
      void load();
    };

    socket.on("monitor:checked", refresh);
    socket.on("monitor:created", refresh);
    socket.on("incident:created", refresh);
    socket.on("incident:resolved", refresh);

    return () => {
      socket.off("monitor:checked", refresh);
      socket.off("monitor:created", refresh);
      socket.off("incident:created", refresh);
      socket.off("incident:resolved", refresh);
    };
  }, [load]);

  return { status, loading, error, refresh: load };
};

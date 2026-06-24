import { useEffect, useState } from "react";
import {
  fetchStatusPageConfig,
  generateStatusPageUrl,
  updateStatusPageConfig,
  type StatusPageConfig,
} from "../services/statusPageService";

export const useStatusPageSettings = () => {
  const [config, setConfig] = useState<StatusPageConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchStatusPageConfig();
      setConfig(data);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to load status page settings.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const regenerateUrl = async () => {
    setSaving(true);
    setMessage("");
    try {
      const result = await generateStatusPageUrl();
      setConfig(result.statusPage);
      setMessage(result.message);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to generate URL.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const save = async (payload: { title?: string; isPublished?: boolean }) => {
    setSaving(true);
    setMessage("");
    try {
      const result = await updateStatusPageConfig(payload);
      setConfig(result.statusPage);
      setMessage(result.message);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to update status page.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return {
    config,
    loading,
    saving,
    error,
    message,
    regenerateUrl,
    save,
    refresh: load,
  };
};

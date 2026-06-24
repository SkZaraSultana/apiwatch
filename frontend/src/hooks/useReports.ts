import { useCallback, useEffect, useState } from "react";
import {
  downloadReport,
  fetchReportHistory,
  fetchReportPreview,
  type ReportData,
  type ReportFormat,
  type ReportHistoryItem,
  type ReportPeriod,
} from "../services/reportService";

export const useReports = (period: ReportPeriod) => {
  const [report, setReport] = useState<ReportData | null>(null);
  const [history, setHistory] = useState<ReportHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState<ReportFormat | null>(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [preview, reportHistory] = await Promise.all([
        fetchReportPreview(period),
        fetchReportHistory(),
      ]);
      setReport(preview);
      setHistory(reportHistory);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to load report preview.";
      setError(message);
      setReport(null);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    load();
  }, [load]);

  const exportReport = async (format: ReportFormat) => {
    setExporting(format);
    setError("");
    try {
      await downloadReport(period, format);
      await load();
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || `Failed to export ${format.toUpperCase()} report.`;
      setError(message);
    } finally {
      setExporting(null);
    }
  };

  return {
    report,
    history,
    loading,
    exporting,
    error,
    refresh: load,
    exportReport,
  };
};

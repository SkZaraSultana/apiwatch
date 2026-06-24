import api from "./api";

export type ReportPeriod = "daily" | "weekly" | "monthly";
export type ReportFormat = "pdf" | "csv";

export type ReportSummary = {
  monitorCount: number;
  totalChecks: number;
  successfulChecks: number;
  uptimePercent: number;
  avgResponseTimeMs: number;
  alertCount: number;
  incidentCount: number;
  securityEventCount: number;
  openIncidents: number;
};

export type ReportData = {
  period: ReportPeriod;
  periodLabel: string;
  generatedAt: string;
  dateRange: { from: string; to: string };
  summary: ReportSummary;
  monitors: Array<{
    name: string;
    url: string;
    status: string;
    currentState: string;
    uptimePercent: number;
    avgResponseTimeMs: number;
    checkCount: number;
  }>;
  alerts: Array<{
    type: string;
    title: string;
    monitorName: string;
    createdAt: string;
  }>;
  incidents: Array<{
    title: string;
    monitorName: string;
    status: string;
    startedAt: string;
    resolvedAt: string | null;
  }>;
  securityEvents: Array<{
    typeLabel: string;
    severity: string;
    title: string;
    monitorName: string;
    detectedAt: string;
  }>;
};

export type ReportHistoryItem = {
  id: string;
  period: ReportPeriod;
  format: ReportFormat;
  fileName: string;
  summary: ReportSummary;
  generatedAt: string;
};

export const PERIOD_LABELS: Record<ReportPeriod, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
};

export const fetchReportPreview = async (period: ReportPeriod) => {
  const response = await api.get<{ report: ReportData }>("/reports/preview", {
    params: { period },
  });
  return response.data.report;
};

export const fetchReportHistory = async () => {
  const response = await api.get<{ reports: ReportHistoryItem[] }>(
    "/reports/history"
  );
  return response.data.reports;
};

export const downloadReport = async (period: ReportPeriod, format: ReportFormat) => {
  const response = await api.get("/reports/export", {
    params: { period, format },
    responseType: "blob",
  });

  const blob = new Blob([response.data], {
    type: format === "pdf" ? "application/pdf" : "text/csv",
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `apiwatch-${period}-report.${format}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

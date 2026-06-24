const env = require("../config/env");
const { baseLayout, detailRow, detailsTable, ctaButton } = require("./layout");

const dashboardUrl = `${env.clientUrl}/dashboard/alerts`;

const getApiDownTemplate = ({ monitorName, url, method, statusCode, errorMessage, checkedAt }) => ({
  subject: `[APIWatch] API Down — ${monitorName}`,
  html: baseLayout({
    title: "API Down Alert",
    preheader: `${monitorName} is currently unavailable.`,
    bodyContent: `
      <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#f87171;">API Down</p>
      <h1 style="margin:0 0 12px;font-size:24px;color:#ffffff;">Monitor detected an outage</h1>
      <p style="margin:0;font-size:15px;line-height:1.6;color:#cbd5e1;">
        <strong>${monitorName}</strong> failed its latest health check and is marked unavailable.
      </p>
      ${detailsTable([
        detailRow("Monitor", monitorName),
        detailRow("Endpoint", url),
        detailRow("Method", method),
        detailRow("Status code", statusCode ?? "N/A"),
        detailRow("Checked at", new Date(checkedAt).toUTCString()),
        detailRow("Details", errorMessage || "No additional details"),
      ])}
      ${ctaButton(dashboardUrl, "View alert in dashboard")}
    `,
  }),
});

const getRecoveryTemplate = ({
  monitorName,
  url,
  method,
  statusCode,
  responseTimeMs,
  downtimeSeconds,
  checkedAt,
}) => ({
  subject: `[APIWatch] Recovery — ${monitorName}`,
  html: baseLayout({
    title: "Recovery Alert",
    preheader: `${monitorName} is back online.`,
    bodyContent: `
      <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#34d399;">Recovery</p>
      <h1 style="margin:0 0 12px;font-size:24px;color:#ffffff;">Service has recovered</h1>
      <p style="margin:0;font-size:15px;line-height:1.6;color:#cbd5e1;">
        <strong>${monitorName}</strong> is responding normally again after a downtime event.
      </p>
      ${detailsTable([
        detailRow("Monitor", monitorName),
        detailRow("Endpoint", url),
        detailRow("Method", method),
        detailRow("Status code", statusCode ?? "N/A"),
        detailRow("Response time", `${responseTimeMs} ms`),
        detailRow("Downtime", `${downtimeSeconds}s`),
        detailRow("Recovered at", new Date(checkedAt).toUTCString()),
      ])}
      ${ctaButton(dashboardUrl, "Review incident timeline")}
    `,
  }),
});

const getLatencyTemplate = ({
  monitorName,
  url,
  method,
  responseTimeMs,
  thresholdMs,
  statusCode,
  checkedAt,
}) => ({
  subject: `[APIWatch] High Latency — ${monitorName}`,
  html: baseLayout({
    title: "Latency Alert",
    preheader: `${monitorName} exceeded the latency threshold.`,
    bodyContent: `
      <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#fbbf24;">High Latency</p>
      <h1 style="margin:0 0 12px;font-size:24px;color:#ffffff;">Response time threshold exceeded</h1>
      <p style="margin:0;font-size:15px;line-height:1.6;color:#cbd5e1;">
        <strong>${monitorName}</strong> is available but responded slower than your configured threshold.
      </p>
      ${detailsTable([
        detailRow("Monitor", monitorName),
        detailRow("Endpoint", url),
        detailRow("Method", method),
        detailRow("Response time", `${responseTimeMs} ms`),
        detailRow("Threshold", `${thresholdMs} ms`),
        detailRow("Status code", statusCode ?? "N/A"),
        detailRow("Detected at", new Date(checkedAt).toUTCString()),
      ])}
      ${ctaButton(dashboardUrl, "Open alerts dashboard")}
    `,
  }),
});

module.exports = {
  getApiDownTemplate,
  getRecoveryTemplate,
  getLatencyTemplate,
};

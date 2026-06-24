const mongoose = require("mongoose");
const Monitor = require("../models/Monitor");
const MonitorCheckLog = require("../models/MonitorCheckLog");
const Alert = require("../models/Alert");
const Incident = require("../models/Incident");
const SecurityEvent = require("../models/SecurityEvent");
const Report = require("../models/Report");
const { buildCsv, buildPdfBuffer } = require("./reportExportService");

const PERIOD_CONFIG = {
  daily: { label: "Daily Report", days: 1 },
  weekly: { label: "Weekly Report", days: 7 },
  monthly: { label: "Monthly Report", days: 30 },
};

const getDateRange = (period) => {
  const config = PERIOD_CONFIG[period] || PERIOD_CONFIG.daily;
  const to = new Date();
  const from = new Date(to.getTime() - config.days * 24 * 60 * 60 * 1000);
  return { from, to, label: config.label };
};

const buildMonitorRows = async (userId, from) => {
  const monitors = await Monitor.find({ user: userId }).lean();
  const userObjectId = new mongoose.Types.ObjectId(userId);

  return Promise.all(
    monitors.map(async (monitor) => {
      const logs = await MonitorCheckLog.find({
        user: userObjectId,
        monitor: monitor._id,
        checkedAt: { $gte: from },
      }).lean();

      const checkCount = logs.length;
      const successful = logs.filter((log) => log.isAvailable).length;
      const uptimePercent =
        checkCount > 0 ? Math.round((successful / checkCount) * 10000) / 100 : 100;
      const avgResponseTimeMs =
        checkCount > 0
          ? Math.round(
              logs.reduce((sum, log) => sum + log.responseTimeMs, 0) / checkCount
            )
          : 0;

      return {
        name: monitor.name,
        url: monitor.url,
        status: monitor.status,
        currentState: monitor.currentState,
        uptimePercent,
        avgResponseTimeMs,
        checkCount,
      };
    })
  );
};

const buildReportData = async (userId, period) => {
  if (!PERIOD_CONFIG[period]) {
    throw new Error("Invalid report period. Use daily, weekly, or monthly.");
  }

  const { from, to, label } = getDateRange(period);
  const userObjectId = new mongoose.Types.ObjectId(userId);
  const dateFilter = { $gte: from, $lte: to };

  const [monitors, logs, alerts, incidents, securityEvents] = await Promise.all([
    buildMonitorRows(userId, from),
    MonitorCheckLog.find({ user: userObjectId, checkedAt: dateFilter }).lean(),
    Alert.find({ user: userObjectId, createdAt: dateFilter })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean(),
    Incident.find({ user: userObjectId, startedAt: dateFilter })
      .sort({ startedAt: -1 })
      .limit(100)
      .lean(),
    SecurityEvent.find({
      user: userObjectId,
      detectedAt: dateFilter,
      isDismissed: false,
    })
      .sort({ detectedAt: -1 })
      .limit(100)
      .lean(),
  ]);

  const totalChecks = logs.length;
  const successfulChecks = logs.filter((log) => log.isAvailable).length;
  const uptimePercent =
    totalChecks > 0
      ? Math.round((successfulChecks / totalChecks) * 10000) / 100
      : 100;
  const avgResponseTimeMs =
    totalChecks > 0
      ? Math.round(
          logs.reduce((sum, log) => sum + log.responseTimeMs, 0) / totalChecks
        )
      : 0;

  const openIncidents = await Incident.countDocuments({
    user: userObjectId,
    status: { $in: ["open", "investigating"] },
  });

  return {
    period,
    periodLabel: label,
    generatedAt: new Date().toISOString(),
    dateRange: {
      from: from.toISOString(),
      to: to.toISOString(),
    },
    summary: {
      monitorCount: monitors.length,
      totalChecks,
      successfulChecks,
      uptimePercent,
      avgResponseTimeMs,
      alertCount: alerts.length,
      incidentCount: incidents.length,
      securityEventCount: securityEvents.length,
      openIncidents,
    },
    monitors,
    alerts: alerts.map((alert) => ({
      type: alert.type,
      title: alert.title,
      monitorName: alert.monitorName,
      createdAt: alert.createdAt.toISOString(),
    })),
    incidents: incidents.map((incident) => ({
      title: incident.title,
      monitorName: incident.monitorName,
      status: incident.status,
      startedAt: incident.startedAt.toISOString(),
      resolvedAt: incident.resolvedAt ? incident.resolvedAt.toISOString() : null,
    })),
    securityEvents: securityEvents.map((event) => ({
      typeLabel: event.type.replace(/_/g, " "),
      severity: event.severity,
      title: event.title,
      monitorName: event.monitorName,
      detectedAt: event.detectedAt.toISOString(),
    })),
  };
};

const saveReportRecord = async (userId, period, format, report) => {
  const fileName = `apiwatch-${period}-report-${Date.now()}.${format}`;
  return Report.create({
    user: userId,
    period,
    format,
    fileName,
    summary: report.summary,
    generatedAt: new Date(),
  });
};

const getReportPreview = async (userId, period) => buildReportData(userId, period);

const exportReport = async (userId, period, format) => {
  if (!["pdf", "csv"].includes(format)) {
    throw new Error("Invalid export format. Use pdf or csv.");
  }

  const report = await buildReportData(userId, period);
  await saveReportRecord(userId, period, format, report);

  if (format === "csv") {
    return {
      contentType: "text/csv",
      fileName: `apiwatch-${period}-report.csv`,
      buffer: Buffer.from(buildCsv(report), "utf-8"),
    };
  }

  const buffer = await buildPdfBuffer(report);
  return {
    contentType: "application/pdf",
    fileName: `apiwatch-${period}-report.pdf`,
    buffer,
  };
};

const listReportHistory = async (userId, limit = 20) => {
  return Report.find({ user: userId })
    .sort({ generatedAt: -1 })
    .limit(Math.min(limit, 100));
};

module.exports = {
  getReportPreview,
  exportReport,
  listReportHistory,
  PERIOD_CONFIG,
};

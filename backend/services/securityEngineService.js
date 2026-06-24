const SecurityEvent = require("../models/SecurityEvent");
const MonitorCheckLog = require("../models/MonitorCheckLog");
const env = require("../config/env");
const { analyzeUrlSecurity } = require("../utils/urlSecurity");

const COOLDOWN_MS = env.securityEventCooldownMinutes * 60 * 1000;
const WINDOW_SIZE = env.securityAnalysisWindow;

const SEVERITY_POINTS = {
  low: 8,
  medium: 15,
  high: 25,
  critical: 35,
};

const TYPE_LABELS = {
  server_error_spike: "5xx Spike",
  high_latency: "High Latency",
  repeated_failure: "Repeated Failure",
  malformed_url: "Malformed URL",
};

const hasRecentEvent = async (userId, monitorId, type) => {
  const since = new Date(Date.now() - COOLDOWN_MS);
  const filter = {
    user: userId,
    type,
    detectedAt: { $gte: since },
    isDismissed: false,
  };

  if (monitorId) {
    filter.monitor = monitorId;
  }

  const existing = await SecurityEvent.findOne(filter);
  return Boolean(existing);
};

const createSecurityEvent = async ({
  userId,
  monitor,
  type,
  severity,
  title,
  description,
  metadata,
}) => {
  if (await hasRecentEvent(userId, monitor?._id, type)) {
    return null;
  }

  return SecurityEvent.create({
    user: userId,
    monitor: monitor?._id || null,
    monitorName: monitor?.name || null,
    type,
    severity,
    title,
    description,
    riskPoints: SEVERITY_POINTS[severity],
    metadata,
    detectedAt: new Date(),
  });
};

const getRecentLogs = async (monitorId, limit = WINDOW_SIZE) => {
  return MonitorCheckLog.find({ monitor: monitorId })
    .sort({ checkedAt: -1 })
    .limit(limit)
    .lean();
};

const detectServerErrorSpike = async (monitor, logs) => {
  if (logs.length < 3) {
    return null;
  }

  const serverErrors = logs.filter(
    (log) => log.statusCode && log.statusCode >= 500 && log.statusCode < 600
  );

  const ratio = serverErrors.length / logs.length;
  if (serverErrors.length < 2 && ratio < 0.4) {
    return null;
  }

  const severity =
    serverErrors.length >= 5 || ratio >= 0.6 ? "critical" : "high";

  return createSecurityEvent({
    userId: monitor.user,
    monitor,
    type: "server_error_spike",
    severity,
    title: `5xx spike on ${monitor.name}`,
    description: `${serverErrors.length} of the last ${logs.length} checks returned 5xx server errors.`,
    metadata: {
      url: monitor.url,
      serverErrorCount: serverErrors.length,
      windowSize: logs.length,
      statusCode: logs[0]?.statusCode,
    },
  });
};

const detectHighLatency = async (monitor, checkResult) => {
  const threshold = monitor.latencyThresholdMs || env.defaultLatencyThresholdMs;
  if (!checkResult.isAvailable || checkResult.responseTimeMs <= threshold) {
    return null;
  }

  const severity =
    checkResult.responseTimeMs >= threshold * 2 ? "high" : "medium";

  return createSecurityEvent({
    userId: monitor.user,
    monitor,
    type: "high_latency",
    severity,
    title: `High latency on ${monitor.name}`,
    description: `Response time ${checkResult.responseTimeMs}ms exceeded security threshold of ${threshold}ms.`,
    metadata: {
      url: monitor.url,
      responseTimeMs: checkResult.responseTimeMs,
      statusCode: checkResult.statusCode,
    },
  });
};

const detectRepeatedFailures = async (monitor, logs) => {
  if (logs.length < 3) {
    return null;
  }

  let consecutive = 0;
  for (const log of logs) {
    if (!log.isAvailable) {
      consecutive += 1;
    } else {
      break;
    }
  }

  if (consecutive < 3) {
    return null;
  }

  const severity = consecutive >= 5 ? "critical" : "high";

  return createSecurityEvent({
    userId: monitor.user,
    monitor,
    type: "repeated_failure",
    severity,
    title: `Repeated failures on ${monitor.name}`,
    description: `${consecutive} consecutive monitor checks failed.`,
    metadata: {
      url: monitor.url,
      failureCount: consecutive,
      windowSize: logs.length,
      statusCode: logs[0]?.statusCode,
    },
  });
};

const detectMalformedUrl = async (monitor) => {
  const analysis = analyzeUrlSecurity(monitor.url);
  if (!analysis.isMalformed) {
    return null;
  }

  return createSecurityEvent({
    userId: monitor.user,
    monitor,
    type: "malformed_url",
    severity: "high",
    title: `Malformed URL on ${monitor.name}`,
    description: analysis.issues.join(" "),
    metadata: {
      url: monitor.url,
      issues: analysis.issues,
    },
  });
};

const processCheckSecurity = async (monitor, checkResult) => {
  const logs = await getRecentLogs(monitor._id);

  await Promise.all([
    detectServerErrorSpike(monitor, logs),
    detectHighLatency(monitor, checkResult),
    detectRepeatedFailures(monitor, logs),
  ]);
};

const scanMonitorUrl = async (monitor) => {
  return detectMalformedUrl(monitor);
};

const calculateRiskScore = async (userId) => {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const events = await SecurityEvent.find({
    user: userId,
    isDismissed: false,
    detectedAt: { $gte: since },
  }).lean();

  const score = Math.min(
    100,
    events.reduce((total, event) => total + (event.riskPoints || 0), 0)
  );

  let level = "low";
  if (score >= 75) level = "critical";
  else if (score >= 50) level = "high";
  else if (score >= 25) level = "medium";

  const breakdown = {
    server_error_spike: 0,
    high_latency: 0,
    repeated_failure: 0,
    malformed_url: 0,
  };

  events.forEach((event) => {
    breakdown[event.type] = (breakdown[event.type] || 0) + 1;
  });

  return {
    score,
    level,
    activeEvents: events.length,
    breakdown,
    evaluatedAt: new Date().toISOString(),
  };
};

const listSecurityEvents = async (userId, { type, limit = 50 } = {}) => {
  const filter = { user: userId, isDismissed: false };
  if (type) {
    filter.type = type;
  }

  return SecurityEvent.find(filter)
    .sort({ detectedAt: -1 })
    .limit(Math.min(limit, 200));
};

const dismissSecurityEvent = async (eventId, userId) => {
  const event = await SecurityEvent.findOne({ _id: eventId, user: userId });
  if (!event) {
    throw new Error("Security event not found.");
  }

  event.isDismissed = true;
  await event.save();
  return event;
};

const deleteSecurityEvent = async (eventId, userId) => {
  const event = await SecurityEvent.findOne({ _id: eventId, user: userId });
  if (!event) {
    throw new Error("Security event not found.");
  }

  await event.deleteOne();
};

const deleteMonitorSecurityEvents = async (monitorId) => {
  await SecurityEvent.deleteMany({ monitor: monitorId });
};

module.exports = {
  processCheckSecurity,
  scanMonitorUrl,
  calculateRiskScore,
  listSecurityEvents,
  dismissSecurityEvent,
  deleteSecurityEvent,
  deleteMonitorSecurityEvents,
  TYPE_LABELS,
};

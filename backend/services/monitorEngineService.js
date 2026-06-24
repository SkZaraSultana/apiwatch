const Monitor = require("../models/Monitor");
const MonitorCheckLog = require("../models/MonitorCheckLog");
const { executeHttpCheck } = require("./monitorCheckService");
const { processCheckAlerts } = require("./alertService");
const { processCheckIncidents } = require("./incidentService");
const { processCheckSecurity } = require("./securityEngineService");
const { getIo } = require("./socketService");

const updateMonitorStats = (monitor, checkResult) => {
  const now = new Date();
  const { statusCode, responseTimeMs, isAvailable, errorMessage } = checkResult;

  monitor.totalChecks += 1;

  if (isAvailable) {
    monitor.successfulChecks += 1;

    if (monitor.currentState === "down" && monitor.downtimeStartedAt) {
      const downtimeMs = now.getTime() - monitor.downtimeStartedAt.getTime();
      monitor.totalDowntimeSeconds += Math.floor(downtimeMs / 1000);
      monitor.downtimeStartedAt = null;
    }

    monitor.currentState = "up";
  } else if (monitor.currentState !== "down") {
    monitor.currentState = "down";
    monitor.downtimeStartedAt = now;
  }

  monitor.uptimePercent =
    monitor.totalChecks > 0
      ? Math.round((monitor.successfulChecks / monitor.totalChecks) * 10000) / 100
      : 100;

  monitor.lastCheckedAt = now;
  monitor.lastStatusCode = statusCode;
  monitor.lastResponseTimeMs = responseTimeMs;
  monitor.isAvailable = isAvailable;
  monitor.lastError = errorMessage;
};

const runMonitorCheck = async (monitorId) => {
  const monitor = await Monitor.findById(monitorId);
  if (!monitor || monitor.status !== "active") {
    return null;
  }

  const checkResult = await executeHttpCheck(monitor);
  const previousState = monitor.currentState;
  const downtimeStartedAt = monitor.downtimeStartedAt;

  await MonitorCheckLog.create({
    monitor: monitor._id,
    user: monitor.user,
    statusCode: checkResult.statusCode,
    responseTimeMs: checkResult.responseTimeMs,
    isAvailable: checkResult.isAvailable,
    errorMessage: checkResult.errorMessage,
    checkedAt: new Date(),
  });

  updateMonitorStats(monitor, checkResult);
  await monitor.save();

  await processCheckAlerts(monitor, checkResult, previousState, downtimeStartedAt);
  await processCheckIncidents(monitor, checkResult, previousState, downtimeStartedAt);
  await processCheckSecurity(monitor, checkResult);

  // Emit real-time update for monitor checks if Socket.IO is available
  try {
    const io = getIo();
    if (io) {
      const payload = {
        id: monitor._id,
        user: monitor.user,
        status: monitor.status,
        currentState: monitor.currentState,
        isAvailable: monitor.isAvailable,
        lastStatusCode: monitor.lastStatusCode,
        lastResponseTimeMs: monitor.lastResponseTimeMs,
        lastCheckedAt: monitor.lastCheckedAt,
        uptimePercent: monitor.uptimePercent,
      };
      io.emit("monitor:checked", payload);
      // also emit dashboard and analytics update signals
      io.emit("dashboard:update", { user: monitor.user });
      io.emit("analytics:updated", { user: monitor.user });
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to emit monitor:checked event:", err.message);
  }

  return { monitor, checkResult };
};

const getDueMonitors = async () => {
  const now = Date.now();
  const monitors = await Monitor.find({ status: "active" });

  return monitors.filter((monitor) => {
    if (!monitor.lastCheckedAt) {
      return true;
    }

    const elapsedMs = now - monitor.lastCheckedAt.getTime();
    return elapsedMs >= monitor.interval * 1000;
  });
};

const getMonitorLogs = async (monitorId, userId, { limit = 50 } = {}) => {
  const monitor = await Monitor.findOne({ _id: monitorId, user: userId });
  if (!monitor) {
    throw new Error("Monitor not found.");
  }

  const logs = await MonitorCheckLog.find({ monitor: monitorId })
    .sort({ checkedAt: -1 })
    .limit(Math.min(limit, 200));

  return logs;
};

const deleteMonitorLogs = async (monitorId) => {
  await MonitorCheckLog.deleteMany({ monitor: monitorId });
};

const getMonitorStats = (monitor) => {
  let totalDowntimeSeconds = monitor.totalDowntimeSeconds;

  if (monitor.currentState === "down" && monitor.downtimeStartedAt) {
    const ongoingSeconds = Math.floor(
      (Date.now() - monitor.downtimeStartedAt.getTime()) / 1000
    );
    totalDowntimeSeconds += ongoingSeconds;
  }

  return {
    statusCode: monitor.lastStatusCode,
    responseTimeMs: monitor.lastResponseTimeMs,
    isAvailable: monitor.isAvailable,
    uptimePercent: monitor.uptimePercent,
    totalDowntimeSeconds,
    totalChecks: monitor.totalChecks,
    successfulChecks: monitor.successfulChecks,
    currentState: monitor.currentState,
    lastCheckedAt: monitor.lastCheckedAt,
    lastError: monitor.lastError,
  };
};

module.exports = {
  runMonitorCheck,
  getDueMonitors,
  getMonitorLogs,
  deleteMonitorLogs,
  getMonitorStats,
};

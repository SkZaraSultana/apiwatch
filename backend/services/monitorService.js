const Monitor = require("../models/Monitor");
const { deleteMonitorLogs, runMonitorCheck } = require("./monitorEngineService");
const { deleteMonitorAlerts } = require("./alertService");
const { deleteMonitorIncidents } = require("./incidentService");
const { deleteMonitorSecurityEvents, scanMonitorUrl } = require("./securityEngineService");

const findUserMonitor = async (monitorId, userId) => {
  const monitor = await Monitor.findOne({ _id: monitorId, user: userId });
  if (!monitor) {
    throw new Error("Monitor not found.");
  }
  return monitor;
};

const listMonitors = async (userId) => {
  return Monitor.find({ user: userId }).sort({ createdAt: -1 });
};

const getMonitor = async (monitorId, userId) => findUserMonitor(monitorId, userId);

const createMonitor = async (userId, payload) => {
  const existing = await Monitor.findOne({ user: userId, name: payload.name });
  if (existing) {
    throw new Error("A monitor with this name already exists.");
  }

  // Create and save monitor ONLY - this is the critical path
  const monitor = await Monitor.create({ ...payload, user: userId });

  // Emit monitor created event for real-time clients immediately
  try {
    // lazy require to avoid circular deps
    // eslint-disable-next-line global-require
    const { getIo } = require("./socketService");
    const io = getIo();
    if (io) {
      io.emit("monitor:created", {
        id: monitor._id,
        user: monitor.user,
        name: monitor.name,
        url: monitor.url,
        status: monitor.status,
        currentState: monitor.currentState,
        lastStatusCode: monitor.lastStatusCode,
        lastResponseTimeMs: monitor.lastResponseTimeMs,
        lastCheckedAt: monitor.lastCheckedAt,
        uptimePercent: monitor.uptimePercent,
      });
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to emit monitor:created event:", err.message);
  }

  // Run security scan asynchronously (fire and forget)
  setImmediate(() => {
    if (scanMonitorUrl) {
      scanMonitorUrl(monitor).catch((err) => {
        // eslint-disable-next-line no-console
        console.warn(`Security scan failed for monitor ${monitor._id}:`, err.message);
      });
    }
  });

  // Trigger first health check asynchronously (fire and forget)
  setImmediate(() => {
    runMonitorCheck(monitor._id).catch((err) => {
      // eslint-disable-next-line no-console
      console.error(`Initial monitor check failed for ${monitor._id}:`, err.message);
    });
  });

  return monitor;
};

const updateMonitor = async (monitorId, userId, payload) => {
  const monitor = await findUserMonitor(monitorId, userId);

  if (payload.name && payload.name !== monitor.name) {
    const duplicate = await Monitor.findOne({
      user: userId,
      name: payload.name,
      _id: { $ne: monitorId },
    });
    if (duplicate) {
      throw new Error("A monitor with this name already exists.");
    }
  }

  Object.assign(monitor, payload);
  await monitor.save();
  if (payload.url) {
    await scanMonitorUrl(monitor);
  }
  return monitor;
};

const deleteMonitor = async (monitorId, userId) => {
  const monitor = await findUserMonitor(monitorId, userId);
  await deleteMonitorLogs(monitor._id);
  await deleteMonitorAlerts(monitor._id);
  await deleteMonitorIncidents(monitor._id);
  await deleteMonitorSecurityEvents(monitor._id);
  await monitor.deleteOne();
};

const pauseMonitor = async (monitorId, userId) => {
  const monitor = await findUserMonitor(monitorId, userId);

  if (monitor.currentState === "down" && monitor.downtimeStartedAt) {
    const downtimeMs = Date.now() - monitor.downtimeStartedAt.getTime();
    monitor.totalDowntimeSeconds += Math.floor(downtimeMs / 1000);
    monitor.downtimeStartedAt = null;
  }

  monitor.status = "paused";
  await monitor.save();
  return monitor;
};

const resumeMonitor = async (monitorId, userId) => {
  const monitor = await findUserMonitor(monitorId, userId);
  monitor.status = "active";
  await monitor.save();
  return monitor;
};

module.exports = {
  createMonitor,
  listMonitors,
  getMonitor,
  updateMonitor,
  deleteMonitor,
  pauseMonitor,
  resumeMonitor,
  runMonitorCheck,
};

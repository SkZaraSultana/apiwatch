const monitorService = require("../services/monitorService");
const { getMonitorLogs, getMonitorStats } = require("../services/monitorEngineService");
const { validateMonitorPayload } = require("../utils/monitorValidation");

const sanitizeMonitor = (monitor) => ({
  id: monitor._id,
  name: monitor.name,
  url: monitor.url,
  method: monitor.method,
  expectedStatus: monitor.expectedStatus,
  interval: monitor.interval,
  timeout: monitor.timeout,
  latencyThresholdMs: monitor.latencyThresholdMs,
  status: monitor.status,
  stats: getMonitorStats(monitor),
  createdAt: monitor.createdAt,
  updatedAt: monitor.updatedAt,
});

const sanitizeLog = (log) => ({
  id: log._id,
  statusCode: log.statusCode,
  responseTimeMs: log.responseTimeMs,
  isAvailable: log.isAvailable,
  errorMessage: log.errorMessage,
  checkedAt: log.checkedAt,
});

const listMonitors = async (req, res) => {
  try {
    const monitors = await monitorService.listMonitors(req.user._id);
    return res.status(200).json({
      monitors: monitors.map(sanitizeMonitor),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMonitor = async (req, res) => {
  try {
    const monitor = await monitorService.getMonitor(req.params.id, req.user._id);
    return res.status(200).json({ monitor: sanitizeMonitor(monitor) });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const createMonitor = async (req, res) => {
  const { errors, data } = validateMonitorPayload(req.body);
  if (errors.length) {
    return res.status(400).json({ message: errors.join(" ") });
  }

  try {
    const monitor = await monitorService.createMonitor(req.user._id, data);
    return res.status(201).json({
      message: "Monitor created successfully.",
      monitor: sanitizeMonitor(monitor),
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updateMonitor = async (req, res) => {
  const { errors, data } = validateMonitorPayload(req.body, { partial: true });
  if (errors.length) {
    return res.status(400).json({ message: errors.join(" ") });
  }

  if (Object.keys(data).length === 0) {
    return res.status(400).json({ message: "No valid fields provided for update." });
  }

  try {
    const monitor = await monitorService.updateMonitor(
      req.params.id,
      req.user._id,
      data
    );
    return res.status(200).json({
      message: "Monitor updated successfully.",
      monitor: sanitizeMonitor(monitor),
    });
  } catch (error) {
    const status = error.message === "Monitor not found." ? 404 : 400;
    return res.status(status).json({ message: error.message });
  }
};

const deleteMonitor = async (req, res) => {
  try {
    await monitorService.deleteMonitor(req.params.id, req.user._id);
    return res.status(200).json({ message: "Monitor deleted successfully." });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const pauseMonitor = async (req, res) => {
  try {
    const monitor = await monitorService.pauseMonitor(req.params.id, req.user._id);
    return res.status(200).json({
      message: "Monitor paused successfully.",
      monitor: sanitizeMonitor(monitor),
    });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const resumeMonitor = async (req, res) => {
  try {
    const monitor = await monitorService.resumeMonitor(req.params.id, req.user._id);
    return res.status(200).json({
      message: "Monitor resumed successfully.",
      monitor: sanitizeMonitor(monitor),
    });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const getMonitorLogsHandler = async (req, res) => {
  try {
    const limit = Number(req.query.limit || 50);
    const logs = await getMonitorLogs(req.params.id, req.user._id, { limit });
    return res.status(200).json({
      logs: logs.map(sanitizeLog),
    });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

module.exports = {
  listMonitors,
  getMonitor,
  createMonitor,
  updateMonitor,
  deleteMonitor,
  pauseMonitor,
  resumeMonitor,
  getMonitorLogs: getMonitorLogsHandler,
};

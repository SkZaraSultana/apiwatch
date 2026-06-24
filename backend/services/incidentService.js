const Incident = require("../models/Incident");
const { getIo } = require("./socketService");

const ACTIVE_STATUSES = ["open", "investigating"];

const addTimelineEntry = (incident, { status, message, actor = "system" }) => {
  incident.timeline.push({
    status,
    message,
    actor,
    createdAt: new Date(),
  });
};

const findActiveIncident = async (monitorId) => {
  return Incident.findOne({
    monitor: monitorId,
    status: { $in: ACTIVE_STATUSES },
  });
};

const openIncident = async (monitor, checkResult) => {
  const existing = await findActiveIncident(monitor._id);
  if (existing) {
    return existing;
  }

  const message =
    checkResult.errorMessage ||
    `Monitor check failed with status ${checkResult.statusCode ?? "N/A"}.`;

  const incident = await Incident.create({
    user: monitor.user,
    monitor: monitor._id,
    monitorName: monitor.name,
    title: `${monitor.name} outage`,
    status: "open",
    startedAt: new Date(),
    metadata: {
      url: monitor.url,
      method: monitor.method,
      statusCode: checkResult.statusCode,
      responseTimeMs: checkResult.responseTimeMs,
      errorMessage: checkResult.errorMessage,
    },
    timeline: [
      {
        status: "open",
        message: `Incident opened automatically. ${message}`,
        actor: "system",
        createdAt: new Date(),
      },
    ],
  });

  // Emit socket event for new incident
  try {
    const io = getIo();
    if (io) {
      io.emit("incident:created", {
        id: incident._id,
        user: incident.user,
        monitor: incident.monitor,
        monitorName: incident.monitorName,
        title: incident.title,
        status: incident.status,
        startedAt: incident.startedAt,
      });
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to emit incident:created event:", err.message);
  }

  // create notification for incident
  try {
    // require lazily to avoid circular deps
    // eslint-disable-next-line global-require
    const { createNotification } = require("./notificationService");
    await createNotification({
      userId: incident.user,
      type: "incident",
      title: incident.title,
      message: incident.timeline?.[0]?.message || "Incident opened",
      referenceId: incident._id,
      metadata: { status: incident.status },
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to create notification for incident:", err.message);
  }

  return incident;
};

const resolveIncident = async (monitor, checkResult, downtimeSeconds = 0) => {
  const incident = await findActiveIncident(monitor._id);
  if (!incident) {
    return null;
  }

  incident.status = "resolved";
  incident.resolvedAt = new Date();
  incident.metadata.downtimeSeconds = downtimeSeconds;
  incident.metadata.statusCode = checkResult.statusCode;
  incident.metadata.responseTimeMs = checkResult.responseTimeMs;

  addTimelineEntry(incident, {
    status: "resolved",
    message: `Incident resolved automatically after ${downtimeSeconds}s downtime. Monitor recovered with status ${checkResult.statusCode}.`,
    actor: "system",
  });

  await incident.save();
  // Emit socket event for resolved incident
  try {
    const io = getIo();
    if (io) {
      io.emit("incident:resolved", {
        id: incident._id,
        user: incident.user,
        monitor: incident.monitor,
        monitorName: incident.monitorName,
        resolvedAt: incident.resolvedAt,
        downtimeSeconds: incident.metadata?.downtimeSeconds || 0,
      });
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to emit incident:resolved event:", err.message);
  }

  return incident;
};

const listIncidents = async (userId, { status, monitorId, limit = 50 } = {}) => {
  const filter = { user: userId };

  if (status) {
    filter.status = status;
  }

  if (monitorId) {
    filter.monitor = monitorId;
  }

  return Incident.find(filter)
    .sort({ createdAt: -1 })
    .limit(Math.min(limit, 200));
};

const getIncident = async (incidentId, userId) => {
  const incident = await Incident.findOne({ _id: incidentId, user: userId });
  if (!incident) {
    throw new Error("Incident not found.");
  }
  return incident;
};

const updateIncidentStatus = async (
  incidentId,
  userId,
  { status, note }
) => {
  const incident = await getIncident(incidentId, userId);

  if (!["open", "investigating", "resolved"].includes(status)) {
    throw new Error("Invalid incident status.");
  }

  if (incident.status === "resolved" && status !== "resolved") {
    throw new Error("Resolved incidents cannot be reopened.");
  }

  const statusMessages = {
    open: "Incident marked as open.",
    investigating: "Incident is now under investigation.",
    resolved: "Incident marked as resolved.",
  };

  incident.status = status;

  if (status === "resolved") {
    incident.resolvedAt = new Date();
  }

  addTimelineEntry(incident, {
    status,
    message: note?.trim() || statusMessages[status],
    actor: "user",
  });

  await incident.save();
  return incident;
};

const deleteIncident = async (incidentId, userId) => {
  const incident = await getIncident(incidentId, userId);
  await incident.deleteOne();
};

const deleteMonitorIncidents = async (monitorId) => {
  await Incident.deleteMany({ monitor: monitorId });
};

const getIncidentSummary = async (userId) => {
  const [total, open, investigating, resolved] = await Promise.all([
    Incident.countDocuments({ user: userId }),
    Incident.countDocuments({ user: userId, status: "open" }),
    Incident.countDocuments({ user: userId, status: "investigating" }),
    Incident.countDocuments({ user: userId, status: "resolved" }),
  ]);

  return { total, open, investigating, resolved };
};

const processCheckIncidents = async (
  monitor,
  checkResult,
  previousState,
  downtimeStartedAt = null
) => {
  if (!checkResult.isAvailable && previousState !== "down") {
    await openIncident(monitor, checkResult);
    return;
  }

  if (checkResult.isAvailable && previousState === "down") {
    const checkedAt = new Date();
    const downtimeSeconds = downtimeStartedAt
      ? Math.max(
          1,
          Math.floor(
            (checkedAt.getTime() - new Date(downtimeStartedAt).getTime()) / 1000
          )
        )
      : 0;

    await resolveIncident(monitor, checkResult, downtimeSeconds);
  }
};

module.exports = {
  openIncident,
  resolveIncident,
  listIncidents,
  getIncident,
  updateIncidentStatus,
  deleteIncident,
  deleteMonitorIncidents,
  getIncidentSummary,
  processCheckIncidents,
};

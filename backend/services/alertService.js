const Alert = require("../models/Alert");
const User = require("../models/User");
const { sendEmail } = require("./emailService");
const env = require("../config/env");
const {
  getApiDownTemplate,
  getRecoveryTemplate,
  getLatencyTemplate,
} = require("../emails/alertTemplates");
const { getIo } = require("./socketService");
const { createNotification } = require("./notificationService");

const TYPE_LABELS = {
  api_down: "API Down",
  recovery: "Recovery",
  latency: "Latency",
};

const createAndNotifyAlert = async ({
  userId,
  monitor,
  type,
  severity,
  title,
  message,
  metadata,
}) => {
  const alert = await Alert.create({
    user: userId,
    monitor: monitor._id,
    monitorName: monitor.name,
    type,
    severity,
    title,
    message,
    metadata,
  });

  const user = await User.findById(userId);
  if (!user?.email) {
    return alert;
  }

  const templatePayload = {
    monitorName: monitor.name,
    url: monitor.url,
    method: monitor.method,
    statusCode: metadata.statusCode,
    errorMessage: metadata.errorMessage,
    responseTimeMs: metadata.responseTimeMs,
    thresholdMs: metadata.latencyThresholdMs,
    downtimeSeconds: metadata.downtimeSeconds,
    checkedAt: metadata.checkedAt,
  };

  let template;
  if (type === "api_down") {
    template = getApiDownTemplate(templatePayload);
  } else if (type === "recovery") {
    template = getRecoveryTemplate(templatePayload);
  } else {
    template = getLatencyTemplate(templatePayload);
  }

  try {
    await sendEmail({
      to: user.email,
      subject: template.subject,
      html: template.html,
    });

    alert.emailSent = true;
    alert.emailSentAt = new Date();
    await alert.save();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to send alert email:", error.message);
  }

  // Emit socket event for new alert
  try {
    const io = getIo();
    if (io) {
      io.emit("alert:created", {
        id: alert._id,
        user: alert.user,
        monitor: alert.monitor,
        monitorName: alert.monitorName,
        type: alert.type,
        severity: alert.severity,
        title: alert.title,
        message: alert.message,
        createdAt: alert.createdAt,
        isRead: alert.isRead,
      });
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to emit alert:created event:", err.message);
  }

  // create a persistent notification for UI
  try {
    await createNotification({
      userId: alert.user,
      type: "alert",
      title: alert.title,
      message: alert.message,
      referenceId: alert._id,
      metadata: {
        severity: alert.severity,
        type: alert.type,
      },
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to create notification for alert:", err.message);
  }

  return alert;
};


const processCheckAlerts = async (
  monitor,
  checkResult,
  previousState,
  downtimeStartedAt = null
) => {
  const checkedAt = new Date();
  const thresholdMs = monitor.latencyThresholdMs || env.defaultLatencyThresholdMs;
  const cooldownMs = env.alertLatencyCooldownMinutes * 60 * 1000;

  if (!checkResult.isAvailable && previousState !== "down") {
    await createAndNotifyAlert({
      userId: monitor.user,
      monitor,
      type: "api_down",
      severity: "critical",
      title: `${monitor.name} is down`,
      message: checkResult.errorMessage || "Monitor check failed.",
      metadata: {
        url: monitor.url,
        method: monitor.method,
        statusCode: checkResult.statusCode,
        responseTimeMs: checkResult.responseTimeMs,
        errorMessage: checkResult.errorMessage,
        checkedAt,
      },
    });
    return;
  }

  if (checkResult.isAvailable && previousState === "down") {
    const downtimeSeconds = downtimeStartedAt
      ? Math.max(
          1,
          Math.floor((checkedAt.getTime() - new Date(downtimeStartedAt).getTime()) / 1000)
        )
      : 0;

    await createAndNotifyAlert({
      userId: monitor.user,
      monitor,
      type: "recovery",
      severity: "info",
      title: `${monitor.name} recovered`,
      message: "Monitor is responding normally again.",
      metadata: {
        url: monitor.url,
        method: monitor.method,
        statusCode: checkResult.statusCode,
        responseTimeMs: checkResult.responseTimeMs,
        downtimeSeconds,
        checkedAt,
      },
    });
    return;
  }

  if (
    checkResult.isAvailable &&
    checkResult.responseTimeMs > thresholdMs
  ) {
    const lastAlertAt = monitor.lastLatencyAlertAt?.getTime() || 0;
    if (checkedAt.getTime() - lastAlertAt < cooldownMs) {
      return;
    }

    await createAndNotifyAlert({
      userId: monitor.user,
      monitor,
      type: "latency",
      severity: "warning",
      title: `${monitor.name} latency spike`,
      message: `Response time ${checkResult.responseTimeMs}ms exceeded threshold of ${thresholdMs}ms.`,
      metadata: {
        url: monitor.url,
        method: monitor.method,
        statusCode: checkResult.statusCode,
        responseTimeMs: checkResult.responseTimeMs,
        latencyThresholdMs: thresholdMs,
        checkedAt,
      },
    });

    monitor.lastLatencyAlertAt = checkedAt;
    await monitor.save();
  }
};

const listAlerts = async (userId, { type, limit = 50 } = {}) => {
  const filter = { user: userId };
  if (type) {
    filter.type = type;
  }

  return Alert.find(filter)
    .sort({ createdAt: -1 })
    .limit(Math.min(limit, 200));
};

const getAlert = async (alertId, userId) => {
  const alert = await Alert.findOne({ _id: alertId, user: userId });
  if (!alert) {
    throw new Error("Alert not found.");
  }
  return alert;
};

const markAlertRead = async (alertId, userId) => {
  const alert = await getAlert(alertId, userId);
  alert.isRead = true;
  await alert.save();
  return alert;
};

const markAllAlertsRead = async (userId) => {
  await Alert.updateMany({ user: userId, isRead: false }, { isRead: true });
};

const deleteAlert = async (alertId, userId) => {
  const alert = await getAlert(alertId, userId);
  await alert.deleteOne();
};

const deleteMonitorAlerts = async (monitorId) => {
  await Alert.deleteMany({ monitor: monitorId });
};

const getAlertSummary = async (userId) => {
  const [total, unread, apiDown, recovery, latency] = await Promise.all([
    Alert.countDocuments({ user: userId }),
    Alert.countDocuments({ user: userId, isRead: false }),
    Alert.countDocuments({ user: userId, type: "api_down" }),
    Alert.countDocuments({ user: userId, type: "recovery" }),
    Alert.countDocuments({ user: userId, type: "latency" }),
  ]);

  return { total, unread, apiDown, recovery, latency };
};

module.exports = {
  processCheckAlerts,
  listAlerts,
  getAlert,
  markAlertRead,
  markAllAlertsRead,
  deleteAlert,
  deleteMonitorAlerts,
  getAlertSummary,
  TYPE_LABELS,
};

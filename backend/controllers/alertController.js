const alertService = require("../services/alertService");

const sanitizeAlert = (alert) => ({
  id: alert._id,
  monitorId: alert.monitor,
  monitorName: alert.monitorName,
  type: alert.type,
  severity: alert.severity,
  title: alert.title,
  message: alert.message,
  metadata: alert.metadata,
  emailSent: alert.emailSent,
  emailSentAt: alert.emailSentAt,
  isRead: alert.isRead,
  createdAt: alert.createdAt,
  updatedAt: alert.updatedAt,
});

const listAlerts = async (req, res) => {
  try {
    const { type, limit } = req.query;
    const alerts = await alertService.listAlerts(req.user._id, { type, limit });
    const summary = await alertService.getAlertSummary(req.user._id);

    return res.status(200).json({
      alerts: alerts.map(sanitizeAlert),
      summary,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAlert = async (req, res) => {
  try {
    const alert = await alertService.getAlert(req.params.id, req.user._id);
    return res.status(200).json({ alert: sanitizeAlert(alert) });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const markAlertRead = async (req, res) => {
  try {
    const alert = await alertService.markAlertRead(req.params.id, req.user._id);
    return res.status(200).json({
      message: "Alert marked as read.",
      alert: sanitizeAlert(alert),
    });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const markAllAlertsRead = async (req, res) => {
  try {
    await alertService.markAllAlertsRead(req.user._id);
    return res.status(200).json({ message: "All alerts marked as read." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteAlert = async (req, res) => {
  try {
    await alertService.deleteAlert(req.params.id, req.user._id);
    return res.status(200).json({ message: "Alert deleted successfully." });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

module.exports = {
  listAlerts,
  getAlert,
  markAlertRead,
  markAllAlertsRead,
  deleteAlert,
};

const securityEngineService = require("../services/securityEngineService");

const sanitizeEvent = (event) => ({
  id: event._id,
  monitorId: event.monitor,
  monitorName: event.monitorName,
  type: event.type,
  typeLabel: securityEngineService.TYPE_LABELS[event.type] || event.type,
  severity: event.severity,
  title: event.title,
  description: event.description,
  riskPoints: event.riskPoints,
  metadata: event.metadata,
  detectedAt: event.detectedAt,
  isDismissed: event.isDismissed,
  createdAt: event.createdAt,
});

const getSecurityOverview = async (req, res) => {
  try {
    const [events, risk] = await Promise.all([
      securityEngineService.listSecurityEvents(req.user._id, {
        type: req.query.type,
        limit: req.query.limit,
      }),
      securityEngineService.calculateRiskScore(req.user._id),
    ]);

    return res.status(200).json({
      risk,
      events: events.map(sanitizeEvent),
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getRiskScore = async (req, res) => {
  try {
    const risk = await securityEngineService.calculateRiskScore(req.user._id);
    return res.status(200).json({ risk });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const dismissEvent = async (req, res) => {
  try {
    const event = await securityEngineService.dismissSecurityEvent(
      req.params.id,
      req.user._id
    );
    const risk = await securityEngineService.calculateRiskScore(req.user._id);

    return res.status(200).json({
      message: "Security event dismissed.",
      event: sanitizeEvent(event),
      risk,
    });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    await securityEngineService.deleteSecurityEvent(req.params.id, req.user._id);
    const risk = await securityEngineService.calculateRiskScore(req.user._id);

    return res.status(200).json({
      message: "Security event deleted.",
      risk,
    });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

module.exports = {
  getSecurityOverview,
  getRiskScore,
  dismissEvent,
  deleteEvent,
};

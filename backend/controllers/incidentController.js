const incidentService = require("../services/incidentService");

const sanitizeTimelineEntry = (entry) => ({
  id: entry._id,
  status: entry.status,
  message: entry.message,
  actor: entry.actor,
  createdAt: entry.createdAt,
});

const sanitizeIncident = (incident) => ({
  id: incident._id,
  monitorId: incident.monitor,
  monitorName: incident.monitorName,
  title: incident.title,
  status: incident.status,
  timeline: incident.timeline.map(sanitizeTimelineEntry),
  startedAt: incident.startedAt,
  resolvedAt: incident.resolvedAt,
  metadata: incident.metadata,
  createdAt: incident.createdAt,
  updatedAt: incident.updatedAt,
});

const listIncidents = async (req, res) => {
  try {
    const { status, monitorId, limit } = req.query;
    const incidents = await incidentService.listIncidents(req.user._id, {
      status,
      monitorId,
      limit,
    });
    const summary = await incidentService.getIncidentSummary(req.user._id);

    return res.status(200).json({
      incidents: incidents.map(sanitizeIncident),
      summary,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getIncident = async (req, res) => {
  try {
    const incident = await incidentService.getIncident(req.params.id, req.user._id);
    return res.status(200).json({ incident: sanitizeIncident(incident) });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

const updateIncidentStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    if (!status) {
      return res.status(400).json({ message: "Status is required." });
    }

    const incident = await incidentService.updateIncidentStatus(
      req.params.id,
      req.user._id,
      { status, note }
    );

    return res.status(200).json({
      message: "Incident status updated.",
      incident: sanitizeIncident(incident),
    });
  } catch (error) {
    const code = error.message === "Incident not found." ? 404 : 400;
    return res.status(code).json({ message: error.message });
  }
};

const deleteIncident = async (req, res) => {
  try {
    await incidentService.deleteIncident(req.params.id, req.user._id);
    return res.status(200).json({ message: "Incident deleted successfully." });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
};

module.exports = {
  listIncidents,
  getIncident,
  updateIncidentStatus,
  deleteIncident,
};

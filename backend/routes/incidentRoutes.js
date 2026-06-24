const express = require("express");
const incidentController = require("../controllers/incidentController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", incidentController.listIncidents);
router.get("/:id", incidentController.getIncident);
router.patch("/:id/status", incidentController.updateIncidentStatus);
router.delete("/:id", incidentController.deleteIncident);

module.exports = router;

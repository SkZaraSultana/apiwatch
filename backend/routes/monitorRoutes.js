const express = require("express");
const monitorController = require("../controllers/monitorController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", monitorController.listMonitors);
router.get("/:id/logs", monitorController.getMonitorLogs);
router.get("/:id", monitorController.getMonitor);
router.post("/", monitorController.createMonitor);
router.put("/:id", monitorController.updateMonitor);
router.delete("/:id", monitorController.deleteMonitor);
router.patch("/:id/pause", monitorController.pauseMonitor);
router.patch("/:id/resume", monitorController.resumeMonitor);

module.exports = router;

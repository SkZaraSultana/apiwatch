const express = require("express");
const alertController = require("../controllers/alertController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", alertController.listAlerts);
router.patch("/read-all", alertController.markAllAlertsRead);
router.get("/:id", alertController.getAlert);
router.patch("/:id/read", alertController.markAlertRead);
router.delete("/:id", alertController.deleteAlert);

module.exports = router;

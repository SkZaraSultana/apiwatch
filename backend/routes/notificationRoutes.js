const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const notificationController = require("../controllers/notificationController");

router.use(authMiddleware);

router.get("/", notificationController.listNotifications);
router.post("/:id/read", notificationController.markRead);
router.post("/read-all", notificationController.markAllRead);

module.exports = router;

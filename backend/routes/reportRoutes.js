const express = require("express");
const reportController = require("../controllers/reportController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/preview", reportController.getPreview);
router.get("/export", reportController.exportReport);
router.get("/history", reportController.getHistory);

module.exports = router;

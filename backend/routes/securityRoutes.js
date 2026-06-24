const express = require("express");
const securityController = require("../controllers/securityController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/overview", securityController.getSecurityOverview);
router.get("/risk-score", securityController.getRiskScore);
router.patch("/events/:id/dismiss", securityController.dismissEvent);
router.delete("/events/:id", securityController.deleteEvent);

module.exports = router;

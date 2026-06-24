const express = require("express");
const statusPageController = require("../controllers/statusPageController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/public/:slug", statusPageController.getPublicStatus);

router.use(authMiddleware);
router.get("/", statusPageController.getMyStatusPage);
router.post("/generate", statusPageController.generateStatusPage);
router.patch("/", statusPageController.updateStatusPage);

module.exports = router;

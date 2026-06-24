const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);
router.post("/logout", authController.logout);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);
router.get("/me", authMiddleware, authController.getMe);

module.exports = router;

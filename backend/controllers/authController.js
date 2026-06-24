const authService = require("../services/authService");
const env = require("../config/env");

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/api/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  isEmailVerified: user.isEmailVerified,
  createdAt: user.createdAt,
});

const register = async (req, res) => {
  try {
    console.log("REGISTER REQUEST:", req.body);

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required.",
      });
    }

    const { user, accessToken, refreshToken } = await authService.register({
      name,
      email,
      password,
    });

    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.status(201).json({
      message: "Registration successful.",
      accessToken,
      user: sanitizeUser(user),
    });
  } catch (error) {
    console.error("=================================");
    console.error("REGISTER ERROR:");
    console.error(error.stack || error);
    console.error("=================================");

    return res.status(400).json({
      message: error.message || "Registration failed.",
    });
  }
};

const login = async (req, res) => {
  try {
    console.log("LOGIN REQUEST:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const { user, accessToken, refreshToken } =
      await authService.login({
        email,
        password,
      });

    res.cookie("refreshToken", refreshToken, cookieOptions);

    return res.status(200).json({
      message: "Login successful.",
      accessToken,
      user: sanitizeUser(user),
      apiBaseUrl: env.appBaseUrl,
    });
  } catch (error) {
    console.error("=================================");
    console.error("LOGIN ERROR:");
    console.error(error.stack || error);
    console.error("=================================");

    return res.status(401).json({
      message: error.message || "Login failed.",
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        message: "Refresh token is missing.",
      });
    }

    const {
      user,
      accessToken,
      refreshToken: nextRefreshToken,
    } = await authService.refreshSession(token);

    res.cookie("refreshToken", nextRefreshToken, cookieOptions);

    return res.status(200).json({
      accessToken,
      user: sanitizeUser(user),
    });
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    await authService.logout(token);

    res.clearCookie("refreshToken", {
      ...cookieOptions,
      maxAge: undefined,
    });

    return res.status(200).json({
      message: "Logged out successfully.",
    });
  } catch (error) {
    return res.status(400).json({
      message: "Unable to logout.",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    console.log("FORGOT PASSWORD REQUEST:", req.body);
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required.",
      });
    }

    await authService.sendForgotPasswordEmail(email);

    return res.status(200).json({
      message:
        "If this email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error.stack || error);
    return res.status(400).json({
      message: error.message || "Unable to send reset link.",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        message: "Password is required.",
      });
    }

    await authService.resetPassword(token, password);

    return res.status(200).json({
      message: "Password has been reset.",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const getMe = async (req, res) => {
  return res.status(200).json({
    user: sanitizeUser(req.user),
  });
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  getMe,
};
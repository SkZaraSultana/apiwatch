const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
  generateOpaqueToken,
} = require("../utils/token");
const env = require("../config/env");

const DAY_MS = 24 * 60 * 60 * 1000;

const createAuthPayload = async (user) => {
  const accessToken = signAccessToken(user._id.toString());
  const refreshToken = signRefreshToken(user._id.toString());
  const refreshTokenHash = hashToken(refreshToken);

  await RefreshToken.create({
    user: user._id,
    tokenHash: refreshTokenHash,
    expiresAt: new Date(Date.now() + 7 * DAY_MS),
  });

  return { accessToken, refreshToken };
};

const register = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new Error("Email is already registered.");
  }

  const user = await User.create({
    name,
    email,
    password,
    isEmailVerified: true,
  });

  console.log("User registered successfully:", user.email);

  const { accessToken, refreshToken } = await createAuthPayload(user);

  return {
    user,
    accessToken,
    refreshToken,
  };
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("Invalid credentials.");
  }

  const passwordMatch = await user.comparePassword(password);

  if (!passwordMatch) {
    throw new Error("Invalid credentials.");
  }

  const tokens = await createAuthPayload(user);

  return {
    user,
    ...tokens,
  };
};

const refreshSession = async (refreshToken) => {
  const payload = verifyRefreshToken(refreshToken);
  const tokenHash = hashToken(refreshToken);

  const storedToken = await RefreshToken.findOne({
    tokenHash,
    revokedAt: null,
  });

  if (!storedToken || storedToken.expiresAt < new Date()) {
    throw new Error("Refresh token is invalid or expired.");
  }

  const user = await User.findById(payload.sub);

  if (!user) {
    throw new Error("User no longer exists.");
  }

  storedToken.revokedAt = new Date();
  await storedToken.save();

  const tokens = await createAuthPayload(user);

  return {
    user,
    ...tokens,
  };
};

const logout = async (refreshToken) => {
  if (!refreshToken) return;

  const tokenHash = hashToken(refreshToken);

  await RefreshToken.findOneAndUpdate(
    {
      tokenHash,
      revokedAt: null,
    },
    {
      revokedAt: new Date(),
    }
  );
};

const sendForgotPasswordEmail = async (email) => {
  const user = await User.findOne({ email });

  if (!user) return;

  const resetToken = generateOpaqueToken();

  user.passwordResetToken = hashToken(resetToken);
  user.passwordResetTokenExpiresAt = new Date(Date.now() + DAY_MS);

  await user.save();

  const resetUrl = `${env.clientUrl}/reset-password/${resetToken}`;
  console.log("Password reset URL:", resetUrl);
  console.log(`Forgot password request for ${email}: reset link -> ${resetUrl}`);
};

const resetPassword = async (token, newPassword) => {
  const tokenHash = hashToken(token);

  const user = await User.findOne({
    passwordResetToken: tokenHash,
    passwordResetTokenExpiresAt: {
      $gt: new Date(),
    },
  }).select("+password");

  if (!user) {
    throw new Error("Reset token is invalid or expired.");
  }

  user.password = newPassword;
  user.passwordResetToken = null;
  user.passwordResetTokenExpiresAt = null;

  await user.save();

  await RefreshToken.updateMany(
    {
      user: user._id,
      revokedAt: null,
    },
    {
      revokedAt: new Date(),
    }
  );
};

module.exports = {
  register,
  login,
  refreshSession,
  logout,
  sendForgotPasswordEmail,
  resetPassword,
};
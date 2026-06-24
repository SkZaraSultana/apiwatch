const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const env = require("../config/env");

const signAccessToken = (userId) =>
  jwt.sign({ sub: userId }, env.jwtAccessSecret, {
    expiresIn: env.accessTokenExpiresIn,
  });

const signRefreshToken = (userId) =>
  jwt.sign({ sub: userId, type: "refresh" }, env.jwtRefreshSecret, {
    expiresIn: env.refreshTokenExpiresIn,
  });

const verifyAccessToken = (token) => jwt.verify(token, env.jwtAccessSecret);
const verifyRefreshToken = (token) => jwt.verify(token, env.jwtRefreshSecret);

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const generateOpaqueToken = () => crypto.randomBytes(32).toString("hex");

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  hashToken,
  generateOpaqueToken,
};

const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const env = {
  port: Number(process.env.PORT || 5000),
  mongoUri: process.env.MONGO_URI || "",
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  jwtAccessSecret:
    process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || "access-secret-change-me",
  jwtRefreshSecret:
    process.env.JWT_REFRESH_SECRET || "refresh-secret-change-me",
  accessTokenExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  refreshTokenExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  appBaseUrl: process.env.APP_BASE_URL || "http://localhost:5000",
  smtpHost: process.env.SMTP_HOST || "",
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
  smtpFrom: process.env.SMTP_FROM || "noreply@apiwatch.dev",
  monitorTickSeconds: Number(process.env.MONITOR_TICK_SECONDS || 30),
  defaultLatencyThresholdMs: Number(process.env.ALERT_LATENCY_THRESHOLD_MS || 3000),
  alertLatencyCooldownMinutes: Number(process.env.ALERT_LATENCY_COOLDOWN_MINUTES || 60),
  securityEventCooldownMinutes: Number(process.env.SECURITY_EVENT_COOLDOWN_MINUTES || 30),
  securityAnalysisWindow: Number(process.env.SECURITY_ANALYSIS_WINDOW || 10),
};

module.exports = env;

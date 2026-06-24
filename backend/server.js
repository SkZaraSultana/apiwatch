const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDb = require("./config/db");
const env = require("./config/env");
const authRoutes = require("./routes/authRoutes");
const monitorRoutes = require("./routes/monitorRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const alertRoutes = require("./routes/alertRoutes");
const incidentRoutes = require("./routes/incidentRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const securityRoutes = require("./routes/securityRoutes");
const reportRoutes = require("./routes/reportRoutes");
const statusPageRoutes = require("./routes/statusPageRoutes");
const errorHandler = require("./middleware/errorHandler");
const { startMonitorScheduler } = require("./schedulers");

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      if (
        !origin ||
        origin === env.clientUrl ||
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "APIWatch backend is running." });
});

app.use("/api/auth", authRoutes);
app.use("/api/monitors", monitorRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/security", securityRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/status-page", statusPageRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.use(errorHandler);

const http = require("http");
const { initSocket } = require("./services/socketService");

const start = async () => {
  try {
    await connectDb();
    startMonitorScheduler(env.monitorTickSeconds);

    const server = http.createServer(app);
    // Initialize Socket.IO (non-blocking if socket.io is not installed)
    initSocket(server);

    server.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on http://localhost:${env.port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Startup error:", error.message);
    process.exit(1);
  }
};

start();

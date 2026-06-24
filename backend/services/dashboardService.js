const mongoose = require("mongoose");
const Monitor = require("../models/Monitor");
const MonitorCheckLog = require("../models/MonitorCheckLog");
const Incident = require("../models/Incident");

/**
 * Get comprehensive dashboard metrics
 * Returns: total monitors, online/offline counts, global uptime, average response time, incidents
 */
const getDashboardMetrics = async (userId) => {
  // Get all monitors for the user
  const monitors = await Monitor.find({ user: userId }).lean();

  if (monitors.length === 0) {
    return {
      totalMonitors: 0,
      onlineMonitors: 0,
      offlineMonitors: 0,
      unknownMonitors: 0,
      globalUptimePercent: 0,
      averageResponseTimeMs: 0,
      openIncidents: 0,
      monitorCount: 0,
      health: [],
    };
  }

  // Count monitors by state
  const onlineMonitors = monitors.filter((m) => m.currentState === "up").length;
  const offlineMonitors = monitors.filter((m) => m.currentState === "down").length;
  const unknownMonitors = monitors.filter(
    (m) => m.currentState === "unknown"
  ).length;

  // Calculate global uptime
  const totalUptimePercent = monitors.reduce(
    (sum, m) => sum + (m.uptimePercent || 100),
    0
  );
  const globalUptimePercent =
    monitors.length > 0
      ? Math.round((totalUptimePercent / monitors.length) * 100) / 100
      : 0;

  // Calculate average response time from recent checks
  const recentLogs = await MonitorCheckLog.find(
    { user: userId },
    { responseTimeMs: 1 }
  )
    .sort({ checkedAt: -1 })
    .limit(1000)
    .lean();

  const averageResponseTimeMs =
    recentLogs.length > 0
      ? Math.round(
          recentLogs.reduce((sum, log) => sum + log.responseTimeMs, 0) /
            recentLogs.length
        )
      : 0;

  // Count open incidents
  const openIncidents = await Incident.countDocuments({
    user: userId,
    status: "open",
  });

  // Build health summary for each monitor
  const health = monitors.map((monitor) => ({
    id: monitor._id.toString(),
    name: monitor.name,
    state: monitor.currentState,
    uptimePercent: monitor.uptimePercent || 100,
    lastCheckedAt: monitor.lastCheckedAt,
  }));

  return {
    totalMonitors: monitors.length,
    onlineMonitors,
    offlineMonitors,
    unknownMonitors,
    globalUptimePercent,
    averageResponseTimeMs,
    openIncidents,
    monitorCount: monitors.length,
    health,
  };
};

/**
 * Get recent activity items (monitor events)
 * Returns: array of activity items with title, description, timestamp, status
 */
const getRecentActivity = async (userId) => {
  const activities = [];

  // Get monitors sorted by creation/update date
  const recentMonitors = await Monitor.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  // Add monitor creation events
  recentMonitors.forEach((monitor) => {
    if (monitor.createdAt) {
      activities.push({
        id: `monitor_created_${monitor._id}`,
        title: `Monitor "${monitor.name}" created`,
        description: `Started monitoring ${monitor.url}`,
        timestamp: new Date(monitor.createdAt),
        status: "info",
        monitor: monitor._id.toString(),
      });
    }
  });

  // Get recent health checks and status changes
  const recentLogs = await MonitorCheckLog.find({ user: userId })
    .populate("monitor", "name currentState")
    .sort({ checkedAt: -1 })
    .limit(100)
    .lean();

  const processedMonitors = new Set();

  recentLogs.forEach((log) => {
    if (!log.monitor) return;

    const monitorKey = log.monitor._id.toString();
    const monitorName = log.monitor.name;

    // Add first check event only once per monitor
    if (!processedMonitors.has(monitorKey)) {
      activities.push({
        id: `first_check_${log.monitor._id}_${log.checkedAt}`,
        title: `First health check for "${monitorName}"`,
        description: log.isAvailable ? "✓ Service is online" : "✗ Service is offline",
        timestamp: new Date(log.checkedAt),
        status: log.isAvailable ? "success" : "error",
        monitor: monitorKey,
      });
      processedMonitors.add(monitorKey);
    }

    // Track state transitions for recent checks
    const currentMonitor = recentMonitors.find(
      (m) => m._id.toString() === monitorKey
    );

    if (currentMonitor && log.isAvailable && currentMonitor.currentState === "up") {
      activities.push({
        id: `check_success_${log.monitor._id}_${log.checkedAt}`,
        title: `"${monitorName}" is online`,
        description: `Response time: ${log.responseTimeMs}ms`,
        timestamp: new Date(log.checkedAt),
        status: "success",
        monitor: monitorKey,
      });
    } else if (
      currentMonitor &&
      !log.isAvailable &&
      currentMonitor.currentState === "down"
    ) {
      activities.push({
        id: `check_failure_${log.monitor._id}_${log.checkedAt}`,
        title: `"${monitorName}" went offline`,
        description: log.errorMessage || "Service unavailable",
        timestamp: new Date(log.checkedAt),
        status: "error",
        monitor: monitorKey,
      });
    }
  });

  // Get recovery events from incidents
  const recentIncidents = await Incident.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  recentIncidents.forEach((incident) => {
    if (incident.monitorName) {
      if (incident.resolvedAt) {
        activities.push({
          id: `incident_resolved_${incident._id}`,
          title: `"${incident.monitorName}" recovered`,
          description: `Service is back online after incident`,
          timestamp: new Date(incident.resolvedAt),
          status: "success",
          monitor: incident.monitor.toString(),
        });
      }
    }
  });

  // Sort by timestamp descending and limit to 20 most recent
  return activities
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 20)
    .map((activity) => ({
      id: activity.id,
      title: activity.title,
      description: activity.description,
      timestamp: formatActivityTimestamp(activity.timestamp),
      status: activity.status,
    }));
};

/**
 * Format timestamp as relative time
 */
const formatActivityTimestamp = (date) => {
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
};

/**
 * Get complete dashboard overview
 */
const getDashboardOverview = async (userId) => {
  const [metrics, activities] = await Promise.all([
    getDashboardMetrics(userId),
    getRecentActivity(userId),
  ]);

  // Determine overall status based on monitors
  let overallStatus = "unknown";
  if (metrics.totalMonitors > 0) {
    const onlinePercent = (metrics.onlineMonitors / metrics.totalMonitors) * 100;
    if (onlinePercent === 100) {
      overallStatus = "healthy";
    } else if (onlinePercent >= 80) {
      overallStatus = "degraded";
    } else {
      overallStatus = "down";
    }
  }

  return {
    metrics: [
      {
        id: "online",
        label: "Online Monitors",
        value: String(metrics.onlineMonitors),
        change: `of ${metrics.totalMonitors} total`,
        trend:
          metrics.onlineMonitors > 0
            ? metrics.onlineMonitors === metrics.totalMonitors
              ? "up"
              : "neutral"
            : "down",
      },
      {
        id: "offline",
        label: "Offline Monitors",
        value: String(metrics.offlineMonitors),
        change: metrics.offlineMonitors === 0 ? "All systems operational" : "Needs attention",
        trend: metrics.offlineMonitors === 0 ? "up" : "down",
      },
      {
        id: "uptime",
        label: "Global Uptime",
        value: `${metrics.globalUptimePercent}%`,
        change: metrics.globalUptimePercent >= 99.5 ? "Excellent" : "Acceptable",
        trend: metrics.globalUptimePercent >= 99.5 ? "up" : "neutral",
      },
      {
        id: "latency",
        label: "Avg Response Time",
        value: metrics.averageResponseTimeMs
          ? `${metrics.averageResponseTimeMs}ms`
          : "—",
        change: metrics.averageResponseTimeMs
          ? `${metrics.averageResponseTimeMs < 500 ? "Excellent" : metrics.averageResponseTimeMs < 2000 ? "Good" : "Slow"}`
          : "Waiting for checks",
        trend:
          metrics.averageResponseTimeMs < 500
            ? "up"
            : metrics.averageResponseTimeMs < 2000
            ? "neutral"
            : "down",
      },
    ],
    activities,
    health: metrics.health.length > 0
      ? {
          overallStatus,
          regions: metrics.health.map((monitor) => ({
            id: monitor.id,
            name: monitor.name,
            status: monitor.state === "up" ? "healthy" : monitor.state === "down" ? "down" : "unknown",
            uptime: `${monitor.uptimePercent}%`,
          })),
          lastChecked: new Date().toLocaleTimeString(),
        }
      : null,
  };
};

module.exports = {
  getDashboardMetrics,
  getRecentActivity,
  getDashboardOverview,
};

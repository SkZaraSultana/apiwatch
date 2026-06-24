const mongoose = require("mongoose");
const Monitor = require("../models/Monitor");
const MonitorCheckLog = require("../models/MonitorCheckLog");

const RANGE_OPTIONS = {
  "24h": 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
  "30d": 30 * 24 * 60 * 60 * 1000,
};

const getBucketMs = (rangeKey) => {
  if (rangeKey === "24h") return 60 * 60 * 1000;
  if (rangeKey === "7d") return 24 * 60 * 60 * 1000;
  return 24 * 60 * 60 * 1000;
};

const formatLabel = (date, rangeKey) => {
  if (rangeKey === "24h") {
    return date.toLocaleTimeString("en-US", { hour: "numeric", hour12: true });
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const buildMatchStage = (userId, since, monitorId) => {
  const match = {
    user: new mongoose.Types.ObjectId(userId),
    checkedAt: { $gte: since },
  };

  if (monitorId) {
    match.monitor = new mongoose.Types.ObjectId(monitorId);
  }

  return match;
};

const aggregateTimeSeries = async (userId, rangeKey, monitorId) => {
  const since = new Date(Date.now() - RANGE_OPTIONS[rangeKey]);
  const bucketMs = getBucketMs(rangeKey);
  const match = buildMatchStage(userId, since, monitorId);

  const logs = await MonitorCheckLog.find(match).sort({ checkedAt: 1 }).lean();

  const buckets = new Map();

  logs.forEach((log) => {
    const bucketTime =
      Math.floor(new Date(log.checkedAt).getTime() / bucketMs) * bucketMs;
    const key = String(bucketTime);

    if (!buckets.has(key)) {
      buckets.set(key, {
        timestamp: new Date(bucketTime),
        totalChecks: 0,
        successfulChecks: 0,
        totalResponseTimeMs: 0,
      });
    }

    const bucket = buckets.get(key);
    bucket.totalChecks += 1;
    bucket.totalResponseTimeMs += log.responseTimeMs;
    if (log.isAvailable) {
      bucket.successfulChecks += 1;
    }
  });

  return Array.from(buckets.values())
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((bucket) => ({
      label: formatLabel(bucket.timestamp, rangeKey),
      timestamp: bucket.timestamp.toISOString(),
      avgResponseTimeMs:
        bucket.totalChecks > 0
          ? Math.round(bucket.totalResponseTimeMs / bucket.totalChecks)
          : 0,
      uptimePercent:
        bucket.totalChecks > 0
          ? Math.round((bucket.successfulChecks / bucket.totalChecks) * 10000) / 100
          : 0,
      totalChecks: bucket.totalChecks,
    }));
};

const buildHealthSummary = async (userId, monitorId) => {
  const filter = { user: userId };
  if (monitorId) {
    filter._id = monitorId;
  }

  const monitors = await Monitor.find(filter).sort({ name: 1 }).lean();

  return monitors.map((monitor) => ({
    monitorId: monitor._id.toString(),
    name: monitor.name,
    state: monitor.currentState,
    uptimePercent: monitor.uptimePercent ?? 100,
    isAvailable: monitor.isAvailable,
    lastCheckedAt: monitor.lastCheckedAt,
  }));
};

const deriveIncidents = async (userId, rangeKey, monitorId) => {
  const since = new Date(Date.now() - RANGE_OPTIONS[rangeKey]);
  const match = buildMatchStage(userId, since, monitorId);

  const logs = await MonitorCheckLog.find(match)
    .populate("monitor", "name")
    .sort({ monitor: 1, checkedAt: 1 })
    .lean();

  const incidents = [];
  const openByMonitor = new Map();

  logs.forEach((log) => {
    if (!log.monitor) {
      return;
    }

    const monitorKey = log.monitor._id.toString();
    const monitorName = log.monitor.name;

    if (!log.isAvailable) {
      if (!openByMonitor.has(monitorKey)) {
        openByMonitor.set(monitorKey, {
          monitorId: monitorKey,
          monitorName,
          startedAt: log.checkedAt,
        });
      }
      return;
    }

    if (openByMonitor.has(monitorKey)) {
      const open = openByMonitor.get(monitorKey);
      const durationSeconds = Math.max(
        1,
        Math.floor((new Date(log.checkedAt) - new Date(open.startedAt)) / 1000)
      );

      incidents.push({
        monitorId: open.monitorId,
        monitorName: open.monitorName,
        startedAt: open.startedAt,
        resolvedAt: log.checkedAt,
        durationSeconds,
      });

      openByMonitor.delete(monitorKey);
    }
  });

  openByMonitor.forEach((open) => {
    incidents.push({
      monitorId: open.monitorId,
      monitorName: open.monitorName,
      startedAt: open.startedAt,
      resolvedAt: null,
      durationSeconds: Math.max(
        1,
        Math.floor((Date.now() - new Date(open.startedAt).getTime()) / 1000)
      ),
    });
  });

  return incidents.sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  );
};

const buildIncidentSeries = (incidents, rangeKey) => {
  const bucketMs = getBucketMs(rangeKey);
  const since = Date.now() - RANGE_OPTIONS[rangeKey];
  const buckets = new Map();

  incidents.forEach((incident) => {
    const bucketTime =
      Math.floor(new Date(incident.startedAt).getTime() / bucketMs) * bucketMs;

    if (bucketTime < since) {
      return;
    }

    const key = String(bucketTime);
    if (!buckets.has(key)) {
      buckets.set(key, {
        timestamp: new Date(bucketTime),
        count: 0,
      });
    }

    buckets.get(key).count += 1;
  });

  return Array.from(buckets.values())
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((bucket) => ({
      label: formatLabel(bucket.timestamp, rangeKey),
      timestamp: bucket.timestamp.toISOString(),
      count: bucket.count,
    }));
};

const getAnalytics = async (userId, { range = "7d", monitorId = null } = {}) => {
  const rangeKey = RANGE_OPTIONS[range] ? range : "7d";

  const [timeSeries, health, incidents] = await Promise.all([
    aggregateTimeSeries(userId, rangeKey, monitorId),
    buildHealthSummary(userId, monitorId),
    deriveIncidents(userId, rangeKey, monitorId),
  ]);

  const responseTime = timeSeries.map((point) => ({
    label: point.label,
    timestamp: point.timestamp,
    avgResponseTimeMs: point.avgResponseTimeMs,
  }));

  const uptime = timeSeries.map((point) => ({
    label: point.label,
    timestamp: point.timestamp,
    uptimePercent: point.uptimePercent,
  }));

  const incidentSeries = buildIncidentSeries(incidents, rangeKey);

  const totalChecks = timeSeries.reduce((sum, point) => sum + point.totalChecks, 0);

  return {
    range: rangeKey,
    monitorId,
    hasData: totalChecks > 0 || health.length > 0,
    responseTime,
    uptime,
    health,
    incidents: incidentSeries,
    incidentDetails: incidents,
    summary: {
      totalChecks,
      monitorCount: health.length,
      openIncidents: incidents.filter((incident) => !incident.resolvedAt).length,
      avgUptimePercent:
        health.length > 0
          ? Math.round(
              (health.reduce((sum, item) => sum + item.uptimePercent, 0) /
                health.length) *
                100
            ) / 100
          : 0,
    },
  };
};

module.exports = {
  getAnalytics,
  RANGE_OPTIONS: Object.keys(RANGE_OPTIONS),
};

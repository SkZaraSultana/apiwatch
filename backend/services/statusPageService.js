const Monitor = require("../models/Monitor");
const StatusPage = require("../models/StatusPage");
const env = require("../config/env");

const SERVICE_STATUSES = ["operational", "degraded", "outage"];

const mapMonitorStatus = (monitor) => {
  if (monitor.status === "paused") {
    return {
      state: "degraded",
      label: "Degraded",
      message: "Monitoring is paused for this endpoint.",
    };
  }

  if (monitor.currentState === "down" || monitor.isAvailable === false) {
    return {
      state: "outage",
      label: "Outage",
      message: monitor.lastError || "Endpoint is currently unavailable.",
    };
  }

  const threshold = monitor.latencyThresholdMs || env.defaultLatencyThresholdMs;
  const isSlow =
    monitor.lastResponseTimeMs != null &&
    monitor.lastResponseTimeMs > threshold;
  const isLowUptime =
    monitor.uptimePercent != null && monitor.uptimePercent < 99;

  if (isSlow || isLowUptime) {
    return {
      state: "degraded",
      label: "Degraded",
      message: isSlow
        ? `Elevated response time (${monitor.lastResponseTimeMs}ms).`
        : `Uptime is ${monitor.uptimePercent}% over recent checks.`,
    };
  }

  if (monitor.currentState === "unknown" && monitor.totalChecks === 0) {
    return {
      state: "degraded",
      label: "Degraded",
      message: "Waiting for first successful check.",
    };
  }

  return {
    state: "operational",
    label: "Operational",
    message: "All systems operational.",
  };
};

const calculateOverallStatus = (services) => {
  if (services.some((service) => service.state === "outage")) {
    return {
      state: "outage",
      label: "Outage",
      message: "One or more services are experiencing an outage.",
    };
  }

  if (services.some((service) => service.state === "degraded")) {
    return {
      state: "degraded",
      label: "Degraded",
      message: "Some services are degraded.",
    };
  }

  return {
    state: "operational",
    label: "Operational",
    message: "All systems operational.",
  };
};

const buildPublicUrl = (slug) => `${env.clientUrl}/status/${slug}`;

const getOrCreateStatusPage = async (userId) => {
  let page = await StatusPage.findOne({ user: userId });
  if (page) {
    return page;
  }

  let slug = StatusPage.generateSlug();
  let attempts = 0;
  while (attempts < 5) {
    const exists = await StatusPage.findOne({ slug });
    if (!exists) break;
    slug = StatusPage.generateSlug();
    attempts += 1;
  }

  page = await StatusPage.create({
    user: userId,
    slug,
    title: "APIWatch Status",
    isPublished: true,
  });

  return page;
};

const regenerateSlug = async (userId) => {
  const page = await getOrCreateStatusPage(userId);
  let slug = StatusPage.generateSlug();

  for (let i = 0; i < 5; i += 1) {
    const exists = await StatusPage.findOne({ slug, _id: { $ne: page._id } });
    if (!exists) break;
    slug = StatusPage.generateSlug();
  }

  page.slug = slug;
  await page.save();
  return page;
};

const updateStatusPage = async (userId, payload) => {
  const page = await getOrCreateStatusPage(userId);

  if (payload.title !== undefined) {
    page.title = payload.title;
  }

  if (payload.isPublished !== undefined) {
    page.isPublished = payload.isPublished;
  }

  await page.save();
  return page;
};

const getPublicStatus = async (slug) => {
  const page = await StatusPage.findOne({ slug });
  if (!page || !page.isPublished) {
    throw new Error("Status page not found.");
  }

  const monitors = await Monitor.find({ user: page.user }).sort({ name: 1 });

  const services = monitors.map((monitor) => {
    const status = mapMonitorStatus(monitor);
    return {
      id: monitor._id.toString(),
      name: monitor.name,
      state: status.state,
      label: status.label,
      message: status.message,
      uptimePercent: monitor.uptimePercent ?? 100,
      lastCheckedAt: monitor.lastCheckedAt,
      responseTimeMs: monitor.lastResponseTimeMs,
    };
  });

  const overall = calculateOverallStatus(services);

  return {
    title: page.title,
    slug: page.slug,
    overall,
    services,
    updatedAt: new Date().toISOString(),
  };
};

const getStatusPageForUser = async (userId) => {
  const page = await getOrCreateStatusPage(userId);
  return {
    title: page.title,
    slug: page.slug,
    isPublished: page.isPublished,
    publicUrl: buildPublicUrl(page.slug),
    createdAt: page.createdAt,
    updatedAt: page.updatedAt,
  };
};

module.exports = {
  getPublicStatus,
  getStatusPageForUser,
  getOrCreateStatusPage,
  regenerateSlug,
  updateStatusPage,
  buildPublicUrl,
  SERVICE_STATUSES,
};

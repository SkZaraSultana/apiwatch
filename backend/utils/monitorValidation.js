const { HTTP_METHODS } = require("../models/Monitor");

const isValidUrl = (value) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

const validateMonitorPayload = (body, { partial = false } = {}) => {
  const errors = [];
  const data = {};

  if (!partial || body.name !== undefined) {
    if (!body.name || typeof body.name !== "string" || !body.name.trim()) {
      errors.push("Monitor name is required.");
    } else {
      data.name = body.name.trim();
    }
  }

  if (!partial || body.url !== undefined) {
    if (!body.url || typeof body.url !== "string" || !body.url.trim()) {
      errors.push("API URL is required.");
    } else if (!isValidUrl(body.url.trim())) {
      errors.push("API URL must be a valid http or https URL.");
    } else {
      data.url = body.url.trim();
    }
  }

  if (!partial || body.method !== undefined) {
    const method = (body.method || "GET").toUpperCase();
    if (!HTTP_METHODS.includes(method)) {
      errors.push(`Method must be one of: ${HTTP_METHODS.join(", ")}.`);
    } else {
      data.method = method;
    }
  }

  if (!partial || body.expectedStatus !== undefined) {
    const status = Number(body.expectedStatus);
    if (!Number.isInteger(status) || status < 100 || status > 599) {
      errors.push("Expected status must be an integer between 100 and 599.");
    } else {
      data.expectedStatus = status;
    }
  }

  if (!partial || body.interval !== undefined) {
    const interval = Number(body.interval);
    if (!Number.isInteger(interval) || interval < 30) {
      errors.push("Interval must be an integer of at least 30 seconds.");
    } else {
      data.interval = interval;
    }
  }

  if (!partial || body.timeout !== undefined) {
    const timeout = Number(body.timeout);
    if (!Number.isInteger(timeout) || timeout < 1000 || timeout > 120000) {
      errors.push("Timeout must be an integer between 1000 and 120000 ms.");
    } else {
      data.timeout = timeout;
    }
  }

  if (!partial || body.latencyThresholdMs !== undefined) {
    const latencyThresholdMs = Number(body.latencyThresholdMs);
    if (
      !Number.isInteger(latencyThresholdMs) ||
      latencyThresholdMs < 100 ||
      latencyThresholdMs > 120000
    ) {
      errors.push("Latency threshold must be an integer between 100 and 120000 ms.");
    } else {
      data.latencyThresholdMs = latencyThresholdMs;
    }
  }

  return { errors, data };
};

module.exports = {
  validateMonitorPayload,
};

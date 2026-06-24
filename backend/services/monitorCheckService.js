const axios = require("axios");

const SUPPORTED_METHODS = ["GET", "POST", "PUT", "DELETE"];

const executeHttpCheck = async (monitor) => {
  const method = monitor.method.toUpperCase();

  if (!SUPPORTED_METHODS.includes(method)) {
    return {
      statusCode: null,
      responseTimeMs: 0,
      isAvailable: false,
      errorMessage: `Method ${method} is not supported by the monitoring engine.`,
    };
  }

  const startedAt = Date.now();

  try {
    const config = {
      method: method.toLowerCase(),
      url: monitor.url,
      timeout: monitor.timeout,
      validateStatus: () => true,
      maxRedirects: 5,
    };

    if (method === "POST" || method === "PUT") {
      config.data = {};
      config.headers = { "Content-Type": "application/json" };
    }

    const response = await axios(config);
    const responseTimeMs = Date.now() - startedAt;
    const isAvailable = response.status === monitor.expectedStatus;

    return {
      statusCode: response.status,
      responseTimeMs,
      isAvailable,
      errorMessage: isAvailable
        ? null
        : `Expected status ${monitor.expectedStatus}, received ${response.status}.`,
    };
  } catch (error) {
    const responseTimeMs = Date.now() - startedAt;
    const statusCode = error.response?.status ?? null;
    const errorMessage =
      error.code === "ECONNABORTED"
        ? `Request timed out after ${monitor.timeout}ms.`
        : error.message || "Request failed.";

    return {
      statusCode,
      responseTimeMs,
      isAvailable: false,
      errorMessage,
    };
  }
};

module.exports = {
  executeHttpCheck,
  SUPPORTED_METHODS,
};

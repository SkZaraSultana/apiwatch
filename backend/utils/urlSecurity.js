const analyzeUrlSecurity = (url) => {
  const issues = [];

  if (!url || typeof url !== "string" || !url.trim()) {
    return { isMalformed: true, issues: ["URL is empty or missing."] };
  }

  const trimmed = url.trim();

  if (/\s/.test(trimmed)) {
    issues.push("URL contains whitespace characters.");
  }

  if (/^(javascript|data|file):/i.test(trimmed)) {
    issues.push("URL uses a disallowed protocol.");
  }

  try {
    const parsed = new URL(trimmed);

    if (!["http:", "https:"].includes(parsed.protocol)) {
      issues.push(`Protocol "${parsed.protocol}" is not allowed for monitoring.`);
    }

    if (!parsed.hostname) {
      issues.push("URL hostname is missing.");
    }

    if (parsed.hostname === "localhost" && parsed.protocol === "http:") {
      issues.push("Insecure localhost HTTP endpoint flagged for review.");
    }

    if (parsed.username || parsed.password) {
      issues.push("URL embeds credentials in the request path.");
    }

    if (/%00|\\|@/.test(parsed.pathname + parsed.search)) {
      issues.push("URL contains suspicious encoding or traversal patterns.");
    }
  } catch {
    issues.push("URL is not a valid HTTP or HTTPS address.");
  }

  return {
    isMalformed: issues.length > 0,
    issues,
  };
};

module.exports = {
  analyzeUrlSecurity,
};

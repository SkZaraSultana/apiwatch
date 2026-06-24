import { useMemo, useState } from "react";
import {
  HiOutlineShieldCheck,
  HiOutlineLockClosed,
  HiOutlineCloud,
  HiOutlineShieldExclamation,
  HiOutlineClock,
  HiOutlineSparkles,
} from "react-icons/hi";
import SecurityEventList from "../components/security/SecurityEventList";
import { useMonitors } from "../hooks/useMonitors";
import { useSecurityCenter } from "../hooks/useSecurityCenter";
import {
  SECURITY_TYPE_LABELS,
  type SecurityEvent,
  type SecurityEventType,
  type SecuritySeverity,
} from "../services/securityService";

const filters: Array<{ label: string; value: SecurityEventType | "" }> = [
  { label: "All", value: "" },
  { label: "5xx Spikes", value: "server_error_spike" },
  { label: "High Latency", value: "high_latency" },
  { label: "Repeated Failures", value: "repeated_failure" },
  { label: "Malformed URLs", value: "malformed_url" },
];

const statusMap = {
  good: "text-emerald-400 bg-emerald-500/10 ring-emerald-500/20",
  warning: "text-amber-300 bg-amber-500/10 ring-amber-500/20",
  danger: "text-rose-300 bg-rose-500/10 ring-rose-500/20",
  neutral: "text-slate-300 bg-slate-700/50 ring-slate-700/40",
} as const;

const severityRank: Record<SecuritySeverity, number> = {
  low: 0,
  medium: 1,
  high: 2,
  critical: 3,
};

const issueFixes: Record<SecurityEventType, string> = {
  server_error_spike: "Review server error spikes and stabilize the API backend.",
  high_latency: "Optimize response paths and reduce request latency.",
  repeated_failure: "Investigate repeated failures and improve endpoint reliability.",
  malformed_url: "Correct malformed URLs and ensure valid monitoring targets.",
};

const severityLabel = (severity: SecuritySeverity) =>
  severity === "critical"
    ? "Critical"
    : severity === "high"
    ? "Warning"
    : "Secure";

const groupAdvice = (type: SecurityEventType) => {
  switch (type) {
    case "server_error_spike":
      return "A sudden increase in server errors indicates backend instability. Review logs and recent changes to identify the root cause.";
    case "high_latency":
      return "Slow responses may indicate a bottleneck or overloaded service. Investigate request timing and resource use to improve performance.";
    case "repeated_failure":
      return "Repeated failures show the endpoint is not consistently reachable. Check connectivity, networking, and service health to restore stability.";
    case "malformed_url":
      return "A malformed monitor URL prevents reliable checks. Correct the URL format so monitoring can reach the intended API endpoint.";
    default:
      return "Review the details of this finding to understand its security impact.";
  }
};


const SecurityCenterPage = () => {
  const [typeFilter, setTypeFilter] = useState<SecurityEventType | "">("");
  const [expandedGroups, setExpandedGroups] = useState<SecurityEventType[]>([]);
  const { events, risk, loading, error, dismiss, remove } =
    useSecurityCenter(typeFilter);
  const { monitors } = useMonitors();

  const latestScanTime = useMemo(() => {
    const timestamp = events.reduce(
      (latest, event) =>
        Math.max(latest, new Date(event.detectedAt).getTime()),
      0
    );
    return timestamp ? new Date(timestamp) : null;
  }, [events]);

  const monitorSummaries = useMemo(() => {
    const map = new Map<
      string,
      {
        monitorId: string;
        monitorName: string;
        monitorUrl: string;
        events: SecurityEvent[];
        highestSeverity: SecuritySeverity;
        maxRiskPoints: number;
        lastScan: string;
        ssl: boolean;
        https: boolean;
        hasMalformedUrl: boolean;
        activeIssues: number;
        recommendedFixes: Set<string>;
      }
    >();

    monitors.forEach((monitor) => {
      const monitorId = monitor.id;
      const monitorUrl = monitor.url || "";
      const hasHttpsUrl = monitorUrl.startsWith("https:");
      if (!map.has(monitorId)) {
        map.set(monitorId, {
          monitorId,
          monitorName: monitor.name,
          monitorUrl,
          events: [],
          highestSeverity: "low",
          maxRiskPoints: 0,
          lastScan: "",
          ssl: hasHttpsUrl,
          https: hasHttpsUrl,
          hasMalformedUrl: false,
          activeIssues: 0,
          recommendedFixes: new Set<string>(),
        });
      }
    });

    events.forEach((event) => {
      const monitorId = event.monitorId || event.monitorName || event.id;
      const monitorUrl =
        typeof event.metadata?.url === "string" ? event.metadata.url : "";
      const hasHttpsUrl = monitorUrl.startsWith("https:");
      const fix = issueFixes[event.type];
      const current = map.get(monitorId);

      if (!current) {
        map.set(monitorId, {
          monitorId,
          monitorName: event.monitorName || "Unknown monitor",
          monitorUrl,
          events: [event],
          highestSeverity: event.severity,
          maxRiskPoints: event.riskPoints,
          lastScan: event.detectedAt,
          ssl: hasHttpsUrl,
          https: hasHttpsUrl,
          hasMalformedUrl: event.type === "malformed_url",
          activeIssues: 1,
          recommendedFixes: new Set([fix]),
        });
      } else {
        current.events.push(event);
        current.highestSeverity =
          severityRank[event.severity] > severityRank[current.highestSeverity]
            ? event.severity
            : current.highestSeverity;
        current.maxRiskPoints = Math.max(current.maxRiskPoints, event.riskPoints);
        if (!current.lastScan || new Date(event.detectedAt).getTime() > new Date(current.lastScan).getTime()) {
          current.lastScan = event.detectedAt;
        }
        current.ssl = current.ssl || hasHttpsUrl;
        current.https = current.https || hasHttpsUrl;
        current.hasMalformedUrl = current.hasMalformedUrl || event.type === "malformed_url";
        current.activeIssues += 1;
        current.recommendedFixes.add(fix);
      }
    });

    return Array.from(map.values())
      .map((monitor) => ({
        ...monitor,
        score: Math.max(0, 100 - monitor.maxRiskPoints),
        ssl: monitor.ssl ? "Yes" : "No",
        https: monitor.https ? "Enabled" : "Disabled",
        headers: monitor.hasMalformedUrl ? "Review required" : "Good",
        dns: monitor.hasMalformedUrl ? "Review required" : "Healthy",
        status: monitor.events.length
          ? severityLabel(monitor.highestSeverity)
          : "Secure",
        recommendedFixes: Array.from(monitor.recommendedFixes),
      }))
      .sort(
        (a, b) =>
          severityRank[b.highestSeverity] - severityRank[a.highestSeverity] ||
          b.activeIssues - a.activeIssues
      );
  }, [events, monitors]);

  const secureMonitors = monitorSummaries.filter(
    (monitor) => monitor.status === "Secure"
  ).length;
  const warningMonitors = monitorSummaries.filter(
    (monitor) => monitor.status === "Warning"
  ).length;
  const criticalMonitors = monitorSummaries.filter(
    (monitor) => monitor.status === "Critical"
  ).length;

  const overviewCards = useMemo(
    () => [
      {
        title: "Security Score",
        value: risk ? `${risk.score} / 100` : "—",
        status: risk ? risk.level : "neutral",
        icon: <HiOutlineShieldCheck className="h-5 w-5" />,
        text: "A concise view of the current API security score.",
      },
      {
        title: "Threat Level",
        value: risk ? risk.level.toUpperCase() : "UNKNOWN",
        status: risk ? risk.level : "neutral",
        icon: <HiOutlineShieldExclamation className="h-5 w-5" />,
        text: "The active threat level for detected security events.",
      },
      {
        title: "Secure Monitors",
        value: `${secureMonitors}`,
        status: "good",
        icon: <HiOutlineLockClosed className="h-5 w-5" />,
        text: "Monitors with no active warning or critical findings.",
      },
      {
        title: "Warning Monitors",
        value: `${warningMonitors}`,
        status: "warning",
        icon: <HiOutlineSparkles className="h-5 w-5" />,
        text: "Monitors with one or more warning-level findings.",
      },
      {
        title: "Critical Monitors",
        value: `${criticalMonitors}`,
        status: "danger",
        icon: <HiOutlineCloud className="h-5 w-5" />,
        text: "Monitors with active critical security findings.",
      },
      {
        title: "Last Scan",
        value: latestScanTime ? latestScanTime.toLocaleString() : "—",
        status: "neutral",
        icon: <HiOutlineClock className="h-5 w-5" />,
        text: "The most recent event time across all monitored APIs.",
      },
    ],
    [criticalMonitors, latestScanTime, monitorSummaries.length, risk, secureMonitors, warningMonitors]
  );

  const groupedFindings = useMemo(() => {
    const groups = new Map<
      SecurityEventType,
      {
        type: SecurityEventType;
        label: string;
        items: SecurityEvent[];
        monitors: Set<string>;
        firstSeen: string;
        lastSeen: string;
        highestSeverity: SecuritySeverity;
      }
    >();

    events.forEach((event) => {
      const current = groups.get(event.type);
      const detectedAt = new Date(event.detectedAt).toISOString();
      if (!current) {
        groups.set(event.type, {
          type: event.type,
          label: SECURITY_TYPE_LABELS[event.type],
          items: [event],
          monitors: new Set(event.monitorName ? [event.monitorName] : []),
          firstSeen: detectedAt,
          lastSeen: detectedAt,
          highestSeverity: event.severity,
        });
      } else {
        current.items.push(event);
        if (event.monitorName) current.monitors.add(event.monitorName);
        if (detectedAt < current.firstSeen) current.firstSeen = detectedAt;
        if (detectedAt > current.lastSeen) current.lastSeen = detectedAt;
        current.highestSeverity =
          severityRank[event.severity] > severityRank[current.highestSeverity]
            ? event.severity
            : current.highestSeverity;
      }
    });

    return Array.from(groups.values()).sort(
      (a, b) =>
        severityRank[b.highestSeverity] - severityRank[a.highestSeverity] ||
        b.items.length - a.items.length
    );
  }, [events]);

  const recommendations = useMemo(() => {
    const items: Array<{
      priority: string;
      monitor: string;
      problem: string;
      fix: string;
      benefit: string;
    }> = [];

    monitorSummaries.forEach((monitor) => {
      if (monitor.status === "Secure") return;

      if (monitor.https === "Disabled" || monitor.ssl === "No") {
        items.push({
          priority: "High",
          monitor: monitor.monitorName,
          problem: "HTTPS is not enabled.",
          fix: "Enable HTTPS for the monitored endpoint.",
          benefit: "Protect traffic and reduce interception risk.",
        });
      }

      if (monitor.headers === "Review required") {
        items.push({
          priority: "Medium",
          monitor: monitor.monitorName,
          problem: "Security headers require review.",
          fix: "Review the endpoint response headers.",
          benefit: "Improve protection against common attacks.",
        });
      }

      if (monitor.dns === "Review required") {
        items.push({
          priority: "Medium",
          monitor: monitor.monitorName,
          problem: "Malformed or invalid URL detected.",
          fix: "Correct the monitored URL and validate DNS resolution.",
          benefit: "Ensure monitoring targets the correct endpoint.",
        });
      }

      if (monitor.highestSeverity === "critical") {
        items.push({
          priority: "Critical",
          monitor: monitor.monitorName,
          problem: "Critical security findings are active.",
          fix: "Investigate the highest-severity events immediately.",
          benefit: "Reduce exposure and restore safety quickly.",
        });
      }
    });

    if (!items.length) {
      items.push({
        priority: "Low",
        monitor: "All monitors",
        problem: "No active security issues detected.",
        fix: "Continue monitoring to maintain security posture.",
        benefit: "Keep the API protected as conditions evolve.",
      });
    }

    return items.slice(0, 8);
  }, [monitorSummaries]);

  const toggleGroup = (type: SecurityEventType) => {
    setExpandedGroups((current) =>
      current.includes(type)
        ? current.filter((item) => item !== type)
        : [...current, type]
    );
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-10">
      <div>
        <h2 className="text-2xl font-semibold text-white">Security Center</h2>
        <p className="mt-1 text-sm text-slate-400">
          A concise, monitor-centric view of your API security posture.
        </p>
      </div>

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {overviewCards.map((card) => (
          <article
            key={card.title}
            className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950/80 text-slate-200">
                  {card.icon}
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-300">{card.title}</p>
                  <p className="mt-1 text-2xl font-semibold text-white">{card.value}</p>
                </div>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase ring-1 ring-inset ${
                  card.status === "good"
                    ? statusMap.good
                    : card.status === "warning"
                    ? statusMap.warning
                    : card.status === "danger"
                    ? statusMap.danger
                    : statusMap.neutral
                }`}
              >
                {card.status === "good"
                  ? "Good"
                  : card.status === "warning"
                  ? "Warning"
                  : card.status === "danger"
                  ? "Critical"
                  : "Neutral"}
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-400">{card.text}</p>
          </article>
        ))}
      </div>

      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Monitor Security Cards</h3>
            <p className="mt-1 text-sm text-slate-400">
              Each monitored API has its own security summary card.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs uppercase tracking-wide text-slate-300">
            <HiOutlineClock className="h-4 w-4" />
            Last scan
            {latestScanTime ? ` ${latestScanTime.toLocaleString()}` : " —"}
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-2">
          {monitorSummaries.length ? (
            monitorSummaries.map((monitor) => (
              <article
                key={monitor.monitorId}
                className="rounded-3xl border border-slate-800 bg-slate-950/50 p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-300">{monitor.monitorName}</p>
                    <p className="mt-2 text-3xl font-semibold text-white">{monitor.score}</p>
                  </div>
                  <div className="space-y-2 text-right">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                        monitor.status === "Critical"
                          ? statusMap.danger
                          : monitor.status === "Warning"
                          ? statusMap.warning
                          : statusMap.good
                      }`}
                    >
                      {monitor.status}
                    </span>
                    <span className="block rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-xs uppercase tracking-wide text-slate-300">
                      {monitor.activeIssues} active issue{monitor.activeIssues === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 text-sm text-slate-300">
                  <div className="flex items-center justify-between rounded-2xl bg-slate-900/80 px-3 py-2">
                    <span>SSL</span>
                    <span>{monitor.ssl}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-900/80 px-3 py-2">
                    <span>HTTPS</span>
                    <span>{monitor.https}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-900/80 px-3 py-2">
                    <span>Headers</span>
                    <span>{monitor.headers}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-900/80 px-3 py-2">
                    <span>DNS</span>
                    <span>{monitor.dns}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-slate-900/80 px-3 py-2">
                    <span>Last Scan</span>
                    <span>{new Date(monitor.lastScan).toLocaleString()}</span>
                  </div>
                </div>

                <div className="mt-5 rounded-3xl bg-slate-900/70 p-4 text-sm text-slate-300">
                  <p className="font-semibold text-slate-100">Recommended fixes</p>
                  <ul className="mt-3 list-disc space-y-1 pl-4">
                    {monitor.recommendedFixes.map((fix) => (
                      <li key={fix}>{fix}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-6 text-sm text-slate-400">
              No monitor security data is available yet.
            </div>
          )}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Grouped Security Findings</h3>
            <p className="mt-1 text-sm text-slate-400">
              Identical findings are grouped together for quick review.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.label}
                type="button"
                onClick={() => setTypeFilter(filter.value)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  typeFilter === filter.value
                    ? "bg-brand-500 text-white"
                    : "border border-slate-700 text-slate-300 hover:bg-slate-800"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {groupedFindings.length === 0 ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-950/50 p-6 text-sm text-slate-400">
              No active security findings match the current filter.
            </div>
          ) : (
            groupedFindings.map((group) => (
              <div
                key={group.type}
                className="rounded-3xl border border-slate-800 bg-slate-950/50 p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{group.label}</p>
                    <p className="mt-3 text-sm text-slate-400">
                      Occurrences: <span className="font-medium text-white">{group.items.length}</span>
                    </p>
                    <p className="mt-2 text-sm text-slate-400">
                      Affected monitors: <span className="font-medium text-white">{Array.from(group.monitors).join(", ") || "Unknown"}</span>
                    </p>
                    <p className="mt-2 text-sm text-slate-400">
                      First seen: <span className="font-medium text-white">{new Date(group.firstSeen).toLocaleString()}</span>
                    </p>
                    <p className="mt-2 text-sm text-slate-400">
                      Last seen: <span className="font-medium text-white">{new Date(group.lastSeen).toLocaleString()}</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <span className="rounded-full bg-slate-900 px-3 py-1 text-xs uppercase tracking-wide text-slate-300">
                      {severityLabel(group.highestSeverity)}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleGroup(group.type)}
                      className="rounded-full border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800"
                    >
                      {expandedGroups.includes(group.type) ? "Hide details" : "Learn more"}
                    </button>
                  </div>
                </div>
                {expandedGroups.includes(group.type) ? (
                  <div className="mt-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-4 text-sm text-slate-300">
                    <p>{groupAdvice(group.type)}</p>
                  </div>
                ) : null}
              </div>
            ))
          )}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
          <h3 className="text-lg font-semibold text-white">Security Timeline</h3>
          <p className="mt-1 text-sm text-slate-400">
            The latest security events across your monitors.
          </p>
          <div className="mt-6">
            <SecurityEventList
              events={events}
              loading={loading}
              onDismiss={dismiss}
              onDelete={remove}
            />
          </div>
        </div>

        <aside className="rounded-3xl border border-slate-800 bg-slate-900/70 p-5">
          <h3 className="text-lg font-semibold text-white">Recommendations</h3>
          <p className="mt-1 text-sm text-slate-400">
            Priority-focused actions to improve monitored API security.
          </p>
          <div className="mt-5 space-y-3">
            {recommendations.map((item, index) => (
              <div
                key={`${item.monitor}-${index}`}
                className="rounded-3xl border border-slate-800 bg-slate-950/50 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-white">{item.monitor}</p>
                    <p className="mt-1 text-sm text-slate-400">{item.problem}</p>
                  </div>
                  <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs uppercase tracking-wide text-slate-300">
                    {item.priority}
                  </span>
                </div>
                <p className="mt-3 text-sm text-slate-300">Suggested fix: {item.fix}</p>
                <p className="mt-2 text-sm text-slate-400">Expected benefit: {item.benefit}</p>
              </div>
            ))}
          </div>
        </aside>
      </section>
    </div>
  );
};

export default SecurityCenterPage;

import { Link, useParams } from "react-router-dom";
import { usePublicStatus } from "../hooks/usePublicStatus";
import { useMonitors } from "../hooks/useMonitors";
import { useIncidents } from "../hooks/useIncidents";
import { useState, useMemo } from "react";

const PublicStatusPage = () => {
  const { slug } = useParams();
  const { status, loading, error } = usePublicStatus(slug || undefined);
  const { monitors } = useMonitors();
  const { incidents } = useIncidents();
  const [copied, setCopied] = useState(false);

  // Determine if this is dashboard context (no slug) or public context (with slug)
  const isDashboard = !slug;

  // For dashboard context, map monitor fields to the public service shape
  const services = useMemo(() => {
    if (isDashboard) {
      return monitors.map((m) => {
        const mm: any = m;
        const stats: any = mm.stats ?? {};

        const currentState = mm.currentState ?? stats.currentState ?? "unknown";
        const isAvailable = mm.isAvailable ?? stats.isAvailable;
        const lastResponseTimeMs =
          mm.lastResponseTimeMs ?? stats.responseTimeMs ?? null;
        const uptimePercent = mm.uptimePercent ?? stats.uptimePercent ?? null;
        const lastCheckedAt = mm.lastCheckedAt ?? stats.lastCheckedAt ?? null;
        const lastError = mm.lastError ?? stats.lastError ?? null;

        // derive state
        let state: "operational" | "degraded" | "outage" = "degraded";
        let label = "Degraded";
        let message: string | null = null;

        if (mm.status === "paused") {
          state = "degraded";
          label = "Degraded";
          message = "Monitoring is paused for this endpoint.";
        } else if (currentState === "down" || isAvailable === false) {
          state = "outage";
          label = "Outage";
          message = lastError || "Endpoint is currently unavailable.";
        } else {
          const threshold = mm.latencyThresholdMs ?? 3000;
          const isSlow = lastResponseTimeMs != null && lastResponseTimeMs > threshold;
          const isLowUptime = uptimePercent != null && uptimePercent < 99;
          if (isSlow || isLowUptime) {
            state = "degraded";
            label = "Degraded";
            message = isSlow
              ? `Elevated response time (${lastResponseTimeMs}ms).`
              : `Uptime is ${uptimePercent}% over recent checks.`;
          } else {
            state = "operational";
            label = "Operational";
            message = "All systems operational.";
          }
        }

        // ssl inference from lastError or url scheme
        let ssl: string | null = null;
        if (lastError && /ssl|certificate|tls/i.test(lastError)) ssl = "Failed";
        else if (lastError && /(ENOTFOUND|ECONNREFUSED|ETIMEDOUT|EHOSTUNREACH|ENETUNREACH|ECONNRESET)/i.test(lastError)) ssl = "Unknown";
        else if (typeof mm.url === "string" && mm.url.startsWith("https")) ssl = "Valid";
        else if (typeof mm.url === "string" && mm.url.startsWith("http")) ssl = "No";

        // determine failure reason mapping for display
        const failureReason: string | null = lastError ?? null;

        return {
          id: mm.id,
          name: mm.name,
          label,
          state,
          message,
          uptimePercent,
          lastCheckedAt,
          responseTimeMs: lastResponseTimeMs,
          ssl,
          failureReason,
          endpoint: mm.url,
        } as any;
      });
    }

    return status?.services || [];
  }, [isDashboard, monitors, status?.services]);

  if (loading && !isDashboard) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">
        Loading status...
      </div>
    );
  }

  if ((error || !status) && !isDashboard) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center">
        <h1 className="text-2xl font-semibold text-white">Status page unavailable</h1>
        <p className="mt-2 text-slate-400">{error}</p>
        <Link to="/" className="mt-6 text-sm text-brand-100 hover:text-white">Back to APIWatch</Link>
      </div>
    );
  }

  // determine hero state
  const downCount = services.filter((s) => s.state === "outage").length;
  const degradedCount = services.filter((s) => s.state === "degraded").length;
  let heroEmoji = "🟢";
  let heroLabel = "All Systems Operational";
  let heroClass = "border-emerald-500/30 bg-emerald-500/10";

  if (downCount > 1) {
    heroEmoji = "🔴";
    heroLabel = "Major Outage";
    heroClass = "border-rose-500/30 bg-rose-500/10";
  } else if (downCount === 1 || degradedCount > 0) {
    heroEmoji = "🟡";
    heroLabel = "Partial Service Disruption";
    heroClass = "border-amber-500/30 bg-amber-500/10";
  }

  // summary
  const totalServices = services.length;
  const operational = services.filter((s) => s.state === "operational").length;
  const degraded = services.filter((s) => s.state === "degraded").length;
  const down = services.filter((s) => s.state === "outage").length;
  const overallUptime =
    totalServices > 0
      ? (
          services.reduce((sum, s) => sum + (s.uptimePercent || 0), 0) / totalServices
        ).toFixed(2)
      : "—";

  const validResponses = services.filter((s) => s.responseTimeMs != null).length;
  const avgResponse =
    validResponses > 0
      ? Math.round(services.reduce((sum, s) => sum + (s.responseTimeMs || 0), 0) / validResponses)
      : null;

  const publicUrl = typeof window !== "undefined" && (status?.slug || slug) ? `${window.location.origin}/status/${status?.slug || slug}` : "";

  const copyUrl = async () => {
    if (!publicUrl) return;
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // noop
    }
  };

  // timeline (latest from services and incidents)
  const timeline: { time: string; text: string }[] = [];
  services.forEach((s) => {
    if (s.lastCheckedAt) timeline.push({ time: s.lastCheckedAt, text: `${s.name} — ${s.label}` });
  });
  incidents.forEach((inc) => {
    const last = inc.timeline?.[inc.timeline.length - 1];
    if (last) timeline.push({ time: last.createdAt, text: last.message });
    if (inc.status !== "resolved") timeline.push({ time: inc.startedAt, text: `${inc.monitorName || inc.title} — ${inc.status}` });
  });
  timeline.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

  const activeIncidents = incidents.filter((i) => i.status !== "resolved");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* HERO */}
        <section className={`rounded-2xl border p-6 ${heroClass}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="text-5xl">{heroEmoji}</div>
              <div>
                <h1 className="text-3xl font-bold text-white">{heroLabel}</h1>
                <p className="mt-1 text-sm text-slate-300">Last updated: {new Date().toLocaleString()}</p>
                <p className="mt-3 text-sm text-slate-300">We continuously monitor every API endpoint.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Public URL + summary cards */}
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {!isDashboard && publicUrl && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <p className="text-xs text-slate-400">Public Status</p>
              <div className="mt-3 flex items-center justify-between gap-3">
                <div className="truncate text-sm text-emerald-200">{publicUrl || "—"}</div>
                <div className="flex gap-2">
                  <button onClick={copyUrl} className="rounded-md bg-slate-800 px-3 py-1 text-sm text-white">{copied ? "Copied" : "Copy Link"}</button>
                  {publicUrl ? (
                    <a href={publicUrl} target="_blank" rel="noreferrer" className="rounded-md bg-brand-600 px-3 py-1 text-sm font-semibold text-white">Open</a>
                  ) : null}
                  {publicUrl ? (
                    <a href={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(publicUrl)}`} target="_blank" rel="noreferrer" className="rounded-md bg-slate-800 px-3 py-1 text-sm text-white">QR</a>
                  ) : null}
                </div>
              </div>
            </div>
          )}

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-xs text-slate-400">Service Overview</p>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm text-slate-300">
              <div>
                <div className="text-xs text-slate-400">Total Services</div>
                <div className="mt-1 text-white font-semibold">{totalServices}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Operational</div>
                <div className="mt-1 text-white font-semibold">{operational}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Degraded</div>
                <div className="mt-1 text-white font-semibold">{degraded}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400">Down</div>
                <div className="mt-1 text-white font-semibold">{down}</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <p className="text-xs text-slate-400">Platform Health</p>
            <div className="mt-3 text-sm text-slate-300">
              <div>Overall Uptime: <span className="font-semibold text-white">{overallUptime}%</span></div>
              <div className="mt-2">Avg Response: <span className="font-semibold text-white">{avgResponse != null ? `${avgResponse} ms` : "—"}</span></div>
            </div>
          </div>
        </div>

        {/* Live services grid */}
        <section className="mt-6">
          <h2 className="text-xl font-semibold text-white">Live Services</h2>
          {services.length === 0 ? (
            <div className="mt-6 flex flex-col items-center justify-center py-12 text-center">
              <div className="text-4xl text-slate-500">📭</div>
              <p className="mt-4 text-lg text-white">No monitored services yet.</p>
              {isDashboard && (
                <Link to="/dashboard/monitors" className="mt-4 rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white">Add First Monitor</Link>
              )}
            </div>
          ) : (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => {
                const endpoint = s.message || "—";
                const ssl = endpoint.startsWith("https") ? "Valid" : endpoint.startsWith("http") ? "No" : "—";
                const uptime = s.uptimePercent != null ? s.uptimePercent : 0;
                return (
                  <div key={s.id} className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div className={`h-3 w-3 rounded-full ${s.state === 'operational' ? 'bg-emerald-400' : s.state === 'degraded' ? 'bg-amber-400' : 'bg-rose-400'}`}></div>
                          <div className="font-semibold text-white">{s.name}</div>
                        </div>
                        <div className="mt-2 text-xs text-slate-400 truncate">{endpoint}</div>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-300">
                          <div>Response: {s.responseTimeMs != null ? `${s.responseTimeMs} ms` : '—'}</div>
                          <div>SSL: {ssl}</div>
                          <div>Uptime: <span className="font-semibold text-white">{uptime}%</span></div>
                          <div>Last Check: {s.lastCheckedAt ? new Date(s.lastCheckedAt).toLocaleTimeString() : '—'}</div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div style={{ width: `${Math.max(0, Math.min(100, uptime))}%` }} className={`${uptime > 98 ? 'bg-emerald-400' : uptime > 90 ? 'bg-amber-400' : 'bg-rose-400'} h-3`}></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Incidents and timeline */}
        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <h3 className="text-lg font-semibold text-white">Active Incidents</h3>
            <div className="mt-3 text-sm text-slate-300">
              {activeIncidents.length === 0 ? (
                <div className="text-emerald-400">✅ No active incidents.</div>
              ) : (
                <div className="space-y-3">
                  {activeIncidents.map((inc) => {
                    const started = new Date(inc.startedAt).toLocaleString();
                    return (
                      <div key={inc.id} className="rounded-xl border border-slate-800 bg-slate-950/50 p-3">
                        <div className="font-semibold text-white">{inc.monitorName || inc.title}</div>
                        <div className="text-xs text-slate-400">Started: {started}</div>
                        <div className="text-xs mt-1">Status: <span className="font-medium">{inc.status}</span></div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <h3 className="text-lg font-semibold text-white">Recent Status Events</h3>
            <div className="mt-3 text-sm text-slate-300 space-y-2">
              {timeline.length === 0 ? (
                <div className="text-slate-500">No recent events.</div>
              ) : (
                timeline.slice(0, 10).map((t, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="text-xs text-slate-400">{new Date(t.time).toLocaleTimeString()}</div>
                    <div className="text-sm text-slate-200">{t.text}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PublicStatusPage;


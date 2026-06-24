import { useMemo, useState } from "react";
import Button from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";

const timeZones = [
  "UTC",
  "America/New_York",
  "Europe/London",
  "Asia/Tokyo",
  "Australia/Sydney",
];

const monitorIntervals = [
  { label: "30 seconds", value: "30s" },
  { label: "1 minute", value: "1m" },
  { label: "5 minutes", value: "5m" },
  { label: "10 minutes", value: "10m" },
];

const SettingsPage = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.name || "");
  const [workspaceName, setWorkspaceName] = useState(
    user?.email
      ? `${user.email.split("@")[1].split(".")[0]} workspace`
      : "My workspace"
  );
  const [timeZone, setTimeZone] = useState(timeZones[0]);
  const [monitorInterval, setMonitorInterval] = useState(monitorIntervals[1].value);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [dailySummary, setDailySummary] = useState(false);
  const [incidentNotifications, setIncidentNotifications] = useState(true);
  const [autoPauseMonitors, setAutoPauseMonitors] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusError, setStatusError] = useState("");

  const createdAt = useMemo(() => {
    if (!user?.createdAt) return "—";
    return new Date(user.createdAt).toLocaleDateString();
  }, [user?.createdAt]);

  const handleSave = async () => {
    setSaving(true);
    setStatusError("");
    setStatusMessage("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 400));
      setStatusMessage(
        "Your preferences have been updated locally. Profile edit support will be added in the next release."
      );
    } catch (error) {
      setStatusError("Unable to save settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDangerAction = (message: string) => {
    setStatusError("");
    if (window.confirm(message)) {
      setStatusMessage(
        "This action is not enabled in the current preview. Contact an administrator to continue."
      );
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Settings</h2>
          <p className="mt-1 text-sm text-slate-400">
            Manage account details, workspace controls, notifications, and security preferences.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={handleSave}
            isLoading={saving}
          >
            Save changes
          </Button>
          <Button variant="outline" size="md" onClick={() => setStatusMessage("Settings are not connected to a backend save endpoint yet.")}
          >
            Preview updates
          </Button>
        </div>
      </div>

      {statusMessage ? (
        <div className="rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-slate-200">
          {statusMessage}
        </div>
      ) : null}
      {statusError ? (
        <div className="rounded-xl border border-rose-600 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {statusError}
        </div>
      ) : null}

      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white">Account</h3>
            <p className="mt-1 text-sm text-slate-400">
              Your account information and access status.
            </p>
          </div>
          <span className="rounded-full border border-slate-700 bg-slate-950 px-3 py-1 text-xs text-slate-300">
            {user?.isEmailVerified ? "Email verified" : "Email unverified"}
          </span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Full name</label>
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Work email</label>
            <input
              readOnly
              value={user?.email ?? ""}
              className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-400"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <p className="text-sm text-slate-400">Workspace</p>
            <p className="mt-2 text-lg font-semibold text-white">{workspaceName}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <p className="text-sm text-slate-400">Member since</p>
            <p className="mt-2 text-lg font-semibold text-white">{createdAt}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4">
            <p className="text-sm text-slate-400">Current plan</p>
            <p className="mt-2 text-lg font-semibold text-white">Pro trial</p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Workspace preferences</h3>
          <p className="mt-1 text-sm text-slate-400">
            Configure defaults for your team, timezone, and monitoring cadence.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Workspace name</label>
            <input
              value={workspaceName}
              onChange={(event) => setWorkspaceName(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Time zone</label>
            <select
              value={timeZone}
              onChange={(event) => setTimeZone(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
            >
              {timeZones.map((zone) => (
                <option key={zone} value={zone}>
                  {zone}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Notifications</h3>
          <p className="mt-1 text-sm text-slate-400">
            Choose how your team receives alerts and summaries.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <label className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(event) => setEmailAlerts(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-600 text-brand-500 focus:ring-brand-500"
            />
            <div>
              <p className="font-semibold text-white">Email alerts</p>
              <p className="text-sm text-slate-400">Notify the account owner when monitors fail or recover.</p>
            </div>
          </label>
          <label className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
            <input
              type="checkbox"
              checked={incidentNotifications}
              onChange={(event) => setIncidentNotifications(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-600 text-brand-500 focus:ring-brand-500"
            />
            <div>
              <p className="font-semibold text-white">Incident updates</p>
              <p className="text-sm text-slate-400">Receive live incident notifications for your workspace.</p>
            </div>
          </label>
          <label className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
            <input
              type="checkbox"
              checked={dailySummary}
              onChange={(event) => setDailySummary(event.target.checked)}
              className="mt-1 h-4 w-4 rounded border-slate-600 text-brand-500 focus:ring-brand-500"
            />
            <div>
              <p className="font-semibold text-white">Daily summary</p>
              <p className="text-sm text-slate-400">Send a daily uptime report to your inbox.</p>
            </div>
          </label>
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <div>
          <h3 className="text-lg font-semibold text-white">Monitoring</h3>
          <p className="mt-1 text-sm text-slate-400">
            Set default monitor behavior and automatic actions.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Default check interval</label>
            <select
              value={monitorInterval}
              onChange={(event) => setMonitorInterval(event.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
            >
              {monitorIntervals.map((interval) => (
                <option key={interval.value} value={interval.value}>
                  {interval.label}
                </option>
              ))}
            </select>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
            <label className="flex items-center gap-3 text-sm font-medium text-white">
              <input
                type="checkbox"
                checked={autoPauseMonitors}
                onChange={(event) => setAutoPauseMonitors(event.target.checked)}
                className="h-4 w-4 rounded border-slate-600 text-brand-500 focus:ring-brand-500"
              />
              Auto-pause inactive monitors
            </label>
            <p className="mt-2 text-sm text-slate-400">
              Pause monitors automatically when they do not receive traffic for 24 hours.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Security & access</h3>
            <p className="mt-1 text-sm text-slate-400">
              Control workspace access and secure how team members sign in.
            </p>
          </div>
          <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
            Coming soon
          </span>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
            <p className="text-sm text-slate-400">Single sign-on</p>
            <p className="mt-2 text-sm text-slate-300">
              SSO integration for enterprise teams will be available in the next release.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
            <p className="text-sm text-slate-400">Multi-factor authentication</p>
            <p className="mt-2 text-sm text-slate-300">
              Add an extra security layer for account logins and workspace access.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-4">
            <p className="text-sm text-slate-400">API token management</p>
            <p className="mt-2 text-sm text-slate-300">
              Generate and revoke API tokens for integrations and automation.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Danger zone</h3>
            <p className="mt-1 text-sm text-slate-400">
              Actions in this section are permanent and require confirmation.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="danger"
              size="md"
              onClick={() => handleDangerAction("Delete this workspace and all associated data? This cannot be undone.")}
            >
              Delete workspace
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => handleDangerAction("Deactivate your account? You can reactivate within 30 days.")}
            >
              Deactivate account
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingsPage;

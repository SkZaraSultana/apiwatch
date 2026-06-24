import { useEffect, useState, type FormEvent } from "react";
import {
  HTTP_METHODS,
  type Monitor,
  type MonitorInput,
} from "../../services/monitorService";

type MonitorFormProps = {
  initial?: Monitor | null;
  onSubmit: (payload: MonitorInput) => Promise<void>;
  onCancel: () => void;
};

const defaultValues: MonitorInput = {
  name: "",
  url: "",
  method: "GET",
  expectedStatus: 200,
  interval: 300,
  timeout: 10000,
  latencyThresholdMs: 3000,
};

const MonitorForm = ({ initial, onSubmit, onCancel }: MonitorFormProps) => {
  const [form, setForm] = useState<MonitorInput>(defaultValues);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initial) {
      setForm({
        name: initial.name,
        url: initial.url,
        method: initial.method,
        expectedStatus: initial.expectedStatus,
        interval: initial.interval,
        timeout: initial.timeout,
        latencyThresholdMs: initial.latencyThresholdMs,
      });
    } else {
      setForm(defaultValues);
    }
  }, [initial]);

  const handleChange = (
    field: keyof MonitorInput,
    value: string | number
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await onSubmit(form);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Unable to save monitor.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="monitor-name" className="mb-1 block text-sm text-slate-300">
          Monitor Name
        </label>
        <input
          id="monitor-name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
          placeholder="Production API Health"
        />
      </div>

      <div>
        <label htmlFor="monitor-url" className="mb-1 block text-sm text-slate-300">
          API URL
        </label>
        <input
          id="monitor-url"
          type="url"
          value={form.url}
          onChange={(e) => handleChange("url", e.target.value)}
          required
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
          placeholder="https://api.example.com/health"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="monitor-method" className="mb-1 block text-sm text-slate-300">
            Method
          </label>
          <select
            id="monitor-method"
            value={form.method}
            onChange={(e) => handleChange("method", e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
          >
            {HTTP_METHODS.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="monitor-expected-status"
            className="mb-1 block text-sm text-slate-300"
          >
            Expected Status
          </label>
          <input
            id="monitor-expected-status"
            type="number"
            min={100}
            max={599}
            value={form.expectedStatus}
            onChange={(e) => handleChange("expectedStatus", Number(e.target.value))}
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="monitor-interval" className="mb-1 block text-sm text-slate-300">
            Interval (seconds)
          </label>
          <input
            id="monitor-interval"
            type="number"
            min={30}
            value={form.interval}
            onChange={(e) => handleChange("interval", Number(e.target.value))}
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="monitor-timeout" className="mb-1 block text-sm text-slate-300">
            Timeout (ms)
          </label>
          <input
            id="monitor-timeout"
            type="number"
            min={1000}
            max={120000}
            step={1000}
            value={form.timeout}
            onChange={(e) => handleChange("timeout", Number(e.target.value))}
            required
            className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="monitor-latency-threshold"
          className="mb-1 block text-sm text-slate-300"
        >
          Latency alert threshold (ms)
        </label>
        <input
          id="monitor-latency-threshold"
          type="number"
          min={100}
          max={120000}
          step={100}
          value={form.latencyThresholdMs}
          onChange={(e) => handleChange("latencyThresholdMs", Number(e.target.value))}
          required
          className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
        />
      </div>

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-60"
        >
          {submitting ? "Saving..." : initial ? "Update Monitor" : "Create Monitor"}
        </button>
      </div>
    </form>
  );
};

export default MonitorForm;

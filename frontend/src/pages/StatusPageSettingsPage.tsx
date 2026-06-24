import { useState } from "react";
import { Link } from "react-router-dom";
import { Skeleton } from "../components/dashboard/LoadingState";
import { useStatusPageSettings } from "../hooks/useStatusPageSettings";

const StatusPageSettingsPage = () => {
  const { config, loading, saving, error, message, regenerateUrl, save } =
    useStatusPageSettings();
  const [title, setTitle] = useState("");

  const handleSave = async () => {
    await save({
      title: title || config?.title,
      isPublished: config?.isPublished,
    });
  };

  const copyUrl = async () => {
    if (!config?.publicUrl) return;
    await navigator.clipboard.writeText(config.publicUrl);
  };

  if (loading) {
    return <Skeleton className="h-64 w-full" />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-white">Public Status Page</h2>
        <p className="mt-1 text-sm text-slate-400">
          Share a public URL showing operational, degraded, and outage states with
          real-time updates.
        </p>
      </div>

      {error ? <p className="text-sm text-rose-400">{error}</p> : null}
      {message ? (
        <p className="rounded-lg border border-slate-700 bg-slate-900/60 px-4 py-3 text-sm text-slate-200">
          {message}
        </p>
      ) : null}

      {config ? (
        <>
          <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
            <div>
              <label htmlFor="status-title" className="mb-1 block text-sm text-slate-300">
                Page title
              </label>
              <input
                id="status-title"
                defaultValue={config.title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <p className="text-sm text-slate-300">Public URL</p>
              <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <input
                  readOnly
                  value={config.publicUrl}
                  className="flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-300"
                />
                <button
                  type="button"
                  onClick={copyUrl}
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
                >
                  Copy
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                checked={config.isPublished}
                onChange={(e) => save({ isPublished: e.target.checked })}
                disabled={saving}
              />
              Published (publicly accessible)
            </label>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                disabled={saving}
                onClick={handleSave}
                className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-60"
              >
                Save changes
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={regenerateUrl}
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800 disabled:opacity-60"
              >
                Regenerate URL
              </button>
              <Link
                to={`/status/${config.slug}`}
                target="_blank"
                className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
              >
                Preview page
              </Link>
            </div>
          </section>
        </>
      ) : null}
    </div>
  );
};

export default StatusPageSettingsPage;

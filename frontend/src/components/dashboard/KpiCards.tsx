import { KpiCardsSkeleton } from "./LoadingState";
import type { HealthSummaryData } from "./HealthSummary";

export type KpiMetric = {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
};

type KpiCardsProps = {
  metrics: KpiMetric[];
  loading?: boolean;
  health?: HealthSummaryData | null;
};

const trendStyles = {
  up: "text-emerald-400",
  down: "text-rose-400",
  neutral: "text-slate-400",
};

const KpiCards = ({ metrics, loading = false, health = null }: KpiCardsProps) => {
  if (loading) {
    return <KpiCardsSkeleton />;
  }

  const totalMonitors = health?.regions.length ?? null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const regions = health?.regions ?? [];
        const onlineNames = regions.filter((r) => r.status === "healthy").map((r) => r.name);
        const offlineNames = regions.filter((r) => r.status === "down").map((r) => r.name);

        const renderStatusList = (
          names: string[],
          title: string,
          colorClass: string
        ) => {
          if (names.length === 0) return null;

          const displayNames = names.length > 5 ? names.slice(0, 3) : names;
          const remaining = names.length > 5 ? names.length - 3 : 0;

          return (
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-300">{title}</p>
              <ul className="mt-3 space-y-2">
                {displayNames.map((name) => (
                  <li key={name} className="flex items-center gap-2 text-sm text-slate-200">
                    <span className={`inline-flex h-2.5 w-2.5 rounded-full ${colorClass}`} />
                    <span>{name}</span>
                  </li>
                ))}
                {remaining > 0 ? (
                  <li className="text-sm text-slate-400">+{remaining} more</li>
                ) : null}
              </ul>
            </div>
          );
        };

        const onlineChangeText = totalMonitors
          ? `${metric.value} of ${totalMonitors} total`
          : metric.change;

        return (
          <article
            key={metric.id}
            className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-slate-700"
          >
            <p className="text-sm text-slate-400">{metric.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
              {metric.value}
            </p>
            <p className={`mt-2 text-xs ${trendStyles[metric.trend]}`}>{onlineChangeText}</p>

            {metric.id === "online" ? (
              <>
                {onlineNames.length > 0 ? (
                  renderStatusList(onlineNames, "Active Monitors", "bg-emerald-400")
                ) : (
                  <p className="mt-4 text-sm text-slate-400">No active monitors.</p>
                )}
              </>
            ) : null}

            {metric.id === "offline" ? (
              <>
                {offlineNames.length > 0 ? (
                  renderStatusList(offlineNames, "Offline Monitor", "bg-rose-400")
                ) : (
                  <p className="mt-4 text-sm text-emerald-300">✓ No offline monitors.</p>
                )}
              </>
            ) : null}
          </article>
        );
      })}
    </div>
  );
};

export default KpiCards;

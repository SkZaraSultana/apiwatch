import KpiCards from "../components/dashboard/KpiCards";
import RecentActivity from "../components/dashboard/RecentActivity";
import HealthSummary from "../components/dashboard/HealthSummary";
import LoadingState from "../components/dashboard/LoadingState";
import { useDashboardOverview } from "../hooks/useDashboardOverview";

const DashboardPage = () => {
  const { loading, data } = useDashboardOverview();

  if (loading || !data) {
    return <LoadingState />;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section>
        <p className="text-sm text-slate-400">Welcome back</p>
        <h2 className="mt-1 text-2xl font-semibold text-white">Operations Overview</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Track uptime, latency, and incident signals across your API surface in one place.
        </p>
      </section>

      <KpiCards metrics={data.metrics} health={data.health} />

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RecentActivity items={data.activities} />
        </div>
        <div className="lg:col-span-2">
          <HealthSummary data={data.health} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

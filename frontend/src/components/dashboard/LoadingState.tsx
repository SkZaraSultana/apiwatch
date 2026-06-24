type SkeletonProps = {
  className?: string;
};

export const Skeleton = ({ className = "" }: SkeletonProps) => (
  <div
    className={`animate-pulse rounded-lg bg-slate-800/80 ${className}`}
    aria-hidden
  />
);

export const KpiCardsSkeleton = () => (
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        key={index}
        className="rounded-xl border border-slate-800 bg-slate-900/60 p-5"
      >
        <Skeleton className="h-3 w-24" />
        <Skeleton className="mt-4 h-8 w-20" />
        <Skeleton className="mt-3 h-3 w-32" />
      </div>
    ))}
  </div>
);

export const RecentActivitySkeleton = () => (
  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
    <Skeleton className="h-5 w-36" />
    <div className="mt-5 space-y-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const HealthSummarySkeleton = () => (
  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
    <Skeleton className="h-5 w-40" />
    <div className="mt-5 space-y-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-center justify-between gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      ))}
    </div>
    <Skeleton className="mt-6 h-24 w-full rounded-lg" />
  </div>
);

export const DashboardOverviewSkeleton = () => (
  <div className="space-y-6">
    <div className="space-y-2">
      <Skeleton className="h-7 w-48" />
      <Skeleton className="h-4 w-72" />
    </div>
    <KpiCardsSkeleton />
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <RecentActivitySkeleton />
      </div>
      <div className="lg:col-span-2">
        <HealthSummarySkeleton />
      </div>
    </div>
  </div>
);

const LoadingState = () => (
  <div role="status" aria-label="Loading dashboard" className="space-y-6">
    <DashboardOverviewSkeleton />
    <span className="sr-only">Loading dashboard data...</span>
  </div>
);

export default LoadingState;

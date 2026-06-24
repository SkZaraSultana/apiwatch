import type { ReactNode } from "react";

type ChartCardProps = {
  title: string;
  description?: string;
  children: ReactNode;
  empty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
};

const ChartCard = ({
  title,
  description,
  children,
  empty = false,
  emptyTitle = "No data available",
  emptyDescription = "Data will appear after monitors run checks.",
}: ChartCardProps) => {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5">
      <header className="mb-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        {description ? <p className="mt-1 text-sm text-slate-400">{description}</p> : null}
      </header>

      {empty ? (
        <div className="flex min-h-[260px] flex-col items-center justify-center rounded-lg border border-dashed border-slate-700/80 bg-slate-950/40 px-6 text-center">
          <p className="text-sm font-medium text-slate-200">{emptyTitle}</p>
          <p className="mt-2 max-w-sm text-sm text-slate-500">{emptyDescription}</p>
        </div>
      ) : (
        children
      )}
    </section>
  );
};

export default ChartCard;

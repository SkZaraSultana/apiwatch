import EmptyState from "../components/dashboard/EmptyState";

type PlaceholderPageProps = {
  title: string;
  description: string;
  actionLabel: string;
};

const PlaceholderPage = ({ title, description, actionLabel }: PlaceholderPageProps) => {
  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="text-2xl font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
      <div className="mt-8">
        <EmptyState
          title={`${title} coming soon`}
          description="This section will be available once monitoring data is connected."
          action={
            <button
              type="button"
              className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
            >
              {actionLabel}
            </button>
          }
        />
      </div>
    </div>
  );
};

export default PlaceholderPage;

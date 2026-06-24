import type { ReactNode } from "react";

type EmptyStateProps = {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
};

const DefaultIcon = () => (
  <svg
    className="h-10 w-10 text-slate-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
    />
  </svg>
);

const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700/80 bg-slate-900/40 px-6 py-12 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800/80">
        {icon ?? <DefaultIcon />}
      </div>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-400">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
};

export default EmptyState;

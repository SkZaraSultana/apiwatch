import type { RiskLevel } from "../../services/securityService";

type RiskScoreCardProps = {
  score: number;
  level: RiskLevel;
  activeEvents: number;
};

const levelStyles: Record<RiskLevel, string> = {
  low: "text-emerald-300",
  medium: "text-amber-300",
  high: "text-orange-300",
  critical: "text-rose-300",
};

const ringStyles: Record<RiskLevel, string> = {
  low: "stroke-emerald-500",
  medium: "stroke-amber-500",
  high: "stroke-orange-500",
  critical: "stroke-rose-500",
};

const RiskScoreCard = ({ score, level, activeEvents }: RiskScoreCardProps) => {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <h3 className="text-lg font-semibold text-white">Risk Score</h3>
      <p className="mt-1 text-sm text-slate-400">
        Calculated from active security events in the last 24 hours.
      </p>

      <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:items-center">
        <div className="relative h-36 w-36">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#1e293b"
              strokeWidth="10"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              className={ringStyles[level]}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${levelStyles[level]}`}>{score}</span>
            <span className="text-xs uppercase tracking-wide text-slate-400">{level}</span>
          </div>
        </div>

        <div className="text-center sm:text-left">
          <p className="text-sm text-slate-300">
            <span className="font-semibold text-white">{activeEvents}</span> active
            security events contributing to risk.
          </p>
          <p className="mt-2 text-xs text-slate-500">
            Dismiss resolved findings to reduce your score.
          </p>
        </div>
      </div>
    </section>
  );
};

export default RiskScoreCard;

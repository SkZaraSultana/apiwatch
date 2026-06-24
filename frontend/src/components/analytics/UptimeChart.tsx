import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartCard from "./ChartCard";
import type { UptimePoint } from "../../services/analyticsService";

type UptimeChartProps = {
  data: UptimePoint[];
  monitorName?: string;
};

const UptimeChart = ({ data, monitorName }: UptimeChartProps) => {
  const isEmpty = data.length === 0;
  const description = monitorName
    ? `Uptime for "${monitorName}"`
    : "Availability percentage across check intervals.";

  return (
    <ChartCard
      title="Uptime"
      description={description}
      empty={isEmpty}
      emptyTitle="No uptime data"
      emptyDescription="Uptime trends appear once monitoring checks are recorded."
    >
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="uptimeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
            <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} unit="%" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "8px",
              }}
              formatter={(value) => [`${value}%`, "Uptime"]}
            />
            <Area
              type="monotone"
              dataKey="uptimePercent"
              stroke="#10b981"
              fill="url(#uptimeGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default UptimeChart;

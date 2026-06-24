import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartCard from "./ChartCard";
import type { HealthPoint } from "../../services/analyticsService";

type HealthChartProps = {
  data: HealthPoint[];
  monitorName?: string;
};

const stateColor = {
  up: "#10b981",
  down: "#f43f5e",
  unknown: "#64748b",
};

const HealthChart = ({ data, monitorName }: HealthChartProps) => {
  const chartData = data.map((item) => ({
    name: item.name,
    uptimePercent: item.uptimePercent,
    state: item.state,
  }));

  const isEmpty = chartData.length === 0;
  const description = monitorName
    ? `Health for "${monitorName}"`
    : "Per-monitor uptime percentage and current health state.";

  return (
    <ChartCard
      title="Health"
      description={description}
      empty={isEmpty}
      emptyTitle="No monitors to analyze"
      emptyDescription="Add monitors to see health distribution across your API endpoints."
    >
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" fontSize={12} unit="%" />
            <YAxis
              type="category"
              dataKey="name"
              stroke="#94a3b8"
              fontSize={12}
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "8px",
              }}
              formatter={(value, _name, item) => [
                `${value}% (${item.payload.state})`,
                "Uptime",
              ]}
            />
            <Bar dataKey="uptimePercent" radius={[0, 4, 4, 0]}>
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={stateColor[entry.state]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default HealthChart;

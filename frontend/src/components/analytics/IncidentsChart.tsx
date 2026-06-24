import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartCard from "./ChartCard";
import type { IncidentPoint } from "../../services/analyticsService";

type IncidentsChartProps = {
  data: IncidentPoint[];
  monitorName?: string;
};

const IncidentsChart = ({ data, monitorName }: IncidentsChartProps) => {
  const isEmpty = data.length === 0;
  const description = monitorName
    ? `Incidents for "${monitorName}"`
    : "Downtime incidents detected from failed monitor checks.";

  return (
    <ChartCard
      title="Incidents"
      description={description}
      empty={isEmpty}
      emptyTitle="No incidents recorded"
      emptyDescription="Incidents are derived when checks fail and remain unavailable."
    >
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
            <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "8px",
              }}
              formatter={(value) => [value, "Incidents"]}
            />
            <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default IncidentsChart;

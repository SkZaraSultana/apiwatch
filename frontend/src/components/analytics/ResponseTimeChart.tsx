import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartCard from "./ChartCard";
import type { ResponseTimePoint } from "../../services/analyticsService";

type ResponseTimeChartProps = {
  data: ResponseTimePoint[];
  monitorName?: string;
};

const ResponseTimeChart = ({ data, monitorName }: ResponseTimeChartProps) => {
  const isEmpty = data.length === 0;
  const description = monitorName
    ? `Response time for "${monitorName}"`
    : "Average response time from monitor check logs.";

  return (
    <ChartCard
      title="Response Time"
      description={description}
      empty={isEmpty}
      emptyTitle="No response time data"
      emptyDescription="Create active monitors and wait for checks to populate this chart."
    >
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#1e293b" strokeDasharray="3 3" />
            <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              unit="ms"
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "#e2e8f0" }}
              formatter={(value) => [`${value} ms`, "Avg response"]}
            />
            <Line
              type="monotone"
              dataKey="avgResponseTimeMs"
              stroke="#2d6cdf"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default ResponseTimeChart;

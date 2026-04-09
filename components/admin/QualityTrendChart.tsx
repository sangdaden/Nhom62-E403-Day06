"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export interface TrendPoint {
  date: string;
  avgScore: number;
  count: number;
}

interface QualityTrendChartProps {
  data: TrendPoint[];
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return `${d.getDate()}/${d.getMonth() + 1}`;
}

export function QualityTrendChart({ data }: QualityTrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-[#9AA5B1] text-sm">
        Chưa có dữ liệu chấm điểm. Chat vài câu để bắt đầu thu thập.
      </div>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    dateLabel: formatDate(d.date),
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 8, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#E5E9ED" />
        <XAxis
          dataKey="dateLabel"
          tick={{ fontSize: 11, fill: "#9AA5B1" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          yAxisId="score"
          domain={[0, 5]}
          tick={{ fontSize: 11, fill: "#9AA5B1" }}
          axisLine={false}
          tickLine={false}
          width={28}
        />
        <YAxis
          yAxisId="count"
          orientation="right"
          tick={{ fontSize: 11, fill: "#9AA5B1" }}
          axisLine={false}
          tickLine={false}
          width={28}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 10,
            border: "1px solid #E5E9ED",
            fontSize: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
          formatter={(value, name) => {
            if (name === "Điểm TB" && typeof value === "number") {
              return [value.toFixed(2), name];
            }
            return [value, name];
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
          iconType="circle"
          iconSize={8}
        />
        <Line
          yAxisId="score"
          type="monotone"
          dataKey="avgScore"
          name="Điểm TB"
          stroke="#00B5AD"
          strokeWidth={2.5}
          dot={{ r: 3, fill: "#00B5AD" }}
          activeDot={{ r: 5 }}
        />
        <Line
          yAxisId="count"
          type="monotone"
          dataKey="count"
          name="Số tin nhắn"
          stroke="#6366F1"
          strokeWidth={2}
          strokeDasharray="5 3"
          dot={{ r: 2, fill: "#6366F1" }}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

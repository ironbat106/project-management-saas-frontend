"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartDatum } from "@/types";

export function SimpleBarChart({
  data,
  color = "var(--chart-1)",
}: {
  data: ChartDatum[];
  color?: string;
}) {
  const isEmpty = data.every((item) => item.value === 0);

  if (isEmpty) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        There is no data to chart yet.
      </p>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 0, left: -16 }}
        >
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            fontSize={12}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            fontSize={12}
          />
          <Tooltip
            cursor={{ fill: "var(--muted)" }}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--popover)",
              fontSize: 12,
            }}
          />
          <Bar
            dataKey="value"
            name="Count"
            fill={color}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

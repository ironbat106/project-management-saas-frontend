"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { ChartDatum } from "@/types";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function DonutChart({ data }: { data: ChartDatum[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (total === 0) {
    return (
      <p className="py-16 text-center text-sm text-muted-foreground">
        There is no data to chart yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="label"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={2}
              stroke="var(--card)"
            >
              {data.map((item, index) => (
                <Cell key={item.label} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--popover)",
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-sm">
        {data.map((item, index) => (
          <li key={item.label} className="flex items-center gap-1.5">
            <span
              className="size-2.5 rounded-sm"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
              aria-hidden="true"
            />
            {item.label}
            <span className="text-muted-foreground tabular-nums">
              {item.value}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

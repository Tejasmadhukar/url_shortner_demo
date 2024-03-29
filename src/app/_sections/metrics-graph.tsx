"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { type Table } from "@tanstack/react-table";

interface MetricsProps<TData> {
  table: Table<TData>;
}

interface MetricsData {
  url: string;
  clicks: number;
}

export default function Metrics<TData>({ table }: MetricsProps<TData>) {
  const data: MetricsData[] = [];

  const current_rows = table.getFilteredRowModel().rows;
  current_rows.forEach((val) =>
    data.push({
      // @ts-expect-error accessing shit
      url: val.original.tinyurl, //eslint-disable-line
      // @ts-expect-error accessing shit
      clicks: val.original.TimesClicked, //eslint-disable-line
    }),
  );

  console.log(data);

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="url"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar
          dataKey="clicks"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

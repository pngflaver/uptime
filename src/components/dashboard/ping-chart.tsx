'use client';

import React from 'react';
import type { PingData } from '@/lib/types';
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';
import { ChartContainer, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';

interface PingChartProps {
  data: PingData[];
}

const chartConfig = {
  latency: {
    label: 'Latency (ms)',
    color: 'hsl(var(--accent))',
  },
} satisfies ChartConfig;

const PingChart: React.FC<PingChartProps> = ({ data }) => {
  const chartData = [...data].reverse();

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <AreaChart
        data={chartData}
        margin={{ top: 5, right: 0, left: -20, bottom: 0 }}
        accessibilityLayer
      >
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="time"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={() => ''}
          fontSize={12}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickCount={3}
          fontSize={10}
          domain={[0, 'dataMax + 50']}
          hide
        />
        <Tooltip
          cursor={{ fill: 'hsl(var(--muted))', opacity: 0.5 }}
          content={<ChartTooltipContent indicator="line" labelClassName="text-xs" className="text-xs p-2" />}
        />
        <defs>
            <linearGradient id="fillLatency" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.1}/>
            </linearGradient>
        </defs>
        <Area
          dataKey="latency"
          type="monotone"
          fill="url(#fillLatency)"
          stroke="hsl(var(--accent))"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
          connectNulls
        />
      </AreaChart>
    </ChartContainer>
  );
};

export default PingChart;

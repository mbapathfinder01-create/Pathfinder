import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { SERIES_COLORS, useChartTheme } from './chartTheme';

export function DistributionPie({ data, height = 260 }: { data: { name: string; value: number }[]; height?: number }) {
  const theme = useChartTheme();
  return (
    <div role="img" aria-label={`Distribution: ${data.map((d) => `${d.name} ${d.value}`).join(', ')}`}>
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
            label={({ name, value }) => `${name}: ${value}`}
            fontSize={11}
          >
            {data.map((d, i) => (
              <Cell key={d.name} fill={SERIES_COLORS[i % SERIES_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={theme.tooltip.contentStyle} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useChartTheme } from './chartTheme';

interface ColumnChartProps {
  data: { name: string; value: number }[];
  colors: string[];
  height?: number;
  domain?: [number, number];
  integerTicks?: boolean;
  ariaLabel: string;
}

/** Vertical bar chart with one color per bar (SWOT profile, admin specialization counts). */
export function ColumnChart({ data, colors, height = 320, domain, integerTicks = false, ariaLabel }: ColumnChartProps) {
  const theme = useChartTheme();
  return (
    <div role="img" aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.gridSoft} />
          <XAxis dataKey="name" tick={{ fill: theme.tick, fontSize: 11 }} interval={0} />
          <YAxis domain={domain} allowDecimals={!integerTicks} tick={{ fill: theme.tickMuted, fontSize: 11 }} />
          <Tooltip contentStyle={theme.tooltip.contentStyle} cursor={theme.tooltip.cursor} />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((d, i) => (
              <Cell key={d.name} fill={colors[i % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

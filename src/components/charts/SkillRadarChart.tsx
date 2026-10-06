import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { RadarPoint } from '../../types';
import { useChartTheme } from './chartTheme';

export function SkillRadarChart({ data, height = 320, fontSize = 11 }: { data: RadarPoint[]; height?: number; fontSize?: number }) {
  const theme = useChartTheme();
  return (
    <div role="img" aria-label={`Skill radar: ${data.map((d) => `${d.skill} ${d.score}%`).join(', ')}`}>
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke={theme.grid} />
          <PolarAngleAxis dataKey="skill" tick={{ fill: theme.tick, fontSize }} />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: theme.tickMuted, fontSize: 10 }} />
          <Tooltip contentStyle={theme.tooltip.contentStyle} formatter={(v) => [`${v}%`, 'Score']} />
          <Radar dataKey="score" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.35} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

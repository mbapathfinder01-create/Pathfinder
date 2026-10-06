import { useApp } from '../../context/appState';

export const SERIES_COLORS = ['#4f46e5', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899'];
export const SWOT_COLORS = ['#10b981', '#f43f5e', '#0ea5e9', '#f59e0b'];

export function useChartTheme() {
  const { dark } = useApp();
  return {
    grid: dark ? '#334155' : '#cbd5e1',
    gridSoft: dark ? '#1e293b' : '#e2e8f0',
    tick: dark ? '#cbd5e1' : '#475569',
    tickMuted: dark ? '#64748b' : '#94a3b8',
    tooltip: {
      contentStyle: {
        background: dark ? '#0f172a' : '#fff',
        border: `1px solid ${dark ? '#334155' : '#e5e7eb'}`,
        borderRadius: 8,
        fontSize: 12,
        color: dark ? '#e5e7eb' : '#0f172a',
      },
      cursor: { fill: dark ? '#1e293b' : '#f1f5f9' },
    },
  };
}

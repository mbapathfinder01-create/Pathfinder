import { TrendingUp } from 'lucide-react';
import type { Recommendation } from '../../types';
import { CardTitle } from '../ui/CardTitle';

// Static class names so Tailwind can see them at build time.
const DOT = {
  indigo: 'bg-indigo-500 ring-indigo-100 dark:ring-indigo-950',
  purple: 'bg-purple-500 ring-purple-100 dark:ring-purple-950',
  emerald: 'bg-emerald-500 ring-emerald-100 dark:ring-emerald-950',
} as const;

export function CareerRoadmap({ top, preferredCity }: { top: Recommendation; preferredCity: string }) {
  const stages: { title: string; desc: string; color: keyof typeof DOT }[] = [
    {
      title: 'Short-term (0-6 months)',
      desc: `Complete ${top.suggestedCerts.slice(0, 2).join(' and ')} to build core ${top.spec.shortName} credentials.`,
      color: 'indigo',
    },
    {
      title: 'Medium-term (6-12 months)',
      desc: `Do 1 live project or internship in ${top.spec.shortName} — target roles: ${top.suitableCareers.slice(0, 2).join(', ')}.`,
      color: 'purple',
    },
    {
      title: 'Long-term (1-3 years)',
      desc: `Target placements in ${preferredCity || 'preferred city'} at companies listed in this report. Progress toward senior ${top.spec.shortName} roles.`,
      color: 'emerald',
    },
  ];

  return (
    <section className="card p-6">
      <CardTitle icon={TrendingUp}>Career Development Roadmap</CardTitle>
      <div className="relative pl-6">
        <div
          className="absolute left-2 top-1 bottom-1 w-0.5 bg-gradient-to-b from-indigo-400 via-purple-400 to-emerald-400"
          aria-hidden
        />
        <ol className="space-y-4">
          {stages.map((s) => (
            <li key={s.title} className="relative">
              <div className={`absolute -left-5 top-1 h-3 w-3 rounded-full ring-4 ${DOT[s.color]}`} aria-hidden />
              <div className="font-semibold text-sm text-slate-900 dark:text-white">{s.title}</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">{s.desc}</div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

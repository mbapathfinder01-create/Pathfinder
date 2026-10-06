import { CircleCheck } from 'lucide-react';
import type { Recommendation, ScoreBreakdown } from '../../types';
import { ProgressBar } from '../ui/ProgressBar';

const BREAKDOWN_LABELS: Record<keyof ScoreBreakdown, string> = {
  academic: 'Academic',
  interest: 'Interest',
  swot: 'SWOT',
  skills: 'Skills',
  goal: 'Goal',
  cityDemand: 'Location',
};

/** One of the top-3 specialization cards on the recommendation page. */
export function MatchCard({ rec, rank }: { rec: Recommendation; rank: number }) {
  const isTop = rank === 0;
  return (
    <article
      className={`card overflow-hidden fade-in ${isTop ? 'ring-2 ring-indigo-500' : ''}`}
      style={{ animationDelay: `${rank * 80}ms` }}
      aria-label={`${isTop ? 'Top match' : `Recommendation ${rank + 1}`}: ${rec.spec.name}, ${rec.confidence}% match`}
    >
      <div className={`h-24 bg-gradient-to-br ${rec.spec.color} p-4 text-white relative overflow-hidden`}>
        <div className="absolute -right-4 -bottom-4 text-6xl opacity-20" aria-hidden>
          {rec.spec.icon}
        </div>
        <div className="flex items-center justify-between">
          <span className="bg-white/20 backdrop-blur px-2 py-0.5 rounded text-xs font-bold">
            {isTop ? '🏆 Top Match' : `#${rank + 1} Recommended`}
          </span>
          <span className="text-2xl font-bold">{rec.confidence}%</span>
        </div>
        <h3 className="text-xl font-bold mt-2">{rec.spec.name}</h3>
      </div>
      <div className="p-4 space-y-3">
        <ProgressBar value={rec.confidence} label="Match" gradient={rec.spec.color} className="h-1.5" />
        <dl className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
          {(Object.entries(rec.breakdown) as [keyof ScoreBreakdown, number][]).map(([key, value]) => {
            const pct = Math.round(Math.min(1, value) * 100);
            return (
              <div key={key} className="flex items-center gap-1.5">
                <dt className="w-16 text-slate-500">{BREAKDOWN_LABELS[key]}</dt>
                <dd className="flex-1 flex items-center gap-1.5">
                  <span className="flex-1 h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden" aria-hidden>
                    <span className="block h-full bg-indigo-500" style={{ width: `${pct}%` }} />
                  </span>
                  <span className="w-8 text-right font-semibold text-slate-700 dark:text-slate-300">{Math.round(value * 100)}%</span>
                </dd>
              </div>
            );
          })}
        </dl>
        <ul className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
          {rec.reasoning.slice(0, 2).map((reason) => (
            <li key={reason} className="text-xs text-slate-600 dark:text-slate-400 flex gap-1.5">
              <CircleCheck className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0 mt-0.5" aria-hidden />
              {reason}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

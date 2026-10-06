import { BadgeCheck, Lightbulb } from 'lucide-react';
import type { StrengthInsight } from '../../types';
import { CardTitle } from '../ui/CardTitle';

export function StrengthsCard({ strengths }: { strengths: StrengthInsight[] }) {
  return (
    <section className="card p-6">
      <CardTitle icon={Lightbulb} iconClassName="text-amber-500">
        How to Leverage Your Strengths
      </CardTitle>
      {strengths.length === 0 ? (
        <p className="text-sm text-slate-500">
          No skill was rated 4 or higher yet. Skills you rate as "Agree" or "Strongly Agree" will show up here with the specializations and
          roles that use them.
        </p>
      ) : (
        <ul className="space-y-3">
          {strengths.map((s) => (
            <li
              key={s.strength}
              className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 rounded-lg border border-amber-200 dark:border-amber-900"
            >
              <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <BadgeCheck className="h-4 w-4 text-amber-600" aria-hidden /> {s.strength}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                <strong className="text-indigo-600 dark:text-indigo-400">Best for:</strong>{' '}
                {s.recommendedSpecs.join(' • ') || 'Multiple tracks'}
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                <strong className="text-emerald-600 dark:text-emerald-400">Suggested roles:</strong>{' '}
                {s.suggestedRoles.join(' • ') || '—'}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

import { GraduationCap, Shield, TriangleAlert } from 'lucide-react';
import type { ImprovementPlan } from '../../types';
import { CardTitle } from '../ui/CardTitle';

export function WeaknessPlanCard({ plans }: { plans: ImprovementPlan[] }) {
  return (
    <section className="card p-6">
      <CardTitle icon={Shield} iconClassName="text-rose-500">
        Weakness Improvement Plan
      </CardTitle>
      {plans.length === 0 ? (
        <div className="text-sm text-emerald-700 dark:text-emerald-300 p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg">
          🎉 No major weaknesses detected! Keep building on your strengths.
        </div>
      ) : (
        <ul className="space-y-4">
          {plans.map((plan) => (
            <li
              key={plan.area}
              className="p-3 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/40 dark:to-pink-950/40 rounded-lg border border-rose-200 dark:border-rose-900"
            >
              <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <TriangleAlert className="h-4 w-4 text-rose-600" aria-hidden /> {plan.area}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5">{plan.impact}</p>
              <div className="mt-2">
                <div className="text-[10px] font-bold uppercase text-rose-700 dark:text-rose-300 mb-1">Suggested Actions</div>
                <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-0.5">
                  {plan.actions.slice(0, 3).map((a) => (
                    <li key={a}>• {a}</li>
                  ))}
                </ul>
              </div>
              {plan.certification && (
                <div className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold text-indigo-700 dark:text-indigo-300">
                  <GraduationCap className="h-3.5 w-3.5" aria-hidden /> {plan.certification}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

import { BadgeCheck } from 'lucide-react';

function readinessTone(score: number) {
  if (score >= 70) {
    return {
      box: 'from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border-emerald-200 dark:border-emerald-900',
      icon: 'text-emerald-600',
      message: "You're placement-ready! Focus on applying.",
    };
  }
  if (score >= 50) {
    return {
      box: 'from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border-amber-200 dark:border-amber-900',
      icon: 'text-amber-600',
      message: 'Good foundation. Work on skill gaps to raise readiness.',
    };
  }
  return {
    box: 'from-rose-50 to-pink-50 dark:from-rose-950/40 dark:to-pink-950/40 border-rose-200 dark:border-rose-900',
    icon: 'text-rose-600',
    message: 'Significant skill gaps. Start the improvement plan below.',
  };
}

export function PlacementReadinessBanner({ score }: { score: number }) {
  const tone = readinessTone(score);
  return (
    <div className={`card p-5 mb-6 bg-gradient-to-r ${tone.box}`}>
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <BadgeCheck className={`h-6 w-6 ${tone.icon}`} aria-hidden />
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white">Placement Readiness Score</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">{tone.message}</p>
          </div>
        </div>
        <div className="text-4xl font-bold text-slate-900 dark:text-white" aria-label={`${score} out of 100`}>
          {score}
          <span className="text-lg text-slate-500">/100</span>
        </div>
      </div>
    </div>
  );
}

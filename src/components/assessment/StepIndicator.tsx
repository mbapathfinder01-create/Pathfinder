import { Check } from 'lucide-react';
import { Fragment } from 'react';
import { SECTIONS } from '../../data/assessment';
import type { Lang } from '../../types';

const MARATHI_DIGITS = ['१', '२', '३'];

export function StepIndicator({ current, lang }: { current: number; lang: Lang }) {
  return (
    <ol className="flex items-center justify-between" aria-label="Assessment sections">
      {SECTIONS.map((section, i) => {
        const active = i === current;
        const done = i < current;
        return (
          <Fragment key={section.id}>
            <li className="flex flex-col items-center" aria-current={active ? 'step' : undefined}>
              <div
                className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  done
                    ? 'bg-emerald-500 text-white'
                    : active
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                }`}
              >
                {done ? <Check className="h-4 w-4" aria-label="Completed" /> : lang === 'mr' ? MARATHI_DIGITS[i] : i + 1}
              </div>
              <div
                className={`text-xs mt-1.5 font-medium max-w-[90px] text-center ${
                  active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {section.label[lang]}
              </div>
            </li>
            {i < SECTIONS.length - 1 && (
              <li
                aria-hidden
                className={`flex-1 h-0.5 mx-2 -mt-6 ${done ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`}
              />
            )}
          </Fragment>
        );
      })}
    </ol>
  );
}

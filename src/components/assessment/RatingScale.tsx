import { useRef, type KeyboardEvent } from 'react';
import { RATING_SCALE } from '../../data/assessment';
import type { Lang, Rating } from '../../types';

interface RatingScaleProps {
  value: number;
  onChange: (value: Rating) => void;
  lang: Lang;
  /** Accessible name for the group, usually the question text. */
  label: string;
  invalid?: boolean;
}

/** 1–5 Likert scale rendered as a colored radio group (arrow keys move the selection). */
export function RatingScale({ value, onChange, lang, label, invalid = false }: RatingScaleProps) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKey = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const delta = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (index + delta + RATING_SCALE.length) % RATING_SCALE.length;
    onChange(RATING_SCALE[next].n);
    refs.current[next]?.focus();
  };

  // Roving tabindex: only the selected option (or the first, if none) is in the tab order.
  const focusIndex = value ? value - 1 : 0;

  return (
    <div className="mt-2">
      <div
        role="radiogroup"
        aria-label={label}
        aria-invalid={invalid || undefined}
        className={`flex gap-1.5 rounded-xl ${invalid ? 'ring-2 ring-rose-400 ring-offset-2 ring-offset-white dark:ring-offset-slate-900' : ''}`}
      >
        {RATING_SCALE.map((point, i) => {
          const selected = value === point.n;
          return (
            <button
              key={point.n}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={`${point.n} – ${point.label.en}`}
              tabIndex={i === focusIndex ? 0 : -1}
              title={`${point.n}: ${point.label.en}`}
              onClick={() => onChange(point.n)}
              onKeyDown={(e) => handleKey(e, i)}
              className={`flex-1 h-11 rounded-lg border-2 font-bold text-sm transition-all ${
                selected
                  ? 'border-transparent text-white shadow-lg scale-105'
                  : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500'
              }`}
              style={selected ? { background: point.color, borderColor: point.color } : undefined}
            >
              {point.n}
            </button>
          );
        })}
      </div>
      <div className="flex gap-1.5 mt-1.5" aria-hidden>
        {RATING_SCALE.map((point) => (
          <div
            key={point.n}
            className="flex-1 text-center text-[9px] font-semibold text-slate-500 dark:text-slate-400 leading-tight px-0.5"
            style={value === point.n ? { color: point.color } : undefined}
          >
            {point.label[lang]}
          </div>
        ))}
      </div>
    </div>
  );
}

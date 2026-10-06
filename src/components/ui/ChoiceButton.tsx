import type { ReactNode } from 'react';

interface ChoiceButtonProps {
  selected: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
}

/** Single-select option button used in the registration form (background, experience, city). */
export function ChoiceButton({ selected, onClick, children, className = 'py-2 px-3' }: ChoiceButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`${className} rounded-lg text-sm font-medium border transition ${
        selected
          ? 'bg-indigo-600 text-white border-indigo-600'
          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-400'
      }`}
    >
      {children}
    </button>
  );
}

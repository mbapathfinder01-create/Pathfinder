import type { ReactNode } from 'react';

interface FilterPillProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}

/** Small toggle chip used in filter bars on the Careers and Opportunities pages. */
export function FilterPill({ active, onClick, children }: FilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
        active
          ? 'bg-indigo-600 text-white'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
      }`}
    >
      {children}
    </button>
  );
}

export function FilterRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap gap-2 items-center" role="group" aria-label={label}>
      <span className="text-xs font-semibold text-slate-500 w-full sm:w-auto">{label}:</span>
      {children}
    </div>
  );
}

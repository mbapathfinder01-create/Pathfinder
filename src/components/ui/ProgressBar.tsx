interface ProgressBarProps {
  value: number;
  label: string;
  /** Tailwind gradient stops for the fill. */
  gradient?: string;
  className?: string;
}

export function ProgressBar({ value, label, gradient = 'from-indigo-500 to-purple-500', className = 'h-2' }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));
  return (
    <div
      className={`${className} bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden`}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct}
    >
      <div className={`h-full bg-gradient-to-r ${gradient} transition-all duration-500`} style={{ width: `${pct}%` }} />
    </div>
  );
}

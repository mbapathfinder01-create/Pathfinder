import { CircleAlert, CircleCheck } from 'lucide-react';
import type { ReactNode } from 'react';

const STYLES = {
  error: {
    box: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300',
    Icon: CircleAlert,
  },
  success: {
    box: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900 text-emerald-700 dark:text-emerald-300',
    Icon: CircleCheck,
  },
} as const;

export function Alert({ tone, children, className = '' }: { tone: keyof typeof STYLES; children: ReactNode; className?: string }) {
  const { box, Icon } = STYLES[tone];
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={`flex items-start gap-2 border rounded-lg p-3 text-sm ${box} ${className}`}
    >
      <Icon className="h-4 w-4 flex-shrink-0 mt-0.5" aria-hidden />
      <span>{children}</span>
    </div>
  );
}

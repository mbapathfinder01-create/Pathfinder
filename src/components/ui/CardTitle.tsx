import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface CardTitleProps {
  icon: LucideIcon;
  children: ReactNode;
  iconClassName?: string;
  as?: 'h2' | 'h3';
  className?: string;
}

/** Icon + heading row used at the top of result/dashboard cards. */
export function CardTitle({ icon: Icon, children, iconClassName = 'text-indigo-600', as = 'h2', className = 'mb-4' }: CardTitleProps) {
  const Heading = as;
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Icon className={`h-5 w-5 ${iconClassName}`} aria-hidden />
      <Heading className="font-semibold text-slate-900 dark:text-white">{children}</Heading>
    </div>
  );
}

import type { ReactNode } from 'react';

/** Centered page title used by the public directory pages. */
export function PageHeading({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">{title}</h1>
      <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">{children}</p>
    </div>
  );
}

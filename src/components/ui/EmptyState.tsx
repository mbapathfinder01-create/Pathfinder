import type { ReactNode } from 'react';

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="col-span-full text-center py-16 text-slate-500">{children}</div>;
}

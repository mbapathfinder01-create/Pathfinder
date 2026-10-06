import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../../context/appState';
import { PageLoader } from '../ui/PageLoader';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, ready } = useApp();
  if (!ready) return <PageLoader />;
  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, ready } = useApp();
  if (!ready) return <PageLoader />;
  return user?.role === 'admin' ? <>{children}</> : <Navigate to="/login?admin=1" replace />;
}

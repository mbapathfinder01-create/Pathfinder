import { useCallback, useEffect, useState } from 'react';
import { useApp } from '../context/appState';
import type { Submission } from '../types';

type Status = 'loading' | 'ready' | 'error';

/** Loads all assessment submissions (admin only) with loading/error state and a manual refresh. */
export function useSubmissions() {
  const { listSubmissions, deleteAllSubmissions } = useApp();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [status, setStatus] = useState<Status>('loading');

  const refresh = useCallback(async () => {
    setStatus('loading');
    try {
      setSubmissions(await listSubmissions());
      setStatus('ready');
    } catch (err) {
      console.error('Loading submissions failed', err);
      setStatus('error');
    }
  }, [listSubmissions]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const clearAll = useCallback(async () => {
    await deleteAllSubmissions();
    await refresh();
  }, [deleteAllSubmissions, refresh]);

  return { submissions, status, refresh, clearAll };
}

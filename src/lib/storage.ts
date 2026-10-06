/**
 * Thin, failure-tolerant wrapper around localStorage. Keys match the original app
 * (mba_dark, mba_user, mba_profile, mba_done, mba_submissions) so data carries over.
 */
export const STORAGE_KEYS = {
  dark: 'mba_dark',
  user: 'mba_user',
  profile: 'mba_profile',
  done: 'mba_done',
  submissions: 'mba_submissions',
} as const;

export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJson(key: string, value: unknown): void {
  try {
    if (value === null || value === undefined) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full or blocked (private mode): the app keeps working in memory.
  }
}

export function readFlag(key: string): boolean {
  try {
    return localStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

export function writeFlag(key: string, value: boolean): void {
  try {
    localStorage.setItem(key, value ? '1' : '0');
  } catch {
    // ignore
  }
}

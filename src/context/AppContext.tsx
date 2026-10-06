import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { getBackend, isFirebaseConfigured, type Backend } from '../backend';
import { readFlag, STORAGE_KEYS, writeFlag } from '../lib/storage';
import type { StudentProfile, User } from '../types';
import { AppContext, type AppState } from './appState';

const clearedAnswers = (p: StudentProfile): StudentProfile => ({
  ...p,
  interests: {},
  swot: { S: {}, W: {}, O: {}, T: {} },
  skills: {},
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [backend, setBackend] = useState<Backend | null>(null);
  const [dark, setDark] = useState(() => readFlag(STORAGE_KEYS.dark));
  const [user, setUser] = useState<User | null>(null);
  const [authKnown, setAuthKnown] = useState(false);
  const [loadedFor, setLoadedFor] = useState<string | null>(null);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [assessmentDone, setAssessmentDone] = useState(false);

  // Theme is a per-device preference, so it stays in localStorage in every mode.
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    writeFlag(STORAGE_KEYS.dark, dark);
  }, [dark]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;
    void getBackend().then((b) => {
      if (cancelled) return;
      setBackend(b);
      unsubscribe = b.onAuthChange((u) => {
        setUser(u);
        setAuthKnown(true);
      });
    });
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  // Load the signed-in student's saved profile and progress.
  useEffect(() => {
    if (!backend || !authKnown) return;
    if (!user) {
      setProfile(null);
      setAssessmentDone(false);
      setLoadedFor(null);
      return;
    }
    let cancelled = false;
    backend
      .loadStudent(user.uid)
      .then((record) => {
        if (cancelled) return;
        setProfile(record?.profile ?? null);
        setAssessmentDone(record?.assessmentDone ?? false);
      })
      .catch((err) => {
        console.error('Could not load saved progress', err);
        if (!cancelled) {
          setProfile(null);
          setAssessmentDone(false);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadedFor(user.uid);
      });
    return () => {
      cancelled = true;
    };
  }, [backend, authKnown, user]);

  const ready = !!backend && authKnown && (!user || loadedFor === user.uid);

  const requireBackend = useCallback(() => {
    if (!backend) throw new Error('Still connecting — please try again in a moment.');
    return backend;
  }, [backend]);

  const requireUser = useCallback(() => {
    if (!user) throw new Error('Please sign in first.');
    return user;
  }, [user]);

  const toggleDark = useCallback(() => setDark((d) => !d), []);

  const signInWithGoogle = useCallback(() => requireBackend().signInWithGoogle(), [requireBackend]);
  const signInDemo = useCallback((u: Omit<User, 'uid'>) => requireBackend().signInDemo(u), [requireBackend]);
  const logout = useCallback(() => requireBackend().signOut(), [requireBackend]);

  const saveProfile = useCallback(
    async (p: StudentProfile) => {
      const u = requireUser();
      await requireBackend().saveStudent(u.uid, { profile: p, assessmentDone });
      setProfile(p);
    },
    [requireBackend, requireUser, assessmentDone],
  );

  const completeAssessment = useCallback(
    async (p: StudentProfile) => {
      const u = requireUser();
      await requireBackend().submitAssessment(u, p);
      setProfile(p);
      setAssessmentDone(true);
    },
    [requireBackend, requireUser],
  );

  const resetAssessment = useCallback(async () => {
    const u = requireUser();
    if (!profile) return;
    const cleared = clearedAnswers(profile);
    await requireBackend().saveStudent(u.uid, { profile: cleared, assessmentDone: false });
    setProfile(cleared);
    setAssessmentDone(false);
  }, [requireBackend, requireUser, profile]);

  const listSubmissions = useCallback(() => requireBackend().listSubmissions(), [requireBackend]);
  const deleteAllSubmissions = useCallback(() => requireBackend().deleteAllSubmissions(), [requireBackend]);

  const value = useMemo<AppState>(
    () => ({
      mode: backend?.mode ?? (isFirebaseConfigured ? 'firebase' : 'demo'),
      ready,
      dark,
      toggleDark,
      user,
      signInWithGoogle,
      signInDemo,
      logout,
      profile,
      assessmentDone,
      saveProfile,
      completeAssessment,
      resetAssessment,
      listSubmissions,
      deleteAllSubmissions,
    }),
    [
      backend,
      ready,
      dark,
      toggleDark,
      user,
      signInWithGoogle,
      signInDemo,
      logout,
      profile,
      assessmentDone,
      saveProfile,
      completeAssessment,
      resetAssessment,
      listSubmissions,
      deleteAllSubmissions,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

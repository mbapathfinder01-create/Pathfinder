import { readFlag, readJson, STORAGE_KEYS, writeFlag, writeJson } from '../lib/storage';
import type { StudentProfile, StudentRecord, Submission, User } from '../types';
import type { Backend } from './types';

const MAX_SUBMISSIONS = 200;

type LegacySubmission = Omit<Submission, 'id' | 'uid'> & Partial<Pick<Submission, 'id' | 'uid'>>;

/** Older saves (from the original app) lack id/uid; fill them in so the admin table has stable keys. */
function readSubmissions(): Submission[] {
  return readJson<LegacySubmission[]>(STORAGE_KEYS.submissions, []).map((s, i) => ({
    ...s,
    id: s.id ?? `${s.submittedAt}-${i}`,
    uid: s.uid ?? s.profile.email,
  }));
}

/**
 * Browser-only backend. Sign-in is not verified and data never leaves this browser.
 * Used automatically when no Firebase config is present.
 */
export function createDemoBackend(): Backend {
  const listeners = new Set<(user: User | null) => void>();
  const readUser = () => {
    const u = readJson<(Omit<User, 'uid'> & { uid?: string }) | null>(STORAGE_KEYS.user, null);
    return u ? { ...u, uid: u.uid ?? u.email } : null;
  };
  const emit = () => listeners.forEach((cb) => cb(readUser()));

  return {
    mode: 'demo',

    onAuthChange(callback) {
      listeners.add(callback);
      callback(readUser());
      return () => listeners.delete(callback);
    },

    async signInWithGoogle() {
      throw new Error('Google sign-in needs Firebase to be configured.');
    },

    async signInDemo(user) {
      writeJson(STORAGE_KEYS.user, { ...user, uid: user.email });
      emit();
    },

    async signOut() {
      writeJson(STORAGE_KEYS.user, null);
      writeJson(STORAGE_KEYS.profile, null);
      writeFlag(STORAGE_KEYS.done, false);
      emit();
    },

    async loadStudent() {
      const profile = readJson<StudentProfile | null>(STORAGE_KEYS.profile, null);
      return profile ? { profile, assessmentDone: readFlag(STORAGE_KEYS.done) } : null;
    },

    async saveStudent(_uid: string, record: StudentRecord) {
      writeJson(STORAGE_KEYS.profile, record.profile);
      writeFlag(STORAGE_KEYS.done, record.assessmentDone);
    },

    async submitAssessment(user, profile) {
      writeJson(STORAGE_KEYS.profile, profile);
      writeFlag(STORAGE_KEYS.done, true);
      const submittedAt = new Date().toISOString();
      const entry: Submission = { id: `${submittedAt}-${user.uid}`, uid: user.uid, profile, submittedAt };
      writeJson(STORAGE_KEYS.submissions, [entry, ...readSubmissions()].slice(0, MAX_SUBMISSIONS));
    },

    async listSubmissions() {
      return readSubmissions();
    },

    async deleteAllSubmissions() {
      writeJson(STORAGE_KEYS.submissions, []);
    },
  };
}

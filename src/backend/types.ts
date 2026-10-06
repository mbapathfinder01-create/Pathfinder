import type { StudentProfile, StudentRecord, Submission, User } from '../types';

export type BackendMode = 'firebase' | 'demo';

/**
 * Everything the app needs from auth + storage. Two implementations exist:
 * - firebaseBackend: Google sign-in (Firebase Auth) + Firestore, shared across devices
 * - demoBackend: no server; typed-in sign-in and browser localStorage (the original app's behaviour)
 */
export interface Backend {
  mode: BackendMode;

  /** Subscribes to sign-in state. Called once immediately (or as soon as known) and on every change. */
  onAuthChange(callback: (user: User | null) => void): () => void;
  /** Firebase mode: opens the Google sign-in popup. */
  signInWithGoogle(): Promise<void>;
  /** Demo mode only: signs in with whatever the user typed. */
  signInDemo(user: Omit<User, 'uid'>): Promise<void>;
  signOut(): Promise<void>;

  loadStudent(uid: string): Promise<StudentRecord | null>;
  saveStudent(uid: string, record: StudentRecord): Promise<void>;
  /** Stores a completed assessment. The student's record is updated in the same operation. */
  submitAssessment(user: User, profile: StudentProfile): Promise<void>;

  /** Admin only. Newest first. */
  listSubmissions(): Promise<Submission[]>;
  /** Admin only. */
  deleteAllSubmissions(): Promise<void>;
}

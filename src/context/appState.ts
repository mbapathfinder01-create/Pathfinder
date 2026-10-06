import { createContext, useContext } from 'react';
import type { BackendMode } from '../backend';
import type { StudentProfile, Submission, User } from '../types';

export interface AppState {
  /** 'firebase' = real Google sign-in + Firestore; 'demo' = browser-only, as in the original app. */
  mode: BackendMode;
  /** False until sign-in state and the student's saved data have been loaded. */
  ready: boolean;

  dark: boolean;
  toggleDark: () => void;

  user: User | null;
  signInWithGoogle: () => Promise<void>;
  signInDemo: (user: Omit<User, 'uid'>) => Promise<void>;
  logout: () => Promise<void>;

  profile: StudentProfile | null;
  assessmentDone: boolean;
  /** Saves the registration form (keeps any existing answers' completion state). */
  saveProfile: (profile: StudentProfile) => Promise<void>;
  /** Saves the finished assessment and records a submission for the admin dashboard. */
  completeAssessment: (profile: StudentProfile) => Promise<void>;
  /** Clears answers so the student can retake; registration details are kept. */
  resetAssessment: () => Promise<void>;

  /** Admin only. */
  listSubmissions: () => Promise<Submission[]>;
  /** Admin only. */
  deleteAllSubmissions: () => Promise<void>;
}

export const AppContext = createContext<AppState | null>(null);

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

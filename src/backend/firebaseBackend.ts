import { initializeApp } from 'firebase/app';
import {
  browserLocalPersistence,
  connectAuthEmulator,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type User as FirebaseUser,
} from 'firebase/auth';
import {
  collection,
  connectFirestoreEmulator,
  doc,
  getDoc,
  getDocs,
  initializeFirestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  writeBatch,
  type Timestamp,
} from 'firebase/firestore';
import type { StudentProfile, StudentRecord, Submission, User } from '../types';
import { firebaseConfig, useEmulators } from './config';
import type { Backend } from './types';

/**
 * Firestore layout (enforced by firestore.rules):
 *   admins/{email}          – exists ⇒ that Google account is an administrator (managed in the Firebase console)
 *   students/{uid}          – { profile, assessmentDone, name, email, updatedAt }   owner + admins
 *   submissions/{autoId}    – { uid, profile, submittedAt, createdAt }             owner creates, admins read/delete
 */
const MAX_ADMIN_ROWS = 500;
const BATCH_LIMIT = 450;

interface StudentDoc extends StudentRecord {
  name: string;
  email: string;
  updatedAt?: Timestamp;
}

interface SubmissionDoc {
  uid: string;
  profile: StudentProfile;
  submittedAt: string;
  createdAt?: Timestamp;
}

export function createFirebaseBackend(): Backend {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  // ignoreUndefinedProperties: never fail a save because an optional field is missing.
  const db = initializeFirestore(app, { ignoreUndefinedProperties: true });

  if (useEmulators) {
    connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    connectFirestoreEmulator(db, '127.0.0.1', 8080);
  }
  void setPersistence(auth, browserLocalPersistence);

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  async function isAdmin(email: string | null): Promise<boolean> {
    if (!email) return false;
    try {
      return (await getDoc(doc(db, 'admins', email.toLowerCase()))).exists();
    } catch {
      // Rules deny reading other people's admin docs; any failure simply means "not an admin".
      return false;
    }
  }

  async function toAppUser(u: FirebaseUser): Promise<User> {
    return {
      uid: u.uid,
      name: u.displayName || u.email?.split('@')[0] || 'Student',
      email: u.email ?? '',
      photoURL: u.photoURL,
      role: (await isAdmin(u.email)) ? 'admin' : 'student',
    };
  }

  return {
    mode: 'firebase',

    onAuthChange(callback) {
      return onAuthStateChanged(auth, (fbUser) => {
        if (!fbUser) return callback(null);
        void toAppUser(fbUser).then(callback);
      });
    },

    async signInWithGoogle() {
      try {
        await signInWithPopup(auth, provider);
      } catch (err) {
        // Some mobile browsers block popups; fall back to a full-page redirect.
        if ((err as { code?: string }).code === 'auth/popup-blocked') {
          await signInWithRedirect(auth, provider);
          return;
        }
        throw err;
      }
    },

    async signInDemo() {
      throw new Error('Demo sign-in is disabled when Firebase is configured.');
    },

    async signOut() {
      await signOut(auth);
    },

    async loadStudent(uid) {
      const snap = await getDoc(doc(db, 'students', uid));
      if (!snap.exists()) return null;
      const data = snap.data() as StudentDoc;
      return { profile: data.profile, assessmentDone: !!data.assessmentDone };
    },

    async saveStudent(uid, record) {
      await setDoc(doc(db, 'students', uid), studentDoc(record));
    },

    async submitAssessment(user, profile) {
      const batch = writeBatch(db);
      batch.set(doc(db, 'students', user.uid), studentDoc({ profile, assessmentDone: true }));
      const submission: SubmissionDoc = { uid: user.uid, profile, submittedAt: new Date().toISOString() };
      batch.set(doc(collection(db, 'submissions')), { ...submission, createdAt: serverTimestamp() });
      await batch.commit();
    },

    async listSubmissions() {
      const snap = await getDocs(query(collection(db, 'submissions'), orderBy('createdAt', 'desc'), limit(MAX_ADMIN_ROWS)));
      return snap.docs.map((d) => {
        const data = d.data() as SubmissionDoc;
        return { id: d.id, uid: data.uid, profile: data.profile, submittedAt: data.submittedAt } satisfies Submission;
      });
    },

    async deleteAllSubmissions() {
      const snap = await getDocs(collection(db, 'submissions'));
      for (let i = 0; i < snap.docs.length; i += BATCH_LIMIT) {
        const batch = writeBatch(db);
        snap.docs.slice(i, i + BATCH_LIMIT).forEach((d) => batch.delete(d.ref));
        await batch.commit();
      }
    },
  };

  function studentDoc(record: StudentRecord) {
    return {
      profile: record.profile,
      assessmentDone: record.assessmentDone,
      name: record.profile.name,
      email: record.profile.email,
      updatedAt: serverTimestamp(),
    };
  }
}

/**
 * Firebase web config, read from Vite env vars (see .env.example).
 * These values identify your Firebase project; they are not secrets. Access is controlled by
 * Firebase Auth and the Firestore security rules in firestore.rules.
 */
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/** Firebase is used only when the essential values are present; otherwise the app runs in demo mode. */
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId && firebaseConfig.appId,
);

/** Set VITE_FIREBASE_EMULATORS=true to point at the local Firebase emulators instead of the live project. */
export const useEmulators = import.meta.env.VITE_FIREBASE_EMULATORS === 'true';

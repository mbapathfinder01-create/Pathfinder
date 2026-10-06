import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../../context/appState';
import { Alert } from '../ui/Alert';

const FRIENDLY_ERRORS: Record<string, string> = {
  'auth/popup-closed-by-user': 'The Google sign-in window was closed before finishing. Please try again.',
  'auth/cancelled-popup-request': 'Another sign-in window is already open.',
  'auth/network-request-failed': 'No internet connection. Check your network and try again.',
  'auth/unauthorized-domain':
    "This website address isn't authorised for Google sign-in yet. The site owner must add it under Firebase → Authentication → Settings → Authorised domains.",
  'auth/operation-not-allowed': 'Google sign-in is not enabled for this project yet (Firebase → Authentication → Sign-in method).',
};

function GoogleLogo() {
  return (
    <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

/** Real Google sign-in through Firebase Authentication. Admin access is granted in Firestore, not here. */
export function GoogleSignIn({ adminHint }: { adminHint: boolean }) {
  const { signInWithGoogle } = useApp();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleClick = async () => {
    setBusy(true);
    setError('');
    try {
      await signInWithGoogle();
      // The login page redirects once the signed-in state arrives.
    } catch (err) {
      const code = (err as { code?: string }).code ?? '';
      console.error('Google sign-in failed', err);
      setError(FRIENDLY_ERRORS[code] ?? 'Google sign-in failed. Please try again.');
      setBusy(false);
    }
  };

  return (
    <div className="mt-6">
      {error && <Alert tone="error" className="mb-4">{error}</Alert>}
      {adminHint && (
        <Alert tone="success" className="mb-4">
          Administrators sign in with the Google account that has been granted admin access.
        </Alert>
      )}
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold text-slate-700 dark:text-slate-200 transition disabled:opacity-60"
      >
        {busy ? <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden /> : <GoogleLogo />}
        {busy ? 'Waiting for Google…' : 'Sign in with Google'}
      </button>
      <p className="text-xs text-center text-slate-400 mt-4">
        New here? You'll be guided to create your profile next. Your progress is saved to your account, so you can continue on any device.
      </p>
    </div>
  );
}

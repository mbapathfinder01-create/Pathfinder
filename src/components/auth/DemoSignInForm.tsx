import { Lock, LogIn, Shield } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useApp } from '../../context/appState';
import { ADMIN_CREDENTIALS } from '../../data/constants';
import type { UserRole } from '../../types';
import { Alert } from '../ui/Alert';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Browser-only sign-in used when Firebase isn't configured (the original app's behaviour).
 * Nothing is verified: it just records the typed name and email in this browser.
 */
export function DemoSignInForm({ startAsAdmin }: { startAsAdmin: boolean }) {
  const { signInDemo } = useApp();
  const [role, setRole] = useState<UserRole>(startAsAdmin ? 'admin' : 'student');
  const [email, setEmail] = useState(startAsAdmin ? ADMIN_CREDENTIALS.email : '');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const switchRole = (next: UserRole) => {
    setRole(next);
    setError('');
    setEmail(next === 'admin' ? ADMIN_CREDENTIALS.email : '');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (role === 'student') {
      if (!name.trim()) return setError('Please enter your full name.');
      if (!EMAIL_PATTERN.test(email.trim())) return setError('Please enter a valid email address.');
    } else {
      if (email.trim().toLowerCase() !== ADMIN_CREDENTIALS.email) {
        return setError(`Invalid admin email. Use: ${ADMIN_CREDENTIALS.email}`);
      }
      if (password !== ADMIN_CREDENTIALS.password) return setError(`Invalid password. Hint: ${ADMIN_CREDENTIALS.password}`);
      if (accessCode !== ADMIN_CREDENTIALS.accessCode) {
        return setError(`Invalid access code. Hint: ${ADMIN_CREDENTIALS.accessCode}`);
      }
    }
    setBusy(true);
    await signInDemo(
      role === 'student'
        ? { name: name.trim(), email: email.trim(), role: 'student' }
        : { name: 'Administrator', email: ADMIN_CREDENTIALS.email, role: 'admin' },
    );
    // The login page redirects once the signed-in state arrives.
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="mt-6 grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl" role="tablist" aria-label="Account type">
        {(['student', 'admin'] as const).map((r) => (
          <button
            key={r}
            type="button"
            role="tab"
            aria-selected={role === r}
            onClick={() => switchRole(r)}
            className={`py-2 rounded-lg text-sm font-semibold transition flex items-center justify-center gap-1 ${
              role === r ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            {r === 'admin' && <Shield className="h-3.5 w-3.5" aria-hidden />}
            {r === 'student' ? 'Student' : 'Admin'}
          </button>
        ))}
      </div>

      {error && <Alert tone="error" className="mt-4">{error}</Alert>}
      {busy && <Alert tone="success" className="mt-4">Signing you in…</Alert>}

      <div className="space-y-3 mt-5">
        {role === 'student' ? (
          <>
            <div>
              <label className="label" htmlFor="login-name">
                Full Name
              </label>
              <input
                id="login-name"
                className="input"
                placeholder="e.g. Priya Sharma"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="login-email">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                className="input"
                placeholder="you@gmail.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </>
        ) : (
          <>
            <div className="rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 p-3 text-xs text-indigo-700 dark:text-indigo-300">
              <div className="font-bold mb-0.5">🔐 Demo Admin Credentials</div>
              <div>
                Email: <code className="font-mono">{ADMIN_CREDENTIALS.email}</code>
              </div>
              <div>
                Password: <code className="font-mono">{ADMIN_CREDENTIALS.password}</code>
              </div>
              <div>
                Access Code: <code className="font-mono">{ADMIN_CREDENTIALS.accessCode}</code>
              </div>
            </div>
            <div>
              <label className="label" htmlFor="admin-email">
                Admin Email
              </label>
              <input
                id="admin-email"
                type="email"
                className="input font-mono text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="label" htmlFor="admin-password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden />
                <input
                  id="admin-password"
                  type="password"
                  className="input pl-9"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="admin-code">
                Access Code
              </label>
              <input
                id="admin-code"
                className="input font-mono text-sm"
                placeholder="Enter admin access code"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
              />
            </div>
          </>
        )}
      </div>

      <button
        type="submit"
        disabled={busy}
        className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold text-slate-700 dark:text-slate-200 transition disabled:opacity-60"
      >
        <LogIn className="h-4 w-4 text-indigo-600" aria-hidden />
        {role === 'student' ? 'Continue' : 'Sign in as Administrator'}
      </button>
      <p className="text-xs text-center text-slate-400 mt-4">
        Demo mode: sign-in isn't verified and data stays in this browser only.
      </p>
    </form>
  );
}

import { GraduationCap } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DemoSignInForm } from '../components/auth/DemoSignInForm';
import { GoogleSignIn } from '../components/auth/GoogleSignIn';
import { PageLoader } from '../components/ui/PageLoader';
import { useApp } from '../context/appState';

export default function Login() {
  const { mode, ready, user, profile, assessmentDone } = useApp();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const adminRequested = params.get('admin') === '1';

  // Once signed in (and saved progress is loaded), send the user to the right place.
  useEffect(() => {
    if (!ready || !user) return;
    if (user.role === 'admin') navigate('/admin', { replace: true });
    else if (!profile) navigate('/register', { replace: true });
    else navigate(assessmentDone ? '/dashboard' : '/assessment', { replace: true });
  }, [ready, user, profile, assessmentDone, navigate]);

  if (!ready) return <PageLoader />;

  return (
    <div className="min-h-[calc(100vh-4rem)] grid-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card p-8 fade-in">
          <div className="flex justify-center mb-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
              <GraduationCap className="h-7 w-7 text-white" aria-hidden />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-center text-slate-900 dark:text-white">Welcome to MBA Pathfinder</h1>
          <p className="text-sm text-center text-slate-500 dark:text-slate-400 mt-1">Sign in to continue your journey</p>
          {mode === 'firebase' ? <GoogleSignIn adminHint={adminRequested} /> : <DemoSignInForm startAsAdmin={adminRequested} />}
        </div>
      </div>
    </div>
  );
}

import { Award, BookOpen, CircleCheck, MapPin, RotateCcw, Target, TrendingUp, type LucideIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SkillRadarChart } from '../components/charts/SkillRadarChart';
import { DownloadReportButton } from '../components/results/DownloadReportButton';
import { Alert } from '../components/ui/Alert';
import { CardTitle } from '../components/ui/CardTitle';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useApp } from '../context/appState';
import { skillRadar, summarizeSwot } from '../engine/insights';
import { calculateRecommendations } from '../engine/recommend';

export default function Dashboard() {
  const { user, profile, assessmentDone, resetAssessment } = useApp();
  const navigate = useNavigate();
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetError, setResetError] = useState('');

  const recs = useMemo(() => (profile && assessmentDone ? calculateRecommendations(profile) : []), [profile, assessmentDone]);
  const radar = useMemo(() => (profile ? skillRadar(profile) : []), [profile]);
  const swot = useMemo(() => (profile ? summarizeSwot(profile) : null), [profile]);
  const journey = profile ? (assessmentDone ? 100 : 50) : 0;
  const top = recs[0];

  const retake = async () => {
    setConfirmReset(false);
    setResetError('');
    try {
      await resetAssessment();
      navigate('/assessment');
    } catch (err) {
      console.error('Reset failed', err);
      setResetError("Couldn't reset your assessment. Check your internet connection and try again.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Student Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">Welcome back, {user?.name}. Track your career journey here.</p>
        </div>
        {assessmentDone && profile && (
          <div className="flex gap-2 flex-wrap items-start">
            <DownloadReportButton profile={profile} label="Download PDF" className="px-4 py-2 rounded-xl text-sm" />
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="btn-ghost px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5"
            >
              <RotateCcw className="h-4 w-4" aria-hidden /> Retake
            </button>
          </div>
        )}
      </div>
      {resetError && (
        <Alert tone="error" className="mb-6">
          {resetError}
        </Alert>
      )}

      <section className="card p-5 mb-6" aria-labelledby="journey-heading">
        <div className="flex items-center justify-between mb-2">
          <h2 id="journey-heading" className="text-sm font-semibold text-slate-900 dark:text-white">
            Your Journey Progress
          </h2>
          <div className="text-sm font-bold text-indigo-600">{journey}%</div>
        </div>
        <ProgressBar value={journey} label="Journey progress" />
        <ol className="flex items-center justify-between mt-3 text-xs gap-2">
          <JourneyStep done={!!profile} label="Profile created" />
          <JourneyStep done={assessmentDone} label="Assessment" />
          <JourneyStep done={assessmentDone} label="Recommendation" />
        </ol>
      </section>

      <nav className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" aria-label="Quick links">
        <QuickLink to="/register" icon={Target} title="My Profile" subtitle="Edit registration" />
        <QuickLink to="/assessment" icon={CircleCheck} title="Assessment" subtitle={assessmentDone ? 'Completed ✓' : 'Not started'} />
        <QuickLink to="/specializations" icon={BookOpen} title="Knowledge Center" subtitle="9 specializations" />
        <QuickLink to="/opportunities" icon={MapPin} title="Local Jobs" subtitle="5 cities" />
      </nav>

      {!profile ? (
        <CallToAction
          title="Let's set up your profile"
          text="Start by filling out your registration form."
          to="/register"
          label="Start Registration"
        />
      ) : !assessmentDone || !top ? (
        <CallToAction
          title="Ready for your assessment?"
          text="8-minute SWOT + interest + skill assessment in 3 languages."
          to="/assessment"
          label="Begin Assessment"
        />
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Stat label="Background" value={profile.background} sub={`Graduation: ${profile.graduation}%`} />
            <Stat label="Preferred City" value={profile.preferredCity} sub={profile.workExperience} />
            <Stat
              label="SWOT Net"
              value={swot ? `${swot.net > 0 ? '+' : ''}${swot.net}` : '—'}
              valueClass={swot && swot.net >= 0 ? 'text-emerald-600' : 'text-rose-600'}
              sub={swot ? `S:${swot.S} W:${swot.W} O:${swot.O} T:${swot.T}` : ''}
            />
            <Stat label="Placement Readiness" value={`${top.placementReadiness}%`} valueClass="text-indigo-600" sub={`for ${top.spec.shortName}`} />
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <section className="card p-6">
              <CardTitle icon={TrendingUp} as="h3">
                Your Top Recommendations
              </CardTitle>
              <ol className="space-y-3">
                {recs.slice(0, 3).map((r, i) => (
                  <li key={r.key} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-sm">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-900 dark:text-white text-sm truncate">{r.spec.name}</div>
                      <ProgressBar value={r.confidence} label={`${r.spec.name} match`} gradient={r.spec.color} className="h-1.5 mt-1" />
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white">{r.confidence}%</div>
                  </li>
                ))}
              </ol>
              <Link to="/recommendation" className="mt-4 inline-flex text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                View full recommendation →
              </Link>
            </section>
            <section className="card p-6">
              <CardTitle icon={Target} as="h3">
                Skill Radar
              </CardTitle>
              <SkillRadarChart data={radar} height={260} fontSize={10} />
            </section>
          </div>

          <section className="card p-6">
            <CardTitle icon={Award} as="h3">
              Next Steps
            </CardTitle>
            <div className="grid sm:grid-cols-3 gap-3 text-sm">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-lg">
                <div className="font-semibold text-indigo-700 dark:text-indigo-300 mb-1">🎯 Short-term</div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Start the top 2 suggested certifications for {top.spec.shortName}: {top.suggestedCerts.slice(0, 2).join(', ')}.
                </p>
              </div>
              <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-lg">
                <div className="font-semibold text-purple-700 dark:text-purple-300 mb-1">📈 Medium-term</div>
                <p className="text-xs text-slate-600 dark:text-slate-300">Do 1 live project or internship in your target role.</p>
              </div>
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg">
                <div className="font-semibold text-emerald-700 dark:text-emerald-300 mb-1">🚀 Long-term</div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Target placements in {profile.preferredCity} at companies in your PDF report.
                </p>
              </div>
            </div>
          </section>
        </>
      )}

      <ConfirmDialog
        open={confirmReset}
        title="Retake the assessment?"
        message="Your answers will be cleared so you can start again. Your registration info will be kept."
        confirmLabel="Reset & retake"
        tone="danger"
        onConfirm={() => void retake()}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}

function JourneyStep({ done, label }: { done: boolean; label: string }) {
  return (
    <li className={`flex items-center gap-1 ${done ? 'text-emerald-600 font-semibold' : 'text-slate-500'}`}>
      <CircleCheck className="h-3 w-3" aria-hidden /> {label}
      <span className="sr-only">{done ? '(done)' : '(pending)'}</span>
    </li>
  );
}

function QuickLink({ to, icon: Icon, title, subtitle }: { to: string; icon: LucideIcon; title: string; subtitle: string }) {
  return (
    <Link to={to} className="card p-5 hover:shadow-md transition">
      <Icon className="h-6 w-6 text-indigo-600 mb-2" aria-hidden />
      <div className="font-semibold text-slate-900 dark:text-white">{title}</div>
      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{subtitle}</div>
    </Link>
  );
}

function Stat({ label, value, sub, valueClass = 'text-slate-900 dark:text-white' }: { label: string; value: string; sub: string; valueClass?: string }) {
  return (
    <div className="card p-5">
      <div className="text-xs text-slate-500 dark:text-slate-400 uppercase font-semibold">{label}</div>
      <div className={`text-xl font-bold mt-1 ${valueClass}`}>{value}</div>
      <div className="text-xs text-slate-500 mt-1">{sub}</div>
    </div>
  );
}

function CallToAction({ title, text, to, label }: { title: string; text: string; to: string; label: string }) {
  return (
    <div className="card p-10 text-center">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
      <p className="text-slate-500 mt-2">{text}</p>
      <Link to={to} className="btn-primary inline-flex mt-5 px-5 py-2.5 rounded-xl font-semibold">
        {label}
      </Link>
    </div>
  );
}

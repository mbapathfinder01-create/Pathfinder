import {
  ArrowRight,
  BookOpen,
  ChartColumn,
  CircleCheck,
  FileText,
  MapPin,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/appState';
import { SPECIALIZATIONS } from '../data/specializations';

const STATS = [
  { label: 'Specializations', value: '9' },
  { label: 'Career Paths', value: '35+' },
  { label: 'Companies', value: '85+' },
  { label: 'Cities', value: '5' },
];

const FEATURES: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Target, title: 'Smart Assessment', desc: 'SWOT, aptitude & interest analysis powered by weighted scoring.' },
  { icon: ChartColumn, title: 'Skill Radar', desc: 'Visualize your strengths across 10 key MBA competencies.' },
  { icon: Sparkles, title: 'AI Recommendations', desc: 'Top 3 specializations with confidence scores and reasoning.' },
  {
    icon: MapPin,
    title: 'Local Opportunities',
    desc: 'Real employer database across Nashik, Pune, Mumbai, Bengaluru & Delhi NCR.',
  },
  { icon: BookOpen, title: 'Knowledge Center', desc: 'Deep-dive on every specialization — careers, salary, scope.' },
  { icon: FileText, title: 'PDF Reports', desc: 'Download a career roadmap report you can share with mentors.' },
];

const STEPS: { step: string; title: string; desc: string; icon: LucideIcon }[] = [
  { step: '01', title: 'Sign up & profile', desc: 'Create your student profile with academics and background.', icon: Users },
  { step: '02', title: 'Take assessments', desc: 'Complete interest, SWOT, and skill questionnaires.', icon: CircleCheck },
  { step: '03', title: 'Get recommendations', desc: 'Our weighted engine ranks the top 3 specializations.', icon: TrendingUp },
  { step: '04', title: 'Download report', desc: 'Get a PDF roadmap with careers, certifications & jobs.', icon: FileText },
];

export default function Home() {
  const { user } = useApp();
  const isAdmin = user?.role === 'admin';
  const primaryTo = !user ? '/login' : isAdmin ? '/admin' : '/assessment';
  const primaryLabel = !user ? 'Get Started' : isAdmin ? 'Go to Admin Panel' : 'Start Assessment';

  return (
    <div className="fade-in">
      <section className="grid-bg">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-6">
            <Sparkles className="h-3.5 w-3.5" aria-hidden /> For MBA-I Students
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
            Find the <span className="gradient-text">right MBA specialization</span>
            <br /> for your career.
          </h1>
          <p className="mt-6 text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            A data-driven career counseling platform that blends your background, interests, SWOT, and skills to recommend
            the best-fit specialization and jobs in <strong>Nashik, Pune, Mumbai, Bengaluru &amp; Delhi NCR</strong>.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
            <Link to={primaryTo} className="btn-primary px-6 py-3 rounded-xl font-semibold flex items-center gap-2">
              {primaryLabel} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link to="/specializations" className="btn-ghost px-6 py-3 rounded-xl font-semibold">
              Explore Specializations
            </Link>
          </div>
          <dl className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {STATS.map((s) => (
              <div key={s.label} className="card p-5 flex flex-col-reverse">
                <dt className="text-sm text-slate-500 dark:text-slate-400 mt-1">{s.label}</dt>
                <dd className="text-3xl font-bold gradient-text">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-20" aria-labelledby="features-heading">
        <div className="text-center mb-12">
          <h2 id="features-heading" className="text-3xl font-bold text-slate-900 dark:text-white">
            Everything you need to decide
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">One platform. Psychometrics + market data + AI.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="card p-6 hover:shadow-xl transition-shadow">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mb-4">
                <f.icon className="h-5 w-5 text-white" aria-hidden />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white">{f.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1.5">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16" aria-labelledby="specs-heading">
        <div className="text-center mb-10">
          <h2 id="specs-heading" className="text-3xl font-bold text-slate-900 dark:text-white">
            The {SPECIALIZATIONS.length} MBA Specializations
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-400">Explore each and understand which fits you best.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-9 gap-3">
          {SPECIALIZATIONS.map((s) => (
            <Link
              key={s.key}
              to="/specializations"
              className="card p-5 text-center hover:-translate-y-1 transition-transform"
            >
              <div
                className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center text-3xl mx-auto shadow-lg`}
                aria-hidden
              >
                {s.icon}
              </div>
              <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">{s.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{s.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      <section
        className="bg-gradient-to-br from-slate-50 to-indigo-50/40 dark:from-slate-900 dark:to-indigo-950/40 py-20"
        aria-labelledby="how-heading"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 id="how-heading" className="text-3xl font-bold text-slate-900 dark:text-white">
              How it works
            </h2>
          </div>
          <ol className="grid md:grid-cols-4 gap-6">
            {STEPS.map((s) => (
              <li key={s.step} className="card p-6">
                <div className="text-5xl font-bold text-indigo-200 dark:text-indigo-900" aria-hidden>
                  {s.step}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <s.icon className="h-4 w-4 text-indigo-600" aria-hidden />
                  <h3 className="font-semibold text-slate-900 dark:text-white">{s.title}</h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{s.desc}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="card p-10 bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-none">
          <h2 className="text-3xl font-bold">Ready to discover your path?</h2>
          <p className="mt-3 text-indigo-100">It takes about 8 minutes. You'll get a full report you can share with your mentor.</p>
          <Link
            to={primaryTo}
            className="inline-flex items-center mt-6 px-6 py-3 rounded-xl bg-white text-indigo-700 font-semibold hover:bg-indigo-50 transition"
          >
            {!user ? 'Sign in to begin' : isAdmin ? 'Go to Admin Panel' : 'Start Assessment'}
            <ArrowRight className="h-4 w-4 ml-2" aria-hidden />
          </Link>
        </div>
      </section>
    </div>
  );
}

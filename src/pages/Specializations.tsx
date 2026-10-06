import { Award, BadgeCheck, Briefcase, Building2, Compass, DollarSign, Target, TrendingUp, type LucideIcon } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/appState';
import { careersFor } from '../data/careers';
import { SPECIALIZATIONS } from '../data/specializations';
import type { Specialization, SpecializationKey } from '../types';

export default function Specializations() {
  const [expanded, setExpanded] = useState<SpecializationKey | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">Specialization Knowledge Center</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Explore all <strong>{SPECIALIZATIONS.length} MBA specializations</strong> — what you'll learn, where you'll work, what you'll
          earn, and which certifications to pursue.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {SPECIALIZATIONS.map((spec) => (
          <SpecializationCard
            key={spec.key}
            spec={spec}
            expanded={expanded === spec.key}
            onToggle={() => setExpanded(expanded === spec.key ? null : spec.key)}
          />
        ))}
      </div>
    </div>
  );
}

function SpecializationCard({ spec, expanded, onToggle }: { spec: Specialization; expanded: boolean; onToggle: () => void }) {
  const { user, assessmentDone } = useApp();
  const roles = careersFor(spec.key);
  const detailsId = `spec-details-${spec.key}`;

  return (
    <article className="card overflow-hidden fade-in">
      <div className={`h-32 bg-gradient-to-br ${spec.color} p-5 text-white relative overflow-hidden`}>
        <div className="absolute -right-6 -bottom-6 text-8xl opacity-20" aria-hidden>
          {spec.icon}
        </div>
        <div className="relative z-10">
          <div className="text-4xl" aria-hidden>
            {spec.icon}
          </div>
          <h2 className="mt-2 text-xl font-bold">{spec.name}</h2>
          <p className="text-sm text-white/90">{spec.tagline}</p>
        </div>
      </div>
      <div className="p-5 space-y-4">
        <p className="text-sm text-slate-600 dark:text-slate-300">{spec.overview}</p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <Fact icon={TrendingUp} label="Demand" value={spec.industryDemand} />
          <Fact icon={DollarSign} label="Salary Growth" value={spec.salaryGrowth} />
        </div>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={expanded}
          aria-controls={detailsId}
          className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          {expanded ? 'Hide details ▴' : 'Show full details ▾'}
        </button>
        {expanded && (
          <div id={detailsId} className="space-y-4 pt-3 border-t border-slate-200 dark:border-slate-800 fade-in">
            <ChipGroup icon={Target} title="Key Subjects" items={spec.coreSubjects} />
            <ChipGroup icon={BadgeCheck} title="Required Skills" items={spec.requiredSkills} />
            <ChipGroup icon={Briefcase} title="Career Opportunities" items={spec.careerOpportunities} />
            <DetailBlock icon={Compass} title="Future Scope">
              <p className="text-sm text-slate-600 dark:text-slate-400">{spec.futureScope}</p>
            </DetailBlock>
            <ChipGroup icon={Building2} title="Top Recruiters" items={spec.topRecruiters.slice(0, 8)} />
            <ChipGroup icon={Award} title="Recommended Certifications" items={spec.certifications} />
            <DetailBlock icon={Briefcase} title={`Job Roles in ${spec.shortName}`}>
              <ul className="grid sm:grid-cols-2 gap-2">
                {roles.map((r) => (
                  <li key={r.title} className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg p-2.5">
                    <div className="font-semibold text-slate-900 dark:text-white">{r.title}</div>
                    <div className="text-slate-500 dark:text-slate-400">
                      {r.avgSalary} • {r.growth} growth
                    </div>
                  </li>
                ))}
              </ul>
            </DetailBlock>
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-100 dark:border-indigo-900 rounded-xl p-4">
              <div className="text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-1">🎯 Is this specialization suitable for you?</div>
              <p className="text-xs text-slate-700 dark:text-slate-300">
                {user?.role === 'student' && assessmentDone ? (
                  <>
                    See your personalized match score for {spec.shortName} on your{' '}
                    <Link to="/recommendation" className="font-semibold text-indigo-600 dark:text-indigo-400 underline">
                      recommendation page
                    </Link>
                    .
                  </>
                ) : (
                  <>
                    <Link
                      to={user ? '/assessment' : '/login'}
                      className="font-semibold text-indigo-600 dark:text-indigo-400 underline"
                    >
                      {user ? 'Complete the assessment' : 'Sign in and complete the assessment'}
                    </Link>{' '}
                    to see your personalized match score for {spec.shortName}.
                  </>
                )}
              </p>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

function Fact({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" aria-hidden />
      <div>
        <div className="font-semibold text-slate-900 dark:text-white text-xs">{label}</div>
        <div className="text-slate-600 dark:text-slate-400">{value}</div>
      </div>
    </div>
  );
}

function DetailBlock({ icon: Icon, title, children }: { icon: LucideIcon; title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="font-semibold text-sm text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
        <Icon className="h-4 w-4 text-indigo-600" aria-hidden /> {title}
      </h3>
      {children}
    </div>
  );
}

function ChipGroup({ icon, title, items }: { icon: LucideIcon; title: string; items: string[] }) {
  return (
    <DetailBlock icon={icon} title={title}>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span key={item} className="chip">
            {item}
          </span>
        ))}
      </div>
    </DetailBlock>
  );
}

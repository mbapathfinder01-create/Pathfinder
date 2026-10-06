import { Award, Briefcase, CircleCheck, GraduationCap, Mail, MapPin, Phone, TrendingUp, X, type LucideIcon } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import { careersFor } from '../../data/careers';
import { COMPANIES } from '../../data/companies';
import type { Recommendation, StudentProfile, SwotSummary, RadarPoint } from '../../types';
import { SkillRadarChart } from '../charts/SkillRadarChart';
import { DownloadReportButton } from '../results/DownloadReportButton';
import { ProgressBar } from '../ui/ProgressBar';

export interface StudentRow {
  id: string;
  profile: StudentProfile;
  submittedAt: string;
  recs: Recommendation[];
  swot: SwotSummary;
  radar: RadarPoint[];
}

const SWOT_TILES = [
  { key: 'S', label: 'Strengths', box: 'bg-emerald-50 dark:bg-emerald-950/40', value: 'text-emerald-700 dark:text-emerald-300', text: 'text-emerald-600 dark:text-emerald-400' },
  { key: 'W', label: 'Weaknesses', box: 'bg-rose-50 dark:bg-rose-950/40', value: 'text-rose-700 dark:text-rose-300', text: 'text-rose-600 dark:text-rose-400' },
  { key: 'O', label: 'Opportunities', box: 'bg-sky-50 dark:bg-sky-950/40', value: 'text-sky-700 dark:text-sky-300', text: 'text-sky-600 dark:text-sky-400' },
  { key: 'T', label: 'Threats', box: 'bg-amber-50 dark:bg-amber-950/40', value: 'text-amber-700 dark:text-amber-300', text: 'text-amber-600 dark:text-amber-400' },
] as const;

export function StudentReportModal({ row, onClose }: { row: StudentRow; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const { profile: p, recs, swot, radar } = row;
  const top = recs[0];
  const companies = COMPANIES.filter((c) => c.departments.includes(top.key) && (!p.preferredCity || c.city === p.preferredCity)).slice(0, 6);
  const careers = careersFor(top.key).slice(0, 6);

  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);

  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      aria-labelledby="student-report-title"
      className="bg-transparent p-0 m-0 sm:m-auto w-full max-w-none sm:max-w-4xl h-full sm:h-auto max-h-none sm:max-h-[calc(100vh-2rem)] backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <div className="bg-white dark:bg-slate-900 min-h-full sm:min-h-0 sm:rounded-2xl shadow-2xl fade-in text-left">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 p-5 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 sm:rounded-t-2xl">
          <div className="min-w-0">
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Student Report</div>
            <h2 id="student-report-title" className="text-xl font-bold text-slate-900 dark:text-white truncate">
              {p.name}
            </h2>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <DownloadReportButton profile={p} label="PDF" className="px-3 py-1.5 rounded-lg text-sm" />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close report"
              className="h-9 w-9 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-5">
          <div className="grid lg:grid-cols-2 gap-4">
            <section className="card p-4 space-y-2 text-sm">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Personal &amp; Academic</h3>
              <InfoLine icon={Mail}>{p.email}</InfoLine>
              {p.mobile && <InfoLine icon={Phone}>{p.mobile}</InfoLine>}
              <InfoLine icon={MapPin}>{p.city || '—'}</InfoLine>
              <InfoLine icon={GraduationCap}>
                {p.background} • Grad: {p.graduation}%
              </InfoLine>
              <div className="text-xs text-slate-500">
                SSC: {p.ssc}% • HSC: {p.hsc}% • {p.workExperience}
                {p.yearsOfExperience ? ` (${p.yearsOfExperience} yrs)` : ''}
              </div>
              <InfoLine icon={Briefcase}>Preferred: {p.preferredCity || '—'}</InfoLine>
              {p.careerGoal && (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-semibold">Goal:</span> {p.careerGoal}
                </div>
              )}
              <div className="text-xs text-slate-400 pt-1">Submitted: {new Date(row.submittedAt).toLocaleString()}</div>
            </section>
            <section className="card p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-indigo-600" aria-hidden /> SWOT Profile
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                {SWOT_TILES.map((t) => (
                  <div key={t.key} className={`p-2 rounded-lg ${t.box}`}>
                    <div className={`font-bold text-lg ${t.value}`}>{swot[t.key]}</div>
                    <div className={`font-semibold ${t.text}`}>{t.label}</div>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-xs text-slate-500">
                Net balance:{' '}
                <span className={`font-bold ${swot.net >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {swot.net > 0 ? '+' : ''}
                  {swot.net}
                </span>
              </div>
            </section>
          </div>

          <section>
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Top 3 Recommended Specializations</h3>
            <div className="grid md:grid-cols-3 gap-3">
              {recs.slice(0, 3).map((r, i) => (
                <div key={r.key} className={`card p-4 overflow-hidden ${i === 0 ? 'ring-2 ring-indigo-500' : ''}`}>
                  <div className={`h-2 bg-gradient-to-r ${r.spec.color} rounded-t`} />
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-xs font-bold text-slate-500">#{i + 1}</div>
                    <div className="text-lg font-bold text-indigo-600">{r.confidence}%</div>
                  </div>
                  <div className="text-2xl mt-1" aria-hidden>
                    {r.spec.icon}
                  </div>
                  <div className="font-semibold text-slate-900 dark:text-white mt-1">{r.spec.name}</div>
                  <ProgressBar value={r.confidence} label="Match" gradient={r.spec.color} className="h-1.5 mt-2" />
                  <dl className="mt-2 space-y-1 text-[11px]">
                    {(
                      [
                        ['Academic', r.breakdown.academic],
                        ['Interest', r.breakdown.interest],
                        ['SWOT', r.breakdown.swot],
                        ['Skills', r.breakdown.skills],
                        ['Goal', r.breakdown.goal],
                      ] as const
                    ).map(([label, v]) => (
                      <div key={label} className="flex justify-between text-slate-500">
                        <dt>{label}</dt>
                        <dd className="font-bold text-slate-700 dark:text-slate-300">{Math.round(v * 100)}%</dd>
                      </div>
                    ))}
                  </dl>
                  {i === 0 && (
                    <ul className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                      {r.reasoning.slice(0, 2).map((reason) => (
                        <li key={reason} className="text-[11px] text-slate-600 dark:text-slate-400 flex gap-1">
                          <CircleCheck className="h-3 w-3 text-emerald-500 flex-shrink-0 mt-0.5" aria-hidden />
                          <span>{reason}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>

          <div className="grid lg:grid-cols-2 gap-4">
            <section className="card p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Skill Radar</h3>
              <SkillRadarChart data={radar} height={260} fontSize={10} />
            </section>
            <section className="card p-4">
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
                <Award className="h-4 w-4 text-indigo-600" aria-hidden /> Careers for {top.spec.name}
              </h3>
              <ul className="space-y-1.5 text-sm">
                {careers.map((c) => (
                  <li key={c.title} className="flex items-center justify-between gap-2 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                    <span className="font-medium text-slate-800 dark:text-slate-200 text-xs">{c.title}</span>
                    <span className="text-[10px] text-slate-500 whitespace-nowrap">{c.avgSalary}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Suggested certifications</div>
                <div className="flex flex-wrap gap-1">
                  {top.suggestedCerts.map((c) => (
                    <span key={c} className="chip text-[10px]">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {companies.length > 0 && (
            <section>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-indigo-600" aria-hidden /> Matched Placements
                {p.preferredCity && <span className="chip ml-2">{p.preferredCity}</span>}
              </h3>
              <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {companies.map((c) => (
                  <li key={c.name + c.city} className="p-2.5 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <div className="font-semibold text-xs text-slate-900 dark:text-white">{c.name}</div>
                    <div className="text-[10px] text-slate-500">
                      {c.industry} • {c.city}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </dialog>
  );
}

function InfoLine({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 min-w-0">
      <Icon className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" aria-hidden />
      <span className="truncate">{children}</span>
    </div>
  );
}

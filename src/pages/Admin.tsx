import {
  BookOpen,
  ChartColumn,
  Download,
  Eye,
  RefreshCcw,
  RotateCw,
  Target,
  TriangleAlert,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { Alert } from '../components/ui/Alert';
import { useMemo, useState } from 'react';
import { StudentReportModal, type StudentRow } from '../components/admin/StudentReportModal';
import { SERIES_COLORS } from '../components/charts/chartTheme';
import { ColumnChart } from '../components/charts/ColumnChart';
import { DistributionPie } from '../components/charts/DistributionPie';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { SearchInput } from '../components/ui/SearchInput';
import { useApp } from '../context/appState';
import { useSubmissions } from '../hooks/useSubmissions';
import { SPECIALIZATIONS } from '../data/specializations';
import { skillRadar, summarizeSwot } from '../engine/insights';
import { calculateRecommendations } from '../engine/recommend';
import { downloadCsv } from '../lib/csv';
import type { SpecializationKey } from '../types';

const countBy = (values: string[]) => {
  const counts = new Map<string, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
};

export default function Admin() {
  const { mode } = useApp();
  const { submissions, status, refresh, clearAll } = useSubmissions();
  const [query, setQuery] = useState('');
  const [background, setBackground] = useState('All');
  const [spec, setSpec] = useState<SpecializationKey | 'All'>('All');
  const [selected, setSelected] = useState<StudentRow | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [clearError, setClearError] = useState('');

  // Submissions arrive newest first; keep each student's latest so retakes don't double-count.
  const latest = useMemo(() => {
    const seen = new Set<string>();
    return submissions.filter((s) => !seen.has(s.uid) && !!seen.add(s.uid));
  }, [submissions]);

  const rows = useMemo<StudentRow[]>(
    () =>
      latest.map((s) => ({
        id: s.id,
        profile: s.profile,
        submittedAt: s.submittedAt,
        recs: calculateRecommendations(s.profile),
        swot: summarizeSwot(s.profile),
        radar: skillRadar(s.profile),
      })),
    [latest],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      const p = r.profile;
      const matchesQuery = !q || [p.name, p.email, p.background].some((v) => (v || '').toLowerCase().includes(q));
      return matchesQuery && (background === 'All' || p.background === background) && (spec === 'All' || r.recs[0].key === spec);
    });
  }, [rows, query, background, spec]);

  const bySpec = useMemo(() => countBy(rows.map((r) => r.recs[0].spec.name)), [rows]);
  const byBackground = useMemo(() => countBy(rows.map((r) => r.profile.background || 'Unspecified')), [rows]);
  const backgrounds = useMemo(() => [...new Set(rows.map((r) => r.profile.background).filter(Boolean))], [rows]);
  const avgConfidence = rows.length ? Math.round(rows.reduce((sum, r) => sum + r.recs[0].confidence, 0) / rows.length) : 0;

  const exportCsv = () =>
    downloadCsv(
      `mba_pathfinder_students_${Date.now()}.csv`,
      [
        'Name',
        'Email',
        'Gender',
        'City',
        'Background',
        'SSC',
        'HSC',
        'Graduation',
        'Experience',
        'Preferred City',
        'Top Specialization',
        'Confidence %',
        'Strengths',
        'Weaknesses',
        'Opportunities',
        'Threats',
        'Submitted At',
      ],
      filtered.map(({ profile: p, recs, swot, submittedAt }) => [
        p.name,
        p.email,
        p.gender,
        p.city,
        p.background,
        p.ssc,
        p.hsc,
        p.graduation,
        p.workExperience,
        p.preferredCity,
        recs[0].spec.name,
        recs[0].confidence,
        swot.S,
        swot.W,
        swot.O,
        swot.T,
        new Date(submittedAt).toLocaleString(),
      ]),
    );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">View all student records, recommendations &amp; full reports.</p>
          {mode === 'demo' && (
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
              Demo mode: only submissions made in this browser are shown. Configure Firebase to see every student.
            </p>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => void refresh()}
            disabled={status === 'loading'}
            className="btn-ghost px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 disabled:opacity-50"
          >
            <RotateCw className={`h-4 w-4 ${status === 'loading' ? 'animate-spin' : ''}`} aria-hidden /> Refresh
          </button>
          <button
            type="button"
            onClick={exportCsv}
            disabled={filtered.length === 0}
            className="btn-ghost px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="h-4 w-4" aria-hidden /> Export CSV
          </button>
          <button
            type="button"
            onClick={() => setConfirmClear(true)}
            disabled={submissions.length === 0}
            className="btn-ghost px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 text-rose-600! disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCcw className="h-4 w-4" aria-hidden /> Clear All
          </button>
        </div>
      </div>

      {status === 'error' && (
        <Alert tone="error" className="mb-6">
          Couldn't load submissions. Check your connection, and that this Google account has admin access, then press Refresh.
        </Alert>
      )}
      {clearError && (
        <Alert tone="error" className="mb-6">
          {clearError}
        </Alert>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard
          icon={Users}
          label="Total Students"
          value={status === 'loading' ? '…' : String(rows.length)}
          sub={submissions.length > rows.length ? `${submissions.length} submissions incl. retakes` : undefined}
        />
        <KpiCard icon={Target} label="Avg Confidence" value={`${avgConfidence}%`} />
        <KpiCard
          icon={ChartColumn}
          label="Top Specialization"
          value={bySpec[0]?.name ?? '—'}
          sub={`${bySpec[0]?.value ?? 0} students`}
          small
        />
        <KpiCard icon={BookOpen} label="Unique Backgrounds" value={String(backgrounds.length)} />
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <section className="card p-6">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-3">Specialization Preference</h2>
          {bySpec.length ? (
            <ColumnChart
              data={bySpec}
              colors={SERIES_COLORS}
              height={260}
              integerTicks
              ariaLabel={`Top specialization counts: ${bySpec.map((d) => `${d.name} ${d.value}`).join(', ')}`}
            />
          ) : (
            <div className="text-sm text-slate-500 text-center py-12">No data yet.</div>
          )}
        </section>
        <section className="card p-6">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-3">Background Distribution</h2>
          {byBackground.length ? (
            <DistributionPie data={byBackground} />
          ) : (
            <div className="text-sm text-slate-500 text-center py-12">No data yet.</div>
          )}
        </section>
      </div>

      <section className="card p-5" aria-labelledby="students-heading">
        <h2 id="students-heading" className="sr-only">
          Students
        </h2>
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <div className="flex-1 min-w-[200px]">
            <SearchInput value={query} onChange={setQuery} placeholder="Search name / email / background" label="Search students" />
          </div>
          <select
            className="input max-w-[180px]"
            value={background}
            onChange={(e) => setBackground(e.target.value)}
            aria-label="Filter by background"
          >
            <option value="All">All</option>
            {backgrounds.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
          <select
            className="input max-w-[220px]"
            value={spec}
            onChange={(e) => setSpec(e.target.value as SpecializationKey | 'All')}
            aria-label="Filter by recommendation"
          >
            <option value="All">All Recommendations</option>
            {SPECIALIZATIONS.map((s) => (
              <option key={s.key} value={s.key}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="text-left text-xs text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                {['Name', 'Email', 'Background', 'Grad %', 'City', 'Top Spec', 'Confidence', 'Actions'].map((h) => (
                  <th key={h} scope="col" className="py-2 px-2 font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {status === 'loading' && submissions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-500">
                    Loading submissions…
                  </td>
                </tr>
              ) : submissions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-500">
                    No students yet. Students who complete the assessment will appear here.
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300"
                  >
                    <td className="py-2 px-2 font-medium text-slate-900 dark:text-white">{row.profile.name}</td>
                    <td className="py-2 px-2 text-slate-600 dark:text-slate-400">{row.profile.email}</td>
                    <td className="py-2 px-2">{row.profile.background}</td>
                    <td className="py-2 px-2">{row.profile.graduation}%</td>
                    <td className="py-2 px-2">
                      <span className="chip">{row.profile.preferredCity || '—'}</span>
                    </td>
                    <td className="py-2 px-2">
                      <span className="chip">{row.recs[0].spec.name}</span>
                    </td>
                    <td className="py-2 px-2 font-semibold text-indigo-600 dark:text-indigo-400">{row.recs[0].confidence}%</td>
                    <td className="py-2 px-2">
                      <button
                        type="button"
                        onClick={() => setSelected(row)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 px-2 py-1 rounded-md hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                      >
                        <Eye className="h-3.5 w-3.5" aria-hidden /> View Report
                        <span className="sr-only"> for {row.profile.name}</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && submissions.length > 0 && (
          <div className="text-center py-6">
            <TriangleAlert className="h-8 w-8 text-amber-500 mx-auto mb-2" aria-hidden />
            <p className="text-sm text-slate-500">No results match the current filters.</p>
          </div>
        )}
      </section>

      {selected && <StudentReportModal row={selected} onClose={() => setSelected(null)} />}
      <ConfirmDialog
        open={confirmClear}
        title="Delete all submissions?"
        message={
          mode === 'firebase'
            ? 'Every student submission in the database will be permanently deleted. Students keep their own saved results. This cannot be undone.'
            : 'All student submissions stored in this browser will be permanently removed. This cannot be undone.'
        }
        confirmLabel="Delete all"
        tone="danger"
        onConfirm={() => {
          setConfirmClear(false);
          setClearError('');
          clearAll().catch((err) => {
            console.error('Deleting submissions failed', err);
            setClearError("Couldn't delete the submissions. Please try again.");
          });
        }}
        onCancel={() => setConfirmClear(false)}
      />
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, sub, small = false }: { icon: LucideIcon; label: string; value: string; sub?: string; small?: boolean }) {
  return (
    <div className="card p-5 min-w-0">
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase">
        <Icon className="h-4 w-4 flex-shrink-0" aria-hidden /> {label}
      </div>
      <div className={`font-bold text-slate-900 dark:text-white mt-2 truncate ${small ? 'text-lg' : 'text-3xl'}`} title={value}>
        {value}
      </div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  );
}

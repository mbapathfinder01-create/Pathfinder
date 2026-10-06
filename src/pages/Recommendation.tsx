import { Award, Building2, Briefcase, Compass, MapPin, Target, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SWOT_COLORS } from '../components/charts/chartTheme';
import { ColumnChart } from '../components/charts/ColumnChart';
import { SkillRadarChart } from '../components/charts/SkillRadarChart';
import { AssessmentRequired } from '../components/results/AssessmentRequired';
import { CareerRoadmap } from '../components/results/CareerRoadmap';
import { DownloadReportButton } from '../components/results/DownloadReportButton';
import { MatchCard } from '../components/results/MatchCard';
import { PlacementReadinessBanner } from '../components/results/PlacementReadinessBanner';
import { StrengthsCard } from '../components/results/StrengthsCard';
import { WeaknessPlanCard } from '../components/results/WeaknessPlanCard';
import { CardTitle } from '../components/ui/CardTitle';
import { useApp } from '../context/appState';
import { careersFor } from '../data/careers';
import { COMPANIES } from '../data/companies';
import { skillRadar, strengthInsights, summarizeSwot, weaknessPlans } from '../engine/insights';
import { calculateRecommendations } from '../engine/recommend';

export default function Recommendation() {
  const { profile, assessmentDone } = useApp();
  const ready = !!profile && assessmentDone;

  const results = useMemo(() => {
    if (!profile || !assessmentDone) return null;
    return {
      recs: calculateRecommendations(profile),
      radar: skillRadar(profile),
      swot: summarizeSwot(profile),
      weaknesses: weaknessPlans(profile),
      strengths: strengthInsights(profile),
    };
  }, [profile, assessmentDone]);

  if (!ready || !results || results.recs.length === 0) return <AssessmentRequired />;

  const { recs, radar, swot, weaknesses, strengths } = results;
  const top = recs[0];
  const companies = COMPANIES.filter(
    (c) => c.departments.includes(top.key) && (!profile.preferredCity || c.city === profile.preferredCity),
  ).slice(0, 8);
  const careers = careersFor(top.key).slice(0, 8);
  const firstName = profile.name.trim().split(/\s+/)[0] || 'there';

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
        <div>
          <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Your Career Roadmap</div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-1">Hello, {firstName} 👋</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Based on your academics, interests, SWOT, skills, and location preference — here are your top 3 specializations.
          </p>
        </div>
        <DownloadReportButton profile={profile} />
      </div>

      <PlacementReadinessBanner score={top.placementReadiness} />

      <section aria-label="Top 3 specializations" className="grid md:grid-cols-3 gap-4 mb-8">
        {recs.slice(0, 3).map((rec, i) => (
          <MatchCard key={rec.key} rec={rec} rank={i} />
        ))}
      </section>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <section className="card p-6">
          <CardTitle icon={Target}>Your Skill Radar</CardTitle>
          <SkillRadarChart data={radar} />
        </section>
        <section className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <CardTitle icon={TrendingUp} className="">
              SWOT Profile
            </CardTitle>
            <span
              className={`chip ${
                swot.net >= 0
                  ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900'
                  : 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-900'
              }`}
            >
              Net: {swot.net > 0 ? '+' : ''}
              {swot.net}
            </span>
          </div>
          <ColumnChart
            ariaLabel={`SWOT scores: Strengths ${swot.S}, Weaknesses ${swot.W}, Opportunities ${swot.O}, Threats ${swot.T} out of 100`}
            data={[
              { name: 'Strengths', value: swot.S },
              { name: 'Weaknesses', value: swot.W },
              { name: 'Opportunities', value: swot.O },
              { name: 'Threats', value: swot.T },
            ]}
            colors={SWOT_COLORS}
            domain={[0, 100]}
          />
        </section>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <StrengthsCard strengths={strengths} />
        <WeaknessPlanCard plans={weaknesses} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <section className="card p-5">
          <CardTitle icon={Building2} as="h3" className="mb-3">
            Recommended Industries
          </CardTitle>
          <div className="flex flex-wrap gap-1.5">
            {top.recommendedIndustries.map((i) => (
              <span key={i} className="chip">
                {i}
              </span>
            ))}
          </div>
        </section>
        <section className="card p-5">
          <CardTitle icon={Briefcase} as="h3" className="mb-3">
            Suggested Roles
          </CardTitle>
          <div className="flex flex-wrap gap-1.5">
            {top.suitableCareers.map((r) => (
              <span
                key={r}
                className="chip bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900"
              >
                {r}
              </span>
            ))}
          </div>
        </section>
        <section className="card p-5">
          <CardTitle icon={Award} as="h3" className="mb-3">
            Certifications
          </CardTitle>
          <div className="flex flex-wrap gap-1.5">
            {top.suggestedCerts.map((c) => (
              <span
                key={c}
                className="chip bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900"
              >
                {c}
              </span>
            ))}
          </div>
          {top.skillGaps.length > 0 && (
            <>
              <div className="mt-3 text-xs font-bold text-amber-700 dark:text-amber-400">Skill Gaps:</div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {top.skillGaps.map((g) => (
                  <span
                    key={g}
                    className="chip bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </>
          )}
        </section>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <section className="card p-6">
          <CardTitle icon={Compass}>Careers in {top.spec.shortName}</CardTitle>
          <ul className="grid sm:grid-cols-2 gap-2">
            {careers.map((c) => (
              <li key={c.title} className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                <div className="font-semibold text-sm text-slate-900 dark:text-white">{c.title}</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {c.avgSalary} • {c.growth} growth
                </div>
                <div className="text-[10px] text-slate-400 mt-1">📍 {c.cities.slice(0, 3).join(' • ')}</div>
                <div className="text-[10px] text-slate-400">🏭 {c.industries.slice(0, 2).join(' • ')}</div>
              </li>
            ))}
          </ul>
        </section>
        <section className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-indigo-600" aria-hidden />
            <h2 className="font-semibold text-slate-900 dark:text-white">Placement Opportunities</h2>
            {profile.preferredCity && <span className="chip ml-1">{profile.preferredCity}</span>}
          </div>
          {companies.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">
              No matches for {profile.preferredCity}.{' '}
              <Link to="/opportunities" className="text-indigo-600 underline">
                view all locations
              </Link>
            </p>
          ) : (
            <ul className="grid sm:grid-cols-2 gap-2 max-h-[480px] overflow-y-auto pr-1">
              {companies.map((c) => (
                <li key={c.name + c.city} className="p-3 border border-slate-200 dark:border-slate-700 rounded-lg">
                  <div className="font-semibold text-sm text-slate-900 dark:text-white">{c.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {c.industry} • {c.city}
                  </div>
                </li>
              ))}
            </ul>
          )}
          {companies.length > 0 && companies.length < 4 && (
            <p className="text-xs text-slate-500 mt-2">
              💡 Try{' '}
              <Link to="/opportunities" className="text-indigo-600 underline">
                viewing all locations
              </Link>{' '}
              for more opportunities.
            </p>
          )}
        </section>
      </div>

      <CareerRoadmap top={top} preferredCity={profile.preferredCity} />
    </div>
  );
}

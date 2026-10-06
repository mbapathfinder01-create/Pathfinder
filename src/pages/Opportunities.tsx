import { Building2, FunnelX, MapPin } from 'lucide-react';
import { useMemo, useState } from 'react';
import { EmptyState } from '../components/ui/EmptyState';
import { FilterPill, FilterRow } from '../components/ui/FilterPill';
import { PageHeading } from '../components/ui/PageHeading';
import { SearchInput } from '../components/ui/SearchInput';
import { useApp } from '../context/appState';
import { COMPANIES } from '../data/companies';
import { CITIES, INDUSTRIES } from '../data/constants';
import { SPECIALIZATIONS } from '../data/specializations';
import type { City, SpecializationKey } from '../types';

const CITY_COUNTS = CITIES.map((city) => ({ city, count: COMPANIES.filter((c) => c.city === city).length }));

export default function Opportunities() {
  const { profile } = useApp();
  const [city, setCity] = useState<City | 'All'>('All');
  const [industry, setIndustry] = useState('All');
  const [spec, setSpec] = useState<SpecializationKey | 'All'>('All');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return COMPANIES.filter(
      (c) =>
        (city === 'All' || c.city === city) &&
        (industry === 'All' || c.industry === industry) &&
        (spec === 'All' || c.departments.includes(spec)) &&
        (!q || c.name.toLowerCase().includes(q)),
    );
  }, [city, industry, spec, query]);

  const hasFilters = city !== 'All' || industry !== 'All' || spec !== 'All' || query !== '';
  const clearFilters = () => {
    setCity('All');
    setIndustry('All');
    setSpec('All');
    setQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <PageHeading title="Local Industry Opportunities">
        Employer database across <strong>Nashik, Pune, Mumbai, Bengaluru &amp; Delhi NCR</strong> — {COMPANIES.length}+ companies
        mapped to specializations.
      </PageHeading>

      {profile?.preferredCity && city !== profile.preferredCity && (
        <div className="card p-4 mb-5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/40 dark:to-purple-950/40 border-indigo-100 dark:border-indigo-900">
          <div className="text-sm text-slate-700 dark:text-slate-300">
            📍 Based on your preferred city <strong>{profile.preferredCity}</strong>, here are matching employers.
            <button
              type="button"
              onClick={() => setCity(profile.preferredCity as City)}
              className="ml-2 text-indigo-600 dark:text-indigo-400 font-semibold underline"
            >
              Apply filter →
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 mb-6">
        {CITY_COUNTS.map(({ city: c, count }) => (
          <button
            key={c}
            type="button"
            onClick={() => setCity(city === c ? 'All' : c)}
            aria-pressed={city === c}
            className={`card p-3 sm:p-4 text-center transition hover:shadow-md ${city === c ? 'ring-2 ring-indigo-500' : ''}`}
          >
            <div className="flex items-center justify-center gap-1 text-slate-500 dark:text-slate-400 text-[10px] sm:text-xs font-semibold">
              <MapPin className="h-3 w-3 flex-shrink-0" aria-hidden /> <span className="truncate">{c}</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">{count}</div>
            <div className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400">companies</div>
          </button>
        ))}
      </div>

      <div className="card p-4 mb-5 space-y-3">
        <SearchInput value={query} onChange={setQuery} placeholder="Search companies..." label="Search companies" />
        <FilterRow label="City">
          <FilterPill active={city === 'All'} onClick={() => setCity('All')}>
            All
          </FilterPill>
          {CITIES.map((c) => (
            <FilterPill key={c} active={city === c} onClick={() => setCity(c)}>
              {c}
            </FilterPill>
          ))}
        </FilterRow>
        <FilterRow label="Specialization">
          <FilterPill active={spec === 'All'} onClick={() => setSpec('All')}>
            All
          </FilterPill>
          {SPECIALIZATIONS.map((s) => (
            <FilterPill key={s.key} active={spec === s.key} onClick={() => setSpec(s.key)}>
              <span aria-hidden>{s.icon}</span> {s.shortName}
            </FilterPill>
          ))}
        </FilterRow>
        <div className="flex flex-wrap gap-2 items-center">
          <label htmlFor="industry-filter" className="text-xs font-semibold text-slate-500 mr-1">
            Industry:
          </label>
          <select id="industry-filter" className="input max-w-xs" value={industry} onChange={(e) => setIndustry(e.target.value)}>
            <option value="All">All Industries</option>
            {INDUSTRIES.map((i) => (
              <option key={i}>{i}</option>
            ))}
          </select>
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 ml-2 hover:underline"
            >
              <FunnelX className="h-3.5 w-3.5" aria-hidden /> Clear filters
            </button>
          )}
        </div>
      </div>

      <div className="text-sm text-slate-500 mb-3 flex items-center gap-2" aria-live="polite">
        <Building2 className="h-4 w-4" aria-hidden /> {filtered.length} companies found
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((company) => (
          <article key={company.name + company.city} className="card p-5 fade-in hover:shadow-lg transition">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white">{company.name}</h2>
                <div className="text-xs text-slate-500 mt-0.5">{company.industry}</div>
              </div>
              <span className="chip bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-900 whitespace-nowrap">
                {company.city}
              </span>
            </div>
            <div className="flex flex-wrap gap-1 mt-3" aria-label="Hiring for">
              {company.departments.map((d) => {
                const s = SPECIALIZATIONS.find((x) => x.key === d);
                return (
                  <span
                    key={d}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-bold bg-gradient-to-br ${s?.color ?? 'from-slate-500 to-slate-600'} text-white`}
                  >
                    {s?.shortName ?? d}
                  </span>
                );
              })}
            </div>
          </article>
        ))}
        {filtered.length === 0 && <EmptyState>No companies match these filters.</EmptyState>}
      </div>
    </div>
  );
}

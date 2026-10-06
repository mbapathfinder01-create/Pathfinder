import { Briefcase, DollarSign, MapPin, TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import { EmptyState } from '../components/ui/EmptyState';
import { FilterPill, FilterRow } from '../components/ui/FilterPill';
import { PageHeading } from '../components/ui/PageHeading';
import { SearchInput } from '../components/ui/SearchInput';
import { CAREERS } from '../data/careers';
import { CITIES } from '../data/constants';
import { getSpecialization, SPECIALIZATIONS } from '../data/specializations';
import type { City, SpecializationKey } from '../types';

export default function Careers() {
  const [spec, setSpec] = useState<SpecializationKey | 'All'>('All');
  const [city, setCity] = useState<City | 'All'>('All');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CAREERS.filter(
      (c) =>
        (spec === 'All' || c.specialization === spec) &&
        (city === 'All' || c.cities.includes(city)) &&
        (!q || c.title.toLowerCase().includes(q) || c.skills.some((s) => s.toLowerCase().includes(q))),
    );
  }, [spec, city, query]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <PageHeading title="Career Database">
        Browse {CAREERS.length}+ career roles across {SPECIALIZATIONS.length} specializations — complete with salary, cities, industries,
        and growth outlook.
      </PageHeading>

      <div className="card p-4 mb-6 space-y-3">
        <SearchInput value={query} onChange={setQuery} placeholder="Search roles or skills..." label="Search roles or skills" />
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
        <FilterRow label="City">
          <FilterPill active={city === 'All'} onClick={() => setCity('All')}>
            All Cities
          </FilterPill>
          {CITIES.map((c) => (
            <FilterPill key={c} active={city === c} onClick={() => setCity(c)}>
              {c}
            </FilterPill>
          ))}
        </FilterRow>
      </div>

      <div className="text-sm text-slate-500 mb-3" aria-live="polite">
        {filtered.length} careers found
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((career) => {
          const s = getSpecialization(career.specialization);
          return (
            <article key={career.title} className="card p-5 fade-in hover:shadow-lg transition">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-gradient-to-br ${s.color} text-white`}>
                    {s.shortName}
                  </span>
                  <h2 className="mt-2 text-lg font-semibold text-slate-900 dark:text-white">{career.title}</h2>
                </div>
                <Briefcase className="h-5 w-5 text-slate-400 flex-shrink-0" aria-hidden />
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{career.description}</p>
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <DollarSign className="h-3.5 w-3.5" aria-hidden /> {career.avgSalary}
                </div>
                <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold">
                  <TrendingUp className="h-3.5 w-3.5" aria-hidden /> {career.growth} growth
                </div>
              </div>
              <div className="text-[11px] text-slate-500 mb-1 flex items-center gap-1">
                <MapPin className="h-3 w-3" aria-hidden /> Cities:
              </div>
              <div className="flex flex-wrap gap-1 mb-2">
                {career.cities.map((c) => (
                  <span key={c} className="chip text-[10px]">
                    {c}
                  </span>
                ))}
              </div>
              <div className="text-[11px] text-slate-500 mb-1">Industries:</div>
              <div className="flex flex-wrap gap-1 mb-2">
                {career.industries.slice(0, 3).map((i) => (
                  <span key={i} className="chip text-[10px]">
                    {i}
                  </span>
                ))}
              </div>
              <div className="text-[11px] text-slate-500 mb-1">Entry level:</div>
              <div className="text-xs text-slate-700 dark:text-slate-300 mb-2">{career.entryLevel}</div>
              <div className="text-[11px] text-slate-500 mb-1">Career path:</div>
              <div className="text-xs text-slate-700 dark:text-slate-300 mb-3">{career.careerPath}</div>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="text-[11px] text-slate-500 mb-1">Required skills:</div>
                <div className="flex flex-wrap gap-1">
                  {career.skills.map((sk) => (
                    <span key={sk} className="chip text-[10px]">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
        {filtered.length === 0 && <EmptyState>No careers match your filters.</EmptyState>}
      </div>
    </div>
  );
}

import { Globe } from 'lucide-react';
import { LANG_NAMES } from '../../data/assessment';
import type { Lang } from '../../types';

const LANGS: Lang[] = ['en', 'hi', 'mr'];

export function LanguageToggle({ lang, onChange }: { lang: Lang; onChange: (lang: Lang) => void }) {
  return (
    <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg" role="group" aria-label="Language">
      <Globe className="h-4 w-4 text-slate-500 ml-1.5" aria-hidden />
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => onChange(l)}
          aria-pressed={lang === l}
          lang={l}
          className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
            lang === l
              ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
              : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          {LANG_NAMES[l]}
        </button>
      ))}
    </div>
  );
}

import type { TrilingualText } from '../../types';

/** A statement shown in English with Hindi and Marathi translations underneath. */
export function TrilingualQuestion({ text, id }: { text: TrilingualText; id?: string }) {
  return (
    <div className="space-y-1" id={id}>
      <div className="text-sm text-slate-800 dark:text-slate-200 leading-snug font-medium">{text.en}</div>
      <div className="text-[12px] text-indigo-600 dark:text-indigo-400 leading-snug" lang="hi">
        <span className="font-semibold">हिन्दी:</span> {text.hi}
      </div>
      <div className="text-[12px] text-purple-600 dark:text-purple-400 leading-snug" lang="mr">
        <span className="font-semibold">मराठी:</span> {text.mr}
      </div>
    </div>
  );
}

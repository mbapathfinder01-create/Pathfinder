import { ArrowLeft, ArrowRight, Check, CircleHelp, LoaderCircle } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { LanguageToggle } from '../components/assessment/LanguageToggle';
import { RatingScale } from '../components/assessment/RatingScale';
import { StepIndicator } from '../components/assessment/StepIndicator';
import { TrilingualQuestion } from '../components/assessment/TrilingualQuestion';
import { Alert } from '../components/ui/Alert';
import { ProgressBar } from '../components/ui/ProgressBar';
import { useApp } from '../context/appState';
import {
  INTEREST_QUESTIONS,
  INTRO_COPY,
  SECTION_HINTS,
  SECTIONS,
  SKILL_DIMENSIONS,
  SWOT_LABELS,
  SWOT_ORDER,
  SWOT_QUESTIONS,
  UI_COPY,
} from '../data/assessment';
import { sectionProgress, unansweredIds } from '../lib/assessmentProgress';
import type { InterestId, Lang, Rating, SkillId, StudentProfile, SwotQuadrant } from '../types';

const SWOT_HEADING_COLOR: Record<SwotQuadrant, string> = {
  S: 'text-emerald-600',
  W: 'text-rose-600',
  O: 'text-sky-600',
  T: 'text-amber-600',
};

const INCOMPLETE_MSG: Record<Lang, (n: number) => string> = {
  en: (n) => `Please answer the ${n} remaining question${n === 1 ? '' : 's'} highlighted below.`,
  hi: (n) => `कृपया नीचे चिह्नित शेष ${n} प्रश्नों के उत्तर दें।`,
  mr: (n) => `कृपया खाली चिन्हांकित उर्वरित ${n} प्रश्नांची उत्तरे द्या.`,
};

const SUBMIT_ERROR: Record<Lang, string> = {
  en: "Couldn't save your answers. Check your internet connection and try again — your answers are still here.",
  hi: 'आपके उत्तर सहेजे नहीं जा सके। इंटरनेट कनेक्शन जाँचें और फिर से प्रयास करें — आपके उत्तर सुरक्षित हैं।',
  mr: 'तुमची उत्तरे जतन करता आली नाहीत. इंटरनेट कनेक्शन तपासा आणि पुन्हा प्रयत्न करा — तुमची उत्तरे येथेच आहेत.',
};

export default function Assessment() {
  const { profile, completeAssessment } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [lang, setLang] = useState<Lang>('en');
  const [form, setForm] = useState<StudentProfile | null>(profile);
  const [showMissing, setShowMissing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    topRef.current?.scrollIntoView({ block: 'start' });
    setShowMissing(false);
  }, [step]);

  // The profile form (step 1 of 2) must be completed first.
  if (!form) return <Navigate to="/register" replace />;

  const progress = sectionProgress(step, form);
  const missing = unansweredIds(step, form);
  const complete = missing.length === 0;
  const isLast = step === SECTIONS.length - 1;
  const ui = UI_COPY[lang];
  const intro = INTRO_COPY[lang];
  const isMissing = (id: string) => showMissing && missing.includes(id);

  const setInterest = (id: InterestId, v: Rating) => setForm((f) => f && { ...f, interests: { ...f.interests, [id]: v } });
  const setSwot = (quad: SwotQuadrant, id: string, v: Rating) =>
    setForm((f) => f && { ...f, swot: { ...f.swot, [quad]: { ...f.swot[quad], [id]: v } } });
  const setSkill = (id: SkillId, v: Rating) => setForm((f) => f && { ...f, skills: { ...f.skills, [id]: v } });

  const handleNext = async () => {
    if (!complete) {
      setShowMissing(true);
      const el = document.getElementById(missing[0]);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el?.querySelector<HTMLButtonElement>('[role="radio"]')?.focus({ preventScroll: true });
      return;
    }
    if (!isLast) {
      setStep((s) => s + 1);
      return;
    }
    setSubmitting(true);
    setSubmitError('');
    try {
      await completeAssessment(form);
      navigate('/recommendation');
    } catch (err) {
      console.error('Submitting assessment failed', err);
      setSubmitError(SUBMIT_ERROR[lang]);
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 scroll-mt-20" ref={topRef}>
      <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
        <div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Step 2 of 2</div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{intro.title}</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">{intro.desc}</p>
        </div>
        <LanguageToggle lang={lang} onChange={setLang} />
      </div>

      <div className="flex items-start gap-2 p-3 mb-5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 rounded-xl text-xs text-indigo-800 dark:text-indigo-300">
        <CircleHelp className="h-4 w-4 flex-shrink-0 mt-0.5" aria-hidden />
        <div>
          <strong>💡 Tip:</strong> {intro.tip}
          <br />
          <span className="opacity-80">{intro.rate}</span>
        </div>
      </div>

      <div className="card p-4 mb-6">
        <StepIndicator current={step} lang={lang} />
        <div className="mt-4">
          <div className="flex justify-between text-xs text-slate-500 mb-1.5">
            <span>{ui.progress}</span>
            <span>{progress}%</span>
          </div>
          <ProgressBar value={progress} label={`${SECTIONS[step].label.en} progress`} />
        </div>
      </div>

      <div className="card p-6 sm:p-8 space-y-5 fade-in" key={step}>
        <h2 className="font-semibold text-slate-900 dark:text-white">{ui[SECTIONS[step].id]}</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">{SECTION_HINTS[SECTIONS[step].id][lang]}</p>

        {step === 0 &&
          INTEREST_QUESTIONS.map((q) => (
            <div
              key={q.id}
              id={`q-interest-${q.id}`}
              className="border-b border-slate-100 dark:border-slate-800 pb-5 last:border-0 scroll-mt-24"
            >
              <TrilingualQuestion text={q} />
              <RatingScale
                value={form.interests[q.id] ?? 0}
                onChange={(v) => setInterest(q.id, v)}
                lang={lang}
                label={q.en}
                invalid={isMissing(`q-interest-${q.id}`)}
              />
            </div>
          ))}

        {step === 1 &&
          SWOT_ORDER.map((quad) => (
            <div key={quad} className="space-y-3">
              <h3 className={`text-sm font-bold uppercase tracking-wider ${SWOT_HEADING_COLOR[quad]}`}>{SWOT_LABELS[quad][lang]}</h3>
              {SWOT_QUESTIONS[quad].map((q) => (
                <div
                  key={q.id}
                  id={`q-swot-${q.id}`}
                  className="pl-3 border-l-2 border-slate-200 dark:border-slate-700 scroll-mt-24"
                >
                  <TrilingualQuestion text={q} />
                  <RatingScale
                    value={form.swot[quad][q.id] ?? 0}
                    onChange={(v) => setSwot(quad, q.id, v)}
                    lang={lang}
                    label={q.en}
                    invalid={isMissing(`q-swot-${q.id}`)}
                  />
                </div>
              ))}
            </div>
          ))}

        {step === 2 &&
          SKILL_DIMENSIONS.map((dim) => (
            <div
              key={dim.id}
              id={`q-skill-${dim.id}`}
              className="border-b border-slate-100 dark:border-slate-800 pb-5 last:border-0 scroll-mt-24"
            >
              <div className="text-sm font-semibold text-slate-900 dark:text-white mb-1.5">
                {dim.name[lang]}
                {lang !== 'en' && <span className="text-xs text-slate-400 font-normal ml-2">/ {dim.name.en}</span>}
              </div>
              <div className="space-y-1 mb-1">
                {dim.questions.map((q) => (
                  <div key={q.en} className="ml-1">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">{q.en}</div>
                    <div className="text-[10px] text-indigo-500 ml-1" lang="hi">
                      हि: {q.hi}
                    </div>
                    <div className="text-[10px] text-purple-500 ml-1 mb-1" lang="mr">
                      मरा: {q.mr}
                    </div>
                  </div>
                ))}
              </div>
              <RatingScale
                value={form.skills[dim.id] ?? 0}
                onChange={(v) => setSkill(dim.id, v)}
                lang={lang}
                label={dim.name.en}
                invalid={isMissing(`q-skill-${dim.id}`)}
              />
            </div>
          ))}
      </div>

      {showMissing && !complete && (
        <Alert tone="error" className="mt-4">
          {INCOMPLETE_MSG[lang](missing.length)}
        </Alert>
      )}
      {submitError && (
        <Alert tone="error" className="mt-4">
          {submitError}
        </Alert>
      )}

      <div className="flex justify-between mt-6 gap-3">
        <button
          type="button"
          disabled={step === 0 || submitting}
          onClick={() => setStep((s) => s - 1)}
          className="btn-ghost px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden /> {ui.prev}
        </button>
        <button
          type="button"
          onClick={() => void handleNext()}
          aria-disabled={!complete}
          disabled={submitting}
          className={`btn-primary px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 ${complete ? '' : 'opacity-55'}`}
        >
          {submitting ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" aria-hidden /> {ui.generate}…
            </>
          ) : isLast ? (
            <>
              <Check className="h-4 w-4" aria-hidden /> {ui.generate}
            </>
          ) : (
            <>
              {ui.next} <ArrowRight className="h-4 w-4" aria-hidden />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

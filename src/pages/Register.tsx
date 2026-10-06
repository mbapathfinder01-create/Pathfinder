import { ArrowRight, Check } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from '../components/ui/Alert';
import { ChoiceButton } from '../components/ui/ChoiceButton';
import { useApp } from '../context/appState';
import { BACKGROUNDS, CITIES, emptyProfile, GENDERS } from '../data/constants';
import { validateProfile, type ProfileField } from '../lib/validateProfile';
import type { StudentProfile } from '../types';

export default function Register() {
  const { user, profile, saveProfile } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState<StudentProfile>(() => profile ?? emptyProfile(user?.name, user?.email));
  const [showErrors, setShowErrors] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const errors = validateProfile(form);
  const isValid = Object.keys(errors).length === 0;
  const errorFor = (field: ProfileField) => (showErrors ? errors[field] : undefined);

  const update = <K extends keyof StudentProfile>(key: K, value: StudentProfile[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleContinue = async () => {
    if (!isValid) {
      setShowErrors(true);
      const first = Object.keys(errors)[0];
      document.getElementById(`field-${first}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setSaving(true);
    setSaveError('');
    try {
      await saveProfile(form);
      navigate('/assessment');
    } catch (err) {
      console.error('Saving profile failed', err);
      setSaveError("Couldn't save your profile. Check your internet connection and try again.");
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="mb-6">
        <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Step 1 of 2</div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">Tell us about yourself</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-1">
          Your background helps us tailor the recommendation to your goals and location.
        </p>
      </div>

      <form
        className="card p-6 sm:p-8 space-y-6 fade-in"
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          void handleContinue();
        }}
      >
        <FormSection number={1} title="Personal Information">
          <div className="grid sm:grid-cols-2 gap-4">
            <TextField id="name" label="Full Name *" error={errorFor('name')}>
              <input
                id="field-name"
                className="input"
                autoComplete="name"
                value={form.name}
                aria-invalid={!!errorFor('name')}
                aria-describedby={errorFor('name') ? 'err-name' : undefined}
                onChange={(e) => update('name', e.target.value)}
              />
            </TextField>
            <TextField id="email" label="Email *" error={errorFor('email')}>
              <input
                id="field-email"
                type="email"
                className="input"
                autoComplete="email"
                value={form.email}
                aria-invalid={!!errorFor('email')}
                aria-describedby={errorFor('email') ? 'err-email' : undefined}
                onChange={(e) => update('email', e.target.value)}
              />
            </TextField>
            <TextField id="mobile" label="Mobile Number">
              <input
                id="field-mobile"
                type="tel"
                inputMode="tel"
                className="input"
                autoComplete="tel"
                value={form.mobile}
                onChange={(e) => update('mobile', e.target.value)}
              />
            </TextField>
            <TextField id="gender" label="Gender *" error={errorFor('gender')}>
              <select
                id="field-gender"
                className="input"
                value={form.gender}
                aria-invalid={!!errorFor('gender')}
                aria-describedby={errorFor('gender') ? 'err-gender' : undefined}
                onChange={(e) => update('gender', e.target.value)}
              >
                <option value="">Select</option>
                {GENDERS.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </TextField>
            <div className="sm:col-span-2">
              <TextField id="city" label="City *" error={errorFor('city')}>
                <input
                  id="field-city"
                  className="input"
                  placeholder="e.g. Nashik"
                  autoComplete="address-level2"
                  value={form.city}
                  aria-invalid={!!errorFor('city')}
                  aria-describedby={errorFor('city') ? 'err-city' : undefined}
                  onChange={(e) => update('city', e.target.value)}
                />
              </TextField>
            </div>
          </div>
        </FormSection>

        <FormSection number={2} title="Academic Background">
          <div className="grid sm:grid-cols-2 gap-4">
            <fieldset className="sm:col-span-2" id="field-background">
              <legend className="label">Graduation Background *</legend>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {BACKGROUNDS.map((b) => (
                  <ChoiceButton key={b} selected={form.background === b} onClick={() => update('background', b)}>
                    {b}
                  </ChoiceButton>
                ))}
              </div>
              <FieldError id="background" message={errorFor('background')} />
            </fieldset>
            {(['ssc', 'hsc', 'graduation'] as const).map((key) => (
              <TextField
                key={key}
                id={key}
                label={`${key === 'graduation' ? 'Graduation' : key.toUpperCase()} % *`}
                error={errorFor(key)}
              >
                <input
                  id={`field-${key}`}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  max={100}
                  step="0.01"
                  className="input"
                  value={form[key] || ''}
                  aria-invalid={!!errorFor(key)}
                  aria-describedby={errorFor(key) ? `err-${key}` : undefined}
                  onChange={(e) => update(key, Number(e.target.value))}
                />
              </TextField>
            ))}
          </div>
        </FormSection>

        <FormSection number={3} title="Work Experience">
          <div className="flex gap-3 flex-wrap" role="group" aria-label="Work experience">
            {(['Fresher', 'Experienced'] as const).map((w) => (
              <ChoiceButton
                key={w}
                className="px-4 py-2"
                selected={form.workExperience === w}
                onClick={() => update('workExperience', w)}
              >
                {form.workExperience === w && <Check className="h-3.5 w-3.5 inline mr-1" aria-hidden />}
                {w}
              </ChoiceButton>
            ))}
          </div>
          {form.workExperience === 'Experienced' && (
            <div className="mt-3 max-w-xs">
              <label className="label" htmlFor="field-years">
                Years of experience
              </label>
              <input
                id="field-years"
                type="number"
                min={0}
                max={30}
                className="input"
                value={form.yearsOfExperience || ''}
                onChange={(e) => update('yearsOfExperience', Number(e.target.value))}
              />
            </div>
          )}
        </FormSection>

        <FormSection number={4} title="Career Goals & Location">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="label" htmlFor="field-goal">
                Describe your career goal
              </label>
              <textarea
                id="field-goal"
                className="input min-h-[90px]"
                placeholder="e.g. I want to be a Data Analyst at an IT firm in Bengaluru and grow into a leadership role."
                value={form.careerGoal}
                onChange={(e) => update('careerGoal', e.target.value)}
              />
            </div>
            <fieldset className="sm:col-span-2" id="field-preferredCity">
              <legend className="label">Which location are you interested in for future career opportunities? *</legend>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {CITIES.map((c) => (
                  <ChoiceButton key={c} selected={form.preferredCity === c} onClick={() => update('preferredCity', c)}>
                    {c}
                  </ChoiceButton>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-1.5">
                This determines location-based job recommendations and placement opportunities in your report.
              </p>
              <FieldError id="preferredCity" message={errorFor('preferredCity')} />
            </fieldset>
          </div>
        </FormSection>

        {showErrors && !isValid && (
          <Alert tone="error">Please complete the {Object.keys(errors).length} highlighted required field(s) to continue.</Alert>
        )}
        {saveError && <Alert tone="error">{saveError}</Alert>}

        <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
          <button
            type="submit"
            aria-disabled={!isValid}
            disabled={saving}
            className={`btn-primary px-6 py-2.5 rounded-xl font-semibold flex items-center gap-2 ${isValid ? '' : 'opacity-55'}`}
          >
            {saving ? 'Saving…' : 'Continue to Assessment'} <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </form>
    </div>
  );
}

function FormSection({ number, title, children }: { number: number; title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
        <span className="h-6 w-6 rounded-md bg-indigo-600 text-white text-xs flex items-center justify-center font-bold" aria-hidden>
          {number}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function TextField({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label className="label" htmlFor={`field-${id}`}>
        {label}
      </label>
      {children}
      <FieldError id={id} message={error} />
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={`err-${id}`} className="text-xs text-rose-600 dark:text-rose-400 mt-1">
      {message}
    </p>
  );
}

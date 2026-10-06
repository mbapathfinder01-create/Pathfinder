import { INTEREST_QUESTIONS, SKILL_DIMENSIONS, SWOT_ORDER, SWOT_QUESTIONS } from '../data/assessment';
import type { StudentProfile } from '../types';

/** Stable ids for every question in a section, used for progress and "jump to unanswered". */
export function unansweredIds(step: number, p: StudentProfile): string[] {
  if (step === 0) return INTEREST_QUESTIONS.filter((q) => !p.interests[q.id]).map((q) => `q-interest-${q.id}`);
  if (step === 1) {
    return SWOT_ORDER.flatMap((quad) =>
      SWOT_QUESTIONS[quad].filter((q) => !p.swot[quad][q.id]).map((q) => `q-swot-${q.id}`),
    );
  }
  return SKILL_DIMENSIONS.filter((d) => !p.skills[d.id]).map((d) => `q-skill-${d.id}`);
}

export function sectionSize(step: number): number {
  if (step === 0) return INTEREST_QUESTIONS.length;
  if (step === 1) return SWOT_ORDER.reduce((n, quad) => n + SWOT_QUESTIONS[quad].length, 0);
  return SKILL_DIMENSIONS.length;
}

export function sectionProgress(step: number, p: StudentProfile): number {
  const total = sectionSize(step);
  return Math.round(((total - unansweredIds(step, p).length) / total) * 100);
}

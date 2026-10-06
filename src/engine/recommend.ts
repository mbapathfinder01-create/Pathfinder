import { SPECIALIZATIONS } from '../data/specializations';
import type { InterestId, Recommendation, Specialization, StudentProfile, TraitId } from '../types';
import {
  CONFIDENCE,
  DEFAULT_BACKGROUND_FIT,
  DEFAULT_CITY_DEMAND,
  DEMAND_MULTIPLIER,
  FIT_WEIGHTS,
  GAP_SKILL_THRESHOLD,
  GAP_TRAIT_THRESHOLD,
  GOAL_KEYWORDS,
  GOAL_LOCATION_SPLIT,
  NEUTRAL_RATING,
  READINESS_WEIGHTS,
  RECOMMENDED_INDUSTRIES,
  SUITABLE_ROLES,
  SWOT_WEIGHTS,
  TRAIT_LABELS,
} from './config';
import { mean } from './math';

const clamp01 = (n: number) => Math.max(0, Math.min(1, n));

/** Weighted average of 1–5 ratings, normalized to 0–1. Missing answers count as neutral. */
function weightedRating<K extends string>(weights: Record<K, number>, ratings: Partial<Record<string, number>>): number {
  let sum = 0;
  let totalWeight = 0;
  for (const [id, weight] of Object.entries(weights) as [K, number][]) {
    sum += ((ratings[id] ?? NEUTRAL_RATING) / 5) * weight;
    totalWeight += weight;
  }
  return totalWeight > 0 ? sum / totalWeight : 0;
}

/** Readiness from SWOT, identical for every specialization. */
export function swotReadiness(profile: StudentProfile): number {
  const avg = (q: 'S' | 'W' | 'O' | 'T') => mean(Object.values(profile.swot[q])) / 5;
  return clamp01(
    SWOT_WEIGHTS.S * avg('S') + SWOT_WEIGHTS.O * avg('O') + SWOT_WEIGHTS.W * (1 - avg('W')) + SWOT_WEIGHTS.T * (1 - avg('T')),
  );
}

function goalKeywordScore(spec: Specialization, careerGoal: string): number {
  const goal = careerGoal.toLowerCase();
  const hits = GOAL_KEYWORDS[spec.key].filter((kw) => goal.includes(kw)).length;
  return Math.min(1, hits / 2);
}

function buildReasoning(
  spec: Specialization,
  profile: StudentProfile,
  f: { academic: number; interest: number; skills: number; swot: number; city: number; goal: number },
): string[] {
  const reasons: string[] = [];
  if (f.academic >= 0.8) reasons.push(`Your ${profile.background} background strongly aligns with ${spec.shortName}.`);
  else if (f.academic >= 0.5) reasons.push(`Your ${profile.background} background is a good foundation for ${spec.shortName}.`);
  if (f.interest >= 0.75) reasons.push(`Your interests are highly aligned with ${spec.shortName}.`);
  if (f.skills >= 0.75) reasons.push(`You already demonstrate strong skills needed for ${spec.shortName}.`);
  if (f.swot >= 0.7) reasons.push(`Your SWOT profile suggests readiness for ${spec.shortName}-level challenges.`);
  if (f.city >= 1) reasons.push(`${profile.preferredCity} has strong placement opportunities in ${spec.shortName}.`);
  if (f.goal > 0) reasons.push(`Your career goal mentions keywords relevant to ${spec.shortName}.`);
  if (reasons.length === 0) reasons.push('Moderate fit — upskilling can significantly improve your alignment.');
  return reasons;
}

function skillGaps(spec: Specialization, profile: StudentProfile): string[] {
  const ratings = profile.skills as Partial<Record<string, number>>;
  return (Object.entries(spec.traits) as [TraitId, number][])
    .filter(([trait, weight]) => weight >= GAP_TRAIT_THRESHOLD && (ratings[trait] ?? NEUTRAL_RATING) / 5 < GAP_SKILL_THRESHOLD)
    .map(([trait]) => TRAIT_LABELS[trait]);
}

function scoreSpecialization(spec: Specialization, profile: StudentProfile, swot: number): Recommendation {
  const academic = profile.background
    ? (spec.backgroundFit[profile.background] ?? DEFAULT_BACKGROUND_FIT)
    : DEFAULT_BACKGROUND_FIT;
  const interest = weightedRating<InterestId>(spec.interestWeights, profile.interests);
  const skills = weightedRating<TraitId>(spec.traits, profile.skills);
  const goal = goalKeywordScore(spec, profile.careerGoal ?? '');
  const city = profile.preferredCity ? (spec.cityDemand[profile.preferredCity] ?? DEFAULT_CITY_DEMAND) : DEFAULT_CITY_DEMAND;
  const goalAndLocation = GOAL_LOCATION_SPLIT.goal * goal + GOAL_LOCATION_SPLIT.city * city;

  const totalScore =
    (FIT_WEIGHTS.academic * academic +
      FIT_WEIGHTS.interest * interest +
      FIT_WEIGHTS.swot * swot +
      FIT_WEIGHTS.skills * skills +
      FIT_WEIGHTS.goalAndLocation * goalAndLocation) *
    (DEMAND_MULTIPLIER[spec.industryDemand] ?? 1);

  const placementReadiness = Math.round(
    (READINESS_WEIGHTS.skills * skills +
      READINESS_WEIGHTS.swot * swot +
      READINESS_WEIGHTS.interest * interest +
      READINESS_WEIGHTS.academic * academic +
      READINESS_WEIGHTS.city * city) *
      100,
  );

  return {
    key: spec.key,
    spec,
    totalScore,
    confidence: 0,
    breakdown: { academic, interest, swot, skills, goal: goalAndLocation, cityDemand: city },
    reasoning: buildReasoning(spec, profile, { academic, interest, skills, swot, city, goal }),
    suitableCareers: SUITABLE_ROLES[spec.key],
    skillGaps: skillGaps(spec, profile),
    suggestedCerts: spec.certifications.slice(0, 3),
    recommendedIndustries: RECOMMENDED_INDUSTRIES[spec.key],
    placementReadiness,
  };
}

/**
 * Scores all specializations for a student and returns them ranked best-first.
 * Confidence is relative: the top match lands near 98% and the weakest near 58%.
 */
export function calculateRecommendations(profile: StudentProfile): Recommendation[] {
  const swot = swotReadiness(profile);
  const ranked = SPECIALIZATIONS.map((spec) => scoreSpecialization(spec, profile, swot)).sort(
    (a, b) => b.totalScore - a.totalScore,
  );

  const best = ranked[0].totalScore;
  const worst = ranked[ranked.length - 1].totalScore;
  const range = Math.max(0.05, best - worst);
  for (const rec of ranked) {
    const scaled = ((rec.totalScore - worst) / range) * CONFIDENCE.span + CONFIDENCE.floor;
    rec.confidence = Math.round(Math.max(CONFIDENCE.min, Math.min(CONFIDENCE.max, scaled)));
  }
  return ranked;
}

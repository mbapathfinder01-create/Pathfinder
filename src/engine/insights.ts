import { IMPROVEMENT_PLANS } from '../data/improvementPlans';
import { SPECIALIZATIONS } from '../data/specializations';
import type { ImprovementPlan, RadarPoint, SkillId, StrengthInsight, StudentProfile, SwotSummary, TraitId } from '../types';
import { mean } from './math';

/** SWOT quadrant averages scaled to 0–100, plus net balance ((S+O)/2 − (W+T)/2). */
export function summarizeSwot(profile: StudentProfile): SwotSummary {
  const pct = (q: 'S' | 'W' | 'O' | 'T') => mean(Object.values(profile.swot[q])) * 20;
  const S = pct('S');
  const W = pct('W');
  const O = pct('O');
  const T = pct('T');
  return {
    S: Math.round(S),
    W: Math.round(W),
    O: Math.round(O),
    T: Math.round(T),
    net: Math.round((S + O) / 2 - (W + T) / 2),
  };
}

const RADAR_LABELS: Record<SkillId, string> = {
  analytical: 'Analytical',
  leadership: 'Leadership',
  communication: 'Communication',
  creativity: 'Creativity',
  decision: 'Decision',
  teamwork: 'Team Mgmt',
  problemSolving: 'Problem Solving',
  data: 'Data',
  customer: 'Customer',
  process: 'Process',
};

export function skillRadar(profile: StudentProfile): RadarPoint[] {
  return (Object.entries(profile.skills) as [SkillId, number][]).map(([id, rating]) => ({
    skill: RADAR_LABELS[id] ?? id,
    score: Math.round((rating / 5) * 100),
  }));
}

const plan = (area: string): ImprovementPlan => {
  const found = IMPROVEMENT_PLANS.find((p) => p.area === area);
  if (!found) throw new Error(`Missing improvement plan: ${area}`);
  return found;
};

/** Up to 3 improvement plans, triggered by low skill ratings or strongly-agreed weakness statements. */
export function weaknessPlans(profile: StudentProfile): ImprovementPlan[] {
  const plans: ImprovementPlan[] = [];
  const { skills, swot } = profile;
  if ((skills.communication ?? 5) < 3.2) plans.push(plan('Communication Skills'));
  if ((swot.W.w2 ?? 0) >= 4) plans.push(plan('Procrastination & Task Initiation'));
  if ((skills.decision ?? 5) < 3.2) plans.push(plan('Decision Making Under Pressure'));
  if ((swot.W.w4 ?? 0) >= 4) plans.push(plan('Time & Priority Management'));
  if ((swot.W.w1 ?? 0) >= 4) plans.push(plan('Public Speaking Confidence'));
  return plans.slice(0, 3);
}

const STRENGTH_ROLES: Record<string, string[]> = {
  'Analytical Thinking': ['Data Analyst', 'Financial Analyst', 'Business Analyst', 'Supply Chain Analyst'],
  'Data Orientation': ['Data Analyst', 'BI Analyst', 'MIS Executive', 'Market Research Analyst'],
  Communication: ['Brand Manager', 'Digital Marketing Executive', 'HRBP', 'Guest Relations Manager'],
  Leadership: ['Management Trainee', 'Team Lead', 'Asst Manager', 'Consultant'],
  Creativity: ['Content Marketing Specialist', 'Brand Manager', 'Social Media Manager', 'Product Manager'],
  'Process Orientation': ['Operations Manager', 'Supply Chain Analyst', 'Hospital Administrator', 'Six Sigma Consultant'],
  'People Management': ['HR Business Partner', 'Talent Acquisition Lead', 'Hospitality Manager', 'L&D Executive'],
  'Customer Orientation': ['Wealth Manager', 'Sales Manager', 'Pharma MR', 'Guest Relations'],
  'Problem Solving': ['Business Analyst', 'Supply Chain Analyst', 'Product Manager', 'Consultant'],
};

const STRENGTH_DIMENSIONS: { id: string; name: string }[] = [
  { id: 'analytical', name: 'Analytical Thinking' },
  { id: 'data', name: 'Data Orientation' },
  { id: 'communication', name: 'Communication' },
  { id: 'leadership', name: 'Leadership' },
  { id: 'creativity', name: 'Creativity' },
  { id: 'process', name: 'Process Orientation' },
  { id: 'people', name: 'People Management' },
  { id: 'customer', name: 'Customer Orientation' },
  { id: 'problemSolving', name: 'Problem Solving' },
];

/** For each skill rated 4+, which specializations lean on it and which roles use it. */
export function strengthInsights(profile: StudentProfile): StrengthInsight[] {
  const ratings = profile.skills as Partial<Record<string, number>>;
  return STRENGTH_DIMENSIONS.filter(({ id }) => (ratings[id] ?? 0) >= 4)
    .map(({ id, name }) => ({
      strength: name,
      recommendedSpecs: SPECIALIZATIONS.filter((s) => (s.traits[id as TraitId] ?? 0) >= 0.75)
        .map((s) => s.name)
        .slice(0, 3),
      suggestedRoles: STRENGTH_ROLES[name] ?? [],
    }))
    .slice(0, 5);
}

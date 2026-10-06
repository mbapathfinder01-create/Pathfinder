import type { IndustryDemand, SpecializationKey, TraitId } from '../types';

/**
 * Weights of each factor in a specialization's total fit score.
 * total = Σ(weight × factor) × demandMultiplier. Factors are all 0–1.
 */
export const FIT_WEIGHTS = {
  academic: 0.15,
  interest: 0.25,
  swot: 0.2,
  skills: 0.25,
  goalAndLocation: 0.15,
} as const;

/** How the combined "goal & location" factor splits between goal keywords and city demand. */
export const GOAL_LOCATION_SPLIT = { goal: 0.6, city: 0.4 } as const;

/** SWOT readiness = 0.35·S + 0.35·O + 0.15·(1−W) + 0.15·(1−T). */
export const SWOT_WEIGHTS = { S: 0.35, O: 0.35, W: 0.15, T: 0.15 } as const;

/** Placement readiness (0–100) uses a different mix, emphasising current skills. */
export const READINESS_WEIGHTS = { skills: 0.3, swot: 0.25, interest: 0.2, academic: 0.15, city: 0.1 } as const;

export const DEMAND_MULTIPLIER: Record<IndustryDemand, number> = {
  'Very High': 1.08,
  High: 1,
  Medium: 0.95,
  Emerging: 1.05,
};

/** Confidence is min-max scaled across specializations into this band. */
export const CONFIDENCE = { floor: 58, span: 40, min: 55, max: 98 } as const;

/** Rating used when an answer is missing (neutral on the 1–5 scale). */
export const NEUTRAL_RATING = 3;
export const DEFAULT_BACKGROUND_FIT = 0.4;
export const DEFAULT_CITY_DEMAND = 0.6;

/** Keywords in the free-text career goal that signal intent for a specialization. Two hits = full score. */
export const GOAL_KEYWORDS: Record<SpecializationKey, string[]> = {
  Finance: ['finance', 'bank', 'investment', 'cfa', 'equity', 'stock', 'accounting', 'wealth', 'money', 'capital'],
  Marketing: ['market', 'brand', 'sales', 'digital', 'advertising', 'content', 'product', 'cmo', 'growth'],
  HR: ['hr', 'human resource', 'people', 'recruit', 'talent', 'culture', 'training', 'l&d', 'hrbp'],
  OSCM: ['operation', 'supply chain', 'logistics', 'manufacturing', 'warehouse', 'procurement', 'production'],
  Analytics: ['analytic', 'data', 'bi', 'sql', 'python', 'ai', 'machine learning', 'dashboard', 'insight'],
  Agri: ['agri', 'farming', 'rural', 'food processing', 'commodity', 'agriculture', 'farm'],
  Pharma: ['pharma', 'healthcare', 'hospital', 'medical', 'medicine', 'drug', 'clinical', 'wellness'],
  Hospitality: ['hospitality', 'hotel', 'travel', 'tourism', 'resort', 'guest', 'restaurant', 'event'],
  DigitalMarketing: [
    'seo',
    'social media',
    'digital marketing',
    'performance marketing',
    'content marketing',
    'google ads',
    'meta ads',
    'influencer',
  ],
};

export const SUITABLE_ROLES: Record<SpecializationKey, string[]> = {
  Finance: ['Financial Analyst', 'Investment Analyst', 'Wealth Manager', 'Credit Analyst', 'Banking Officer'],
  Marketing: ['Brand Manager', 'Digital Marketing Executive', 'Product Manager', 'Sales Manager', 'Marketing Executive'],
  HR: ['HRBP', 'Talent Acquisition Specialist', 'L&D Executive', 'HR Executive', 'Recruiter'],
  OSCM: ['Supply Chain Analyst', 'Operations Manager', 'Logistics Executive', 'Procurement Manager'],
  Analytics: ['Data Analyst', 'Business Analyst', 'BI Analyst', 'MIS Executive'],
  Agri: ['Agri Business Executive', 'Procurement Manager', 'Agri Marketing Officer', 'Agri Supply Chain Executive'],
  Pharma: ['Hospital Administrator', 'Healthcare Operations Executive', 'Pharma Marketing Executive'],
  Hospitality: ['Hotel Operations Executive', 'Guest Relations Manager', 'Hospitality Manager'],
  DigitalMarketing: ['SEO Executive', 'Performance Marketer', 'Social Media Manager', 'Content Marketing Specialist'],
};

export const RECOMMENDED_INDUSTRIES: Record<SpecializationKey, string[]> = {
  Finance: ['Banking & Financial Services', 'FinTech', 'Consulting'],
  Marketing: ['FMCG', 'E-Commerce', 'Retail'],
  HR: ['Information Technology', 'ITES', 'BPO'],
  OSCM: ['Logistics', 'E-Commerce', 'Automobile'],
  Analytics: ['Information Technology', 'ITES', 'Consulting'],
  Agri: ['Agriculture', 'Farming', 'Agri Processing', 'AgriTech', 'Food Processing'],
  Pharma: ['Pharmaceutical', 'Healthcare'],
  Hospitality: ['Hospitality', 'Retail'],
  DigitalMarketing: ['Information Technology', 'E-Commerce', 'FMCG'],
};

export const TRAIT_LABELS: Record<TraitId, string> = {
  analytical: 'Analytical Thinking',
  leadership: 'Leadership',
  communication: 'Communication',
  creativity: 'Creativity',
  data: 'Data Orientation',
  people: 'People Orientation',
  process: 'Process Orientation',
  customer: 'Customer Orientation',
};

/** A trait counts as a skill gap when the spec needs it (≥ this weight) … */
export const GAP_TRAIT_THRESHOLD = 0.8;
/** … and the student's normalized rating is below this. */
export const GAP_SKILL_THRESHOLD = 0.65;

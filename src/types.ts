export type Lang = 'en' | 'hi' | 'mr';

export type City = 'Nashik' | 'Pune' | 'Mumbai' | 'Bengaluru' | 'Delhi NCR';

export type Background =
  | 'Arts'
  | 'Commerce'
  | 'Science'
  | 'BBA'
  | 'BCA'
  | 'Engineering'
  | 'Pharmacy'
  | 'Agriculture'
  | 'Management'
  | 'Hotel Management'
  | 'Other';

export type SpecializationKey =
  | 'Finance'
  | 'Marketing'
  | 'HR'
  | 'OSCM'
  | 'Analytics'
  | 'Agri'
  | 'Pharma'
  | 'Hospitality'
  | 'DigitalMarketing';

export type InterestId =
  | 'numbers'
  | 'sales'
  | 'technology'
  | 'data'
  | 'peopleMgmt'
  | 'logistics'
  | 'strategy'
  | 'entrepreneurship';

export type SkillId =
  | 'analytical'
  | 'leadership'
  | 'communication'
  | 'creativity'
  | 'decision'
  | 'teamwork'
  | 'problemSolving'
  | 'data'
  | 'customer'
  | 'process';

/** Traits that each specialization weights. `people` has no direct skill question and falls back to neutral. */
export type TraitId =
  | 'analytical'
  | 'leadership'
  | 'communication'
  | 'creativity'
  | 'data'
  | 'people'
  | 'process'
  | 'customer';

export type SwotQuadrant = 'S' | 'W' | 'O' | 'T';

export type IndustryDemand = 'Very High' | 'High' | 'Medium' | 'Emerging';
export type Growth = 'Very High' | 'High' | 'Medium';

export interface Specialization {
  key: SpecializationKey;
  name: string;
  shortName: string;
  tagline: string;
  /** Tailwind gradient stops, e.g. "from-emerald-500 to-teal-600". */
  color: string;
  icon: string;
  overview: string;
  coreSubjects: string[];
  requiredSkills: string[];
  careerOpportunities: string[];
  industryDemand: IndustryDemand;
  futureScope: string;
  certifications: string[];
  salaryGrowth: string;
  topRecruiters: string[];
  traits: Record<TraitId, number>;
  interestWeights: Record<InterestId, number>;
  backgroundFit: Record<Background, number>;
  cityDemand: Record<City, number>;
}

export interface Career {
  title: string;
  specialization: SpecializationKey;
  avgSalary: string;
  growth: Growth;
  description: string;
  skills: string[];
  cities: City[];
  industries: string[];
  entryLevel: string;
  careerPath: string;
}

export interface Company {
  name: string;
  industry: string;
  city: City;
  departments: SpecializationKey[];
}

export type Rating = 1 | 2 | 3 | 4 | 5;

export interface StudentProfile {
  name: string;
  email: string;
  mobile: string;
  gender: string;
  city: string;
  background: Background | '';
  ssc: number;
  hsc: number;
  graduation: number;
  workExperience: 'Fresher' | 'Experienced';
  yearsOfExperience: number;
  interests: Partial<Record<InterestId, Rating>>;
  swot: Record<SwotQuadrant, Record<string, Rating>>;
  skills: Partial<Record<SkillId, Rating>>;
  careerGoal: string;
  preferredCity: City | '';
}

export type UserRole = 'student' | 'admin';

export interface User {
  /** Firebase Auth uid, or the email address in demo mode. */
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  photoURL?: string | null;
}

export interface Submission {
  id: string;
  /** Owner's user id. */
  uid: string;
  profile: StudentProfile;
  /** ISO timestamp. */
  submittedAt: string;
}

/** A student's saved progress: their profile form plus whether the assessment is complete. */
export interface StudentRecord {
  profile: StudentProfile;
  assessmentDone: boolean;
}

export interface ScoreBreakdown {
  academic: number;
  interest: number;
  swot: number;
  skills: number;
  goal: number;
  cityDemand: number;
}

export interface Recommendation {
  key: SpecializationKey;
  spec: Specialization;
  totalScore: number;
  /** 55–98, relative to the other specializations for this student. */
  confidence: number;
  breakdown: ScoreBreakdown;
  reasoning: string[];
  suitableCareers: string[];
  skillGaps: string[];
  suggestedCerts: string[];
  recommendedIndustries: string[];
  placementReadiness: number;
}

export interface SwotSummary {
  S: number;
  W: number;
  O: number;
  T: number;
  net: number;
}

export interface ImprovementPlan {
  area: string;
  impact: string;
  activities: string[];
  resources: string[];
  certification?: string;
  actions: string[];
}

export interface StrengthInsight {
  strength: string;
  recommendedSpecs: string[];
  suggestedRoles: string[];
}

export interface RadarPoint {
  skill: string;
  score: number;
}

export interface TrilingualText {
  en: string;
  hi: string;
  mr: string;
}

import type { Background, City, StudentProfile } from '../types';

export const BACKGROUNDS: Background[] = [
  'Arts',
  'Commerce',
  'Science',
  'BBA',
  'BCA',
  'Engineering',
  'Pharmacy',
  'Agriculture',
  'Management',
  'Hotel Management',
  'Other',
];

export const CITIES: City[] = ['Nashik', 'Pune', 'Mumbai', 'Bengaluru', 'Delhi NCR'];

export const GENDERS = ['Male', 'Female', 'Prefer not to say'] as const;

export const INDUSTRIES = [
  'Agriculture',
  'Farming',
  'Agri Processing',
  'AgriTech',
  'Information Technology',
  'ITES',
  'BPO',
  'Automobile',
  'Pharmaceutical',
  'Textile',
  'Food Processing',
  'FMCG',
  'Healthcare',
  'Hospitality',
  'Retail',
  'Logistics',
  'Supply Chain',
  'E-Commerce',
  'Banking & Financial Services',
];

/** Demo-only admin credentials, shown on the login screen exactly as the original app does. */
export const ADMIN_CREDENTIALS = {
  email: 'admin@mbapathfinder.com',
  password: 'admin123',
  accessCode: 'admin2025',
} as const;

export function emptyProfile(name = '', email = ''): StudentProfile {
  return {
    name,
    email,
    mobile: '',
    gender: '',
    city: '',
    background: '',
    ssc: 0,
    hsc: 0,
    graduation: 0,
    workExperience: 'Fresher',
    yearsOfExperience: 0,
    interests: {},
    swot: { S: {}, W: {}, O: {}, T: {} },
    skills: {},
    careerGoal: '',
    preferredCity: '',
  };
}

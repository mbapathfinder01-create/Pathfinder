import type { StudentProfile } from '../types';

export type ProfileField = 'name' | 'email' | 'gender' | 'city' | 'background' | 'ssc' | 'hsc' | 'graduation' | 'preferredCity';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isPercent = (n: number) => Number.isFinite(n) && n > 0 && n <= 100;

/** Returns a message per invalid required field; an empty object means the profile can be submitted. */
export function validateProfile(p: StudentProfile): Partial<Record<ProfileField, string>> {
  const errors: Partial<Record<ProfileField, string>> = {};
  if (!p.name.trim()) errors.name = 'Enter your full name.';
  if (!EMAIL_PATTERN.test(p.email.trim())) errors.email = 'Enter a valid email address.';
  if (!p.gender) errors.gender = 'Select a gender option.';
  if (!p.city.trim()) errors.city = 'Enter your city.';
  if (!p.background) errors.background = 'Choose your graduation background.';
  if (!isPercent(p.ssc)) errors.ssc = 'Enter a percentage between 1 and 100.';
  if (!isPercent(p.hsc)) errors.hsc = 'Enter a percentage between 1 and 100.';
  if (!isPercent(p.graduation)) errors.graduation = 'Enter a percentage between 1 and 100.';
  if (!p.preferredCity) errors.preferredCity = 'Pick a preferred location.';
  return errors;
}

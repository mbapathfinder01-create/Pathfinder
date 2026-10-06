import type { StudentProfile } from '../types';

/** Loads the (large) PDF module on demand so it doesn't weigh down first page load. */
export async function downloadReport(profile: StudentProfile): Promise<void> {
  const mod = await import('./pdfReport');
  mod.downloadReport(profile);
}

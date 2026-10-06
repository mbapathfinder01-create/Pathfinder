/**
 * Dev-only: compares this engine with the original app's minified engine on random profiles.
 * Usage: npx tsx scripts/parity-check.ts <path-to-original-bundle.js>
 */
import { readFileSync } from 'node:fs';
import { skillRadar, strengthInsights, summarizeSwot, weaknessPlans } from '../src/engine/insights';
import { calculateRecommendations } from '../src/engine/recommend';
import { BACKGROUNDS, CITIES, emptyProfile } from '../src/data/constants';
import { INTEREST_QUESTIONS, SKILL_DIMENSIONS, SWOT_ORDER, SWOT_QUESTIONS } from '../src/data/assessment';
import type { Rating, StudentProfile } from '../src/types';

const bundle = readFileSync(process.argv[2], 'utf8');
const slice = (from: string, to: string) => {
  const a = bundle.indexOf(from);
  const b = bundle.indexOf(to, a);
  if (a < 0 || b < 0) throw new Error(`marker not found: ${from}`);
  return bundle.slice(a, b);
};
const literal = (marker: string) => {
  const start = bundle.indexOf(marker) + marker.length;
  let depth = 0;
  let str: string | null = null;
  for (let i = start; i < bundle.length; i++) {
    const c = bundle[i];
    if (str) {
      if (c === '\\') i++;
      else if (c === str) str = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') str = c;
    else if (c === '[') depth++;
    else if (c === ']' && --depth === 0) return bundle.slice(start, i + 1);
  }
  throw new Error('unterminated');
};

const source = `const _u=${literal(',_u=')};${slice('const Mc=e=>', 'const fee="modulepreload"')}; return {Gv, cb, GO, LH, kH};`;
const original = new Function(source)() as Record<string, (p: StudentProfile) => unknown>;

let seed = 42;
const rand = () => ((seed = (seed * 1664525 + 1013904223) % 2 ** 32) / 2 ** 32);
const pick = <T>(xs: readonly T[]) => xs[Math.floor(rand() * xs.length)];
const rating = () => (1 + Math.floor(rand() * 5)) as Rating;
const GOALS = ['', 'I want to be a data analyst using SQL and python', 'brand manager in FMCG sales', 'hospital administration', 'supply chain and logistics', 'hotel and tourism', 'investment banking and equity'];

function randomProfile(): StudentProfile {
  const p = emptyProfile('Test Student', 'test@example.com');
  p.background = pick(BACKGROUNDS);
  p.preferredCity = pick(CITIES);
  p.careerGoal = pick(GOALS);
  for (const q of INTEREST_QUESTIONS) p.interests[q.id] = rating();
  for (const quad of SWOT_ORDER) for (const q of SWOT_QUESTIONS[quad]) p.swot[quad][q.id] = rating();
  for (const d of SKILL_DIMENSIONS) p.skills[d.id] = rating();
  return p;
}

const strip = (v: unknown) => JSON.parse(JSON.stringify(v, (k, x) => (k === 'spec' ? undefined : x)));
let mismatches = 0;
const N = 500;
for (let i = 0; i < N; i++) {
  const p = randomProfile();
  const pairs: [string, unknown, unknown][] = [
    ['recommendations', strip(original.Gv(p)), strip(calculateRecommendations(p))],
    ['swot', original.cb(p), summarizeSwot(p)],
    ['radar', original.GO(p), skillRadar(p)],
    ['weaknesses', original.LH(p), weaknessPlans(p)],
    ['strengths', original.kH(p), strengthInsights(p)],
  ];
  for (const [name, a, b] of pairs) {
    if (JSON.stringify(a) !== JSON.stringify(b)) {
      mismatches++;
      if (mismatches <= 3) console.log(`Mismatch in ${name}:`, JSON.stringify(a).slice(0, 400), '\nvs\n', JSON.stringify(b).slice(0, 400));
    }
  }
}
console.log(mismatches === 0 ? `PASS: ${N} random profiles produce identical output` : `FAIL: ${mismatches} mismatches`);
process.exit(mismatches ? 1 : 0);

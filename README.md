# MBA Pathfinder — Specialization & Career Recommendation

An interactive MBA specialization and career recommendation assessment for MBA-I students. Students build a profile, complete a trilingual (English / हिन्दी / मराठी) assessment covering career interests, SWOT and aptitude, and get their top 3 specializations with confidence scores, reasoning, a skill radar, an improvement plan, local placement opportunities in Nashik, Pune, Mumbai, Bengaluru and Delhi NCR, and a downloadable PDF roadmap.

This is a maintainable React + TypeScript rebuild of the original Arena-hosted app. It keeps the original's screens, content, data and scoring formula.

## Quick start

Requires Node.js 20+.

```bash
npm install
npm run dev        # http://localhost:5173
```

Production build:

```bash
npm run build      # type-checks, then outputs static files to dist/
npm run preview    # serves dist/ locally
```

`dist/` is a static site that can be hosted anywhere (Netlify, Vercel, S3, nginx). Because the app uses client-side routing, configure the host to fall back to `index.html` for unknown paths.

## Two modes: Firebase or demo

| | **Firebase mode** (recommended) | **Demo mode** (no setup) |
|---|---|---|
| Turned on by | Firebase keys in `.env.local` | No keys present |
| Sign-in | Real **Google sign-in** (Firebase Authentication) | Type any name/email; not verified |
| Data stored in | **Cloud Firestore**, shared across devices | Only in that browser's `localStorage` |
| Admin access | Google accounts listed in Firestore `admins` | Demo credentials shown on the login screen |
| Admin sees | Every student | Only students who used the same browser |
| Public link | `npm run deploy` → `https://<project>.web.app` | Local only |

**Set up Firebase with [FIREBASE_SETUP.md](FIREBASE_SETUP.md)** (about 15 minutes, free plan).

## Features and routes

| Route | What it does |
|---|---|
| `/` | Landing page: hero, stats, features, the 9 specializations, how it works |
| `/login` | Google sign-in (Firebase mode), or typed name/email and demo admin sign-in (demo mode) |
| `/register` | Step 1 of 2: personal, academic, experience, career goal, preferred city |
| `/assessment` | Step 2 of 2: 8 interest + 16 SWOT + 10 skill questions on a 1–5 scale, EN/HI/MR |
| `/recommendation` | Top 3 matches, score breakdown, radar, SWOT chart, strengths, weakness plan, careers, companies, roadmap, PDF |
| `/dashboard` | Journey progress, key stats, top matches, **Retake** (resets answers, keeps profile) |
| `/specializations` | Knowledge center with expandable detail for each specialization |
| `/careers` | 35 career roles, filterable by specialization, city, and search |
| `/opportunities` | 100+ employers, filterable by city, specialization, industry, and search |
| `/admin` | All submissions, charts, filters, CSV export, per-student report modal |

**Demo-mode admin login:** `admin@mbapathfinder.com` / `admin123` / access code `admin2025`. These are shown on the login screen, as in the original. In Firebase mode these don't exist; admins are Google accounts you list in Firestore.

## How recommendations are calculated

All logic lives in `src/engine/` and every weight is in `src/engine/config.ts`. Each of the 9 specializations is scored for the student:

```
background  = specialization.backgroundFit[student background]              (0–1)
interest    = weighted avg of 8 interest ratings / 5, by interestWeights    (0–1)
skills      = weighted avg of skill ratings / 5, by trait weights           (0–1)
swot        = 0.35·S + 0.35·O + 0.15·(1−W) + 0.15·(1−T)   (quadrant avgs/5)
goal        = min(1, matching career-goal keywords / 2)
city        = specialization.cityDemand[preferred city]                     (≈0.4–1.25)

total = (0.15·background + 0.25·interest + 0.20·swot + 0.25·skills
         + 0.15·(0.6·goal + 0.4·city)) × demand multiplier (Very High 1.08 … Medium 0.95)
```

Specializations are ranked by `total`. **Confidence** is relative: scores are min-max scaled so the best match lands near 98% and the weakest near 58% (clamped to 55–98). **Placement readiness** is a separate 0–100 score: `0.30·skills + 0.25·swot + 0.20·interest + 0.15·background + 0.10·city`.

The engine also produces the reasoning bullets, skill gaps (important traits rated below 65%), strength insights (skills rated 4+), and up to 3 improvement plans. Improvement plans are triggered by low communication or decision-making ratings, or by strongly agreeing with specific weakness statements.

To change how recommendations work, edit data and weights, not UI code:

- `src/data/specializations.ts`: per-specialization trait, interest, background, and city weights, plus content
- `src/engine/config.ts`: factor weights, keyword lists, roles, industries, thresholds
- `src/data/assessment.ts`: questions and translations

## Project structure

```
src/
├── main.tsx, App.tsx          # entry + routes (pages are lazy-loaded)
├── index.css                  # Tailwind v4 + design tokens (.card, .btn-primary, .chip …)
├── types.ts                   # shared domain types
├── backend/                   # Backend interface + Firebase and demo (localStorage) implementations
├── context/                   # AppProvider (session, profile, actions), useApp hook
├── hooks/                     # useSubmissions (admin data loading)
├── data/                      # specializations, careers, companies, questions, plans, constants
├── engine/                    # recommend.ts (scoring), insights.ts (SWOT, radar, plans), config.ts
├── lib/                       # PDF report, CSV export, storage, validation, assessment progress
├── components/
│   ├── layout/                # Header, Footer, Layout, route guards
│   ├── assessment/            # RatingScale, StepIndicator, LanguageToggle, TrilingualQuestion
│   ├── results/               # MatchCard, readiness banner, strengths, weakness plan, roadmap, PDF button
│   ├── charts/                # Skill radar, column chart, pie (recharts)
│   ├── admin/                 # Student report modal
│   └── ui/                    # Alert, ProgressBar, FilterPill, SearchInput, ConfirmDialog, …
└── pages/                     # One file per route
scripts/parity-check.ts        # Dev-only: compares this engine with the original bundle
firestore.rules                # Database security rules (deployed with `npm run deploy`)
firebase.json                  # Firebase Hosting + rules + emulator config
.env.example                   # Template for .env.local (Firebase keys)
```

## Data and privacy

**Firebase mode:** accounts live in Firebase Authentication. Profiles (`students/{uid}`) and completed assessments (`submissions/{id}`) live in Cloud Firestore, in the region chosen at setup. `firestore.rules` is enforced by Google's servers: students can only read and write their own data, only admins can read everyone's, and admin status can only be granted from the Firebase console. Details: [FIREBASE_SETUP.md](FIREBASE_SETUP.md#where-everything-is-stored).

**Demo mode:** there is no server. Everything is in the browser's `localStorage` under `mba_*` keys (the same keys as the original app). Sign-in isn't verified, the demo admin credentials are visible, and the admin only sees submissions from the same browser. It's fine for a quick demo, not for real students.

The theme preference is always per-device (`localStorage`).

## Architecture: the backend layer

All sign-in and storage goes through one interface, `src/backend/types.ts` (`Backend`), with two implementations:

- `src/backend/firebaseBackend.ts`: Firebase Auth (Google provider) + Firestore
- `src/backend/demoBackend.ts`: localStorage

`src/backend/index.ts` chooses one at startup based on whether `.env.local` has Firebase keys, and only downloads the Firebase SDK when it's used. Pages talk to `useApp()` (`src/context/`) and never to Firebase directly, so switching or adding a backend doesn't touch the UI.

## Tech stack

React 19 · TypeScript (strict) · Vite · Tailwind CSS v4 · React Router 7 · Firebase (Auth + Firestore + Hosting) · lucide-react · recharts · jsPDF + jspdf-autotable

## Verifying scoring parity (optional)

`scripts/parity-check.ts` runs this engine and the original app's minified engine on 500 random profiles and checks that the outputs are identical. It needs a saved copy of the original bundle's JavaScript:

```bash
npx tsx scripts/parity-check.ts path/to/original-app.js
```

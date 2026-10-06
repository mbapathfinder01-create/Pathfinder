# Deploy MBA Pathfinder on Vercel (with Firebase)

Result: a public link like **`https://mba-pathfinder.vercel.app`** with real Google sign-in and a shared database.

You'll use three free services:

| Service | Job |
|---|---|
| **Vercel** (vercel.com) | Hosts the website and gives you the public link |
| **Firebase Authentication** | Real "Sign in with Google" |
| **Cloud Firestore** (part of Firebase) | Database: every profile and submission |

Order: **Part A (Firebase)** → **Part B (Vercel)** → **Part C (connect them)** → **Part D (test)**.

> You can deploy to Vercel first without Firebase to see the site live. It runs in demo mode until the Firebase keys are added (Part C).

---

## What to upload

Upload the **whole project folder** (`D:\SaaS\Pathfinder`) as source code. Vercel builds it itself, so you don't upload `dist`.

It must **not** include (already excluded by `.gitignore` / `.vercelignore`):

- `node_modules/` – Vercel installs these itself
- `dist/` – Vercel builds this itself
- `.env.local` – your keys go into Vercel's settings instead (Part C)

The ready-made zip `mba-pathfinder-vercel.zip` (next to the project folder) contains exactly the right files.

Files that make Vercel work (already in the project):

| File | Purpose |
|---|---|
| `vercel.json` | Tells Vercel: Vite app, build with `npm run build`, serve `dist`, and send every URL to `index.html` so pages like `/dashboard` work on refresh |
| `.vercelignore` | Keeps local-only files out of uploads |
| `package.json` / `package-lock.json` | Exact dependency versions |

---

## Part A — Firebase project (about 10 min)

Follow **steps 1–5 of [FIREBASE_SETUP.md](FIREBASE_SETUP.md)**:

1. Create the project.
2. Enable **Google** sign-in.
3. Create the **Firestore** database (region: `asia-south1 (Mumbai)`).
4. Register the **web app** and copy the `firebaseConfig` values. Keep them for Part C.
5. Make yourself an **admin** (Firestore collection `admins`, document ID = your Gmail in lowercase).

Then deploy the **database security rules** (important: without them the database blocks everything). In a terminal in the project folder:

```bash
npx firebase-tools login
```

```bash
npx firebase-tools use --add
```

(pick your project, alias `default`)

```bash
npm run deploy:rules
```

You only need to repeat `deploy:rules` if `firestore.rules` changes.

---

## Part B — Put the site on Vercel (choose ONE option)

### Option 1: Vercel CLI (fastest, no GitHub needed)

In a terminal in `D:\SaaS\Pathfinder`:

```bash
npx vercel login
```

Log in with email or GitHub in the browser window that opens. Then:

```bash
npx vercel
```

Answer the questions:

| Question | Answer |
|---|---|
| Set up and deploy? | **Y** |
| Which scope? | your account |
| Link to existing project? | **N** |
| Project name? | `mba-pathfinder` |
| In which directory is your code located? | `./` (press Enter) |
| Want to modify these settings? | **N** (vercel.json already has them) |

That makes a *preview* deployment. For the main public link:

```bash
npm run deploy:vercel
```

It prints `Production: https://mba-pathfinder.vercel.app` (or similar). **Copy that domain** for Part C.

### Option 2: GitHub + Vercel dashboard (auto-deploys on every change)

1. Create a free account at github.com → **New repository** → name `mba-pathfinder` → **Private** → Create.
2. On the empty repo page click **uploading an existing file**. Unzip `mba-pathfinder-vercel.zip` and drag **the contents of the folder** (not the zip itself) into the page → **Commit changes**.
   (If you know git: `git init`, `git add .`, `git commit -m "Initial"`, then push.)
3. Go to vercel.com → sign up with GitHub → **Add New… → Project** → **Import** `mba-pathfinder`.
4. Vercel detects **Vite** automatically. Leave Build Command `npm run build` and Output Directory `dist`.
5. Before clicking Deploy, open **Environment Variables** and add the keys from Part C step 1 (or add them later and redeploy).
6. Click **Deploy**. After about 1 minute you get `https://mba-pathfinder.vercel.app`.

---

## Part C — Connect Vercel to Firebase

### 1. Add the Firebase keys to Vercel

Vercel dashboard → your project → **Settings → Environment Variables**. Add each one, ticking **Production, Preview and Development**:

| Name | Value (from Firebase `firebaseConfig`) |
|---|---|
| `VITE_FIREBASE_API_KEY` | `apiKey` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `authDomain` (e.g. `mba-pathfinder.firebaseapp.com`) |
| `VITE_FIREBASE_PROJECT_ID` | `projectId` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `storageBucket` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` |
| `VITE_FIREBASE_APP_ID` | `appId` |

Names must match exactly, including the `VITE_` prefix. Don't add `VITE_FIREBASE_EMULATORS`.

The CLI can do the same, one variable at a time (it asks for the value): `npx vercel env add VITE_FIREBASE_API_KEY`

### 2. Redeploy so the keys are built in

Vite puts these values into the site at build time, so you must redeploy after adding or changing them:

- Dashboard: **Deployments** → latest → **⋯ → Redeploy**, or
- CLI: `npm run deploy:vercel`

### 3. Allow Google sign-in on your Vercel domain

Firebase console → **Authentication → Settings → Authorised domains → Add domain** → enter your Vercel domain **without** `https://`, e.g. `mba-pathfinder.vercel.app`.

(If you add a custom domain later, add it here too.)

---

## Part D — Test the live site

Open your Vercel link and check:

1. **Home page loads.** Refresh on `/careers`; it should still load (proves the rewrite works).
2. **Sign in with Google** → Google's account picker appears → you land on the profile form.
   - "This website address isn't authorised…" → redo Part C step 3.
   - Still see the demo form (typed name/email)? The keys aren't in the build → redo Part C steps 1–2.
3. Fill in the profile → take the assessment → results appear → **Download Full PDF** works.
4. Firebase console → Firestore: you should see `students/…` and `submissions/…` documents.
5. Open the site on your **phone**, sign in with the same Google account: your progress is there.
6. Sign in with your **admin** account → **Admin** menu → every student's submission is listed.
   - "Couldn't load submissions" → rules not deployed (`npm run deploy:rules`) or your email isn't in `admins`.

---

## Updating the site later

- CLI route: change code → `npm run deploy:vercel`.
- GitHub route: push or upload changed files → Vercel redeploys automatically.

## Where your data lives

| What | Where |
|---|---|
| Website files | Vercel (global CDN) |
| Google accounts and sessions | Firebase Authentication (Google handles passwords; the app never sees them) |
| Profiles, answers, submissions | Cloud Firestore, in the region you chose |
| Admin list | Firestore `admins` collection (editable only in the Firebase console) |

## About Supabase

Supabase is an alternative to Firebase (it also provides Google sign-in and a Postgres database). **You need only one of them.** This app is wired for Firebase. Supporting Supabase means adding a `src/backend/supabaseBackend.ts` that implements the same `Backend` interface, plus a database table and row-level-security policies. The rest of the app doesn't change.

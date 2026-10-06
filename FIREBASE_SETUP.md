# Firebase setup: real Google sign-in, shared database, public link

Takes about 15 minutes. You need a Google account. Firebase's free "Spark" plan is enough for a class or college.

When you're done:

- Students sign in with their real Google account.
- Every profile and assessment is saved in **Cloud Firestore** (Google Cloud), so it works across devices.
- Admins see **every** student's submission.
- The app is live at a public link like `https://your-project.web.app`.

---

## 1. Create the Firebase project

1. Go to <https://console.firebase.google.com> and click **Create a project**.
2. Name it, for example `mba-pathfinder`. Google Analytics is optional; you can turn it off.
3. Wait for the project to be created.

## 2. Turn on Google sign-in

1. Left menu → **Build → Authentication** → **Get started**.
2. **Sign-in method** tab → **Google** → **Enable**.
3. Choose a **support email** (your own) → **Save**.

## 3. Create the database

1. Left menu → **Build → Firestore Database** → **Create database**.
2. **Location:** pick one close to your students, for example `asia-south1 (Mumbai)`. This can't be changed later.
3. Choose **Start in production mode**. The app ships its own security rules (`firestore.rules`), which you deploy in step 6.

## 4. Register the web app and copy its config

1. Project Overview (home icon) → **Add app** → the **Web** icon `</>`.
2. Nickname: `MBA Pathfinder`. Leave "Firebase Hosting" unticked; step 6 handles it.
3. Firebase shows a `firebaseConfig = { apiKey: ..., authDomain: ..., ... }` block. Keep it open.
4. In the project folder, copy `.env.example` to a new file named `.env.local` and fill in the values:

   ```
   VITE_FIREBASE_API_KEY=AIza...
   VITE_FIREBASE_AUTH_DOMAIN=mba-pathfinder.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=mba-pathfinder
   VITE_FIREBASE_STORAGE_BUCKET=mba-pathfinder.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
   VITE_FIREBASE_APP_ID=1:1234567890:web:abc123
   ```

   These values only identify your project and end up inside the public website anyway. What protects your data is sign-in plus the security rules.

5. Restart `npm run dev`. The login page now shows **Sign in with Google**, and the app is no longer in demo mode.

## 5. Make yourself an admin

Admin access isn't a password in the code. It's a list of Google accounts stored in the database, which only you can edit from the Firebase console.

1. Sign in to the app once with your Google account.
2. Firebase console → **Firestore Database** → **+ Start collection**.
3. Collection ID: `admins`.
4. Document ID: **your Gmail address in lowercase**, for example `yourname@gmail.com`.
5. Add any field, for example `role` (string) = `admin` → **Save**.
6. Back in the app, **log out and sign in again**. The **Admin** menu item appears.

To add more admins, add another document with their email. To remove an admin, delete their document.

## 6. Publish: rules + public link

In a terminal in the project folder:

```bash
npx firebase-tools login
```

```bash
npx firebase-tools use --add
```

Pick your project and give it the alias `default`. Then:

```bash
npm run deploy
```

This builds the app and uploads:

- the **security rules** (`firestore.rules`), which lock down the database, and
- the **website** (`dist/`), to Firebase Hosting.

When it finishes it prints your public link, for example **`https://mba-pathfinder.web.app`**. Share that with students. Run `npm run deploy` again whenever you change the app.

> Firebase automatically allows Google sign-in on `localhost`, `*.web.app` and `*.firebaseapp.com`. If you later use a custom domain, add it under **Authentication → Settings → Authorised domains**.

---

## Where everything is stored

| What | Where |
|---|---|
| Google sign-in (accounts, sessions) | **Firebase Authentication** in your project. The app never sees passwords; Google handles them. |
| Student profile + progress | Firestore → `students/{user id}` |
| Each completed assessment | Firestore → `submissions/{auto id}` |
| Admin list | Firestore → `admins/{email}` (edited only in the console) |
| Dark-mode preference | The user's own browser (`localStorage`) |

The database lives in Google Cloud in the region you picked in step 3.

**Who can see what** (enforced by `firestore.rules` on Google's servers, not just in the app):

- A student can read and write **only their own** profile, and can create submissions only under their own account.
- Admins can read every student and submission, and delete submissions.
- Nobody can make themselves an admin from the app.

## Troubleshooting

| Message | Fix |
|---|---|
| "This website address isn't authorised for Google sign-in" | Authentication → Settings → Authorised domains → add the domain you're using. |
| "Google sign-in is not enabled" | Step 2. |
| Admin menu doesn't appear | Check the `admins` document ID is exactly your email in lowercase, then log out and back in. |
| "Couldn't load submissions" on the admin page | Rules not deployed yet (step 6), or the account isn't in `admins`. |
| Sign-in popup is blocked on a phone | The app falls back to a full-page redirect automatically; allow popups for a smoother flow. |

## Going back to demo mode

Delete `.env.local` (or empty its values) and restart. The app falls back to the original browser-only behaviour.

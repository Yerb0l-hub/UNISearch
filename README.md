# UNISearch (MVP)

Mobile-responsive university discovery PWA with 12 curated institutions, sourced 2026/27 tuition where available, search, filters, university detail views, local shortlist, multi-column comparison, privacy-conscious local student profile, explainable profile-fit recommendations, and optional **real** AI Advisor through Vercel AI Gateway.

## Run / build
- Open with any local static server from the project root, e.g. `npx serve .` (direct `file://` URLs do not support ES imports reliably).
- `npm run check`
- `npm run build` creates deployable `dist/` for PWA and Capacitor.
- Deploy to Vercel with Framework Preset: **Other**, Build: `npm run build`, Output: `dist`. Keep `api/advisor.js` in project root, outside dist, so Vercel exposes `/api/advisor` as a Serverless Function.
- Client always offers local matching even with no AI key. To enable a live model, set `AI_GATEWAY_API_KEY` as an **encrypted server-side variable** or configure supported Vercel OIDC, and set `AI_GATEWAY_MODEL` to an available provider/model identifier, then redeploy.

## Mobile stores
- PWA can be installed from a mobile browser immediately.
- With Capacitor v8, run `npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios`, `npx cap init UNISearch com.unisearch.app --web-dir dist`, `npx cap add android`, `npx cap add ios`, `npm run build`, `npx cap sync`, then build/sign with Android Studio and Xcode (on macOS). Capacitor packaging and store approvals are separate from Vercel hosting.
- Publishing needs an eligible adult account holder for minors; official developer accounts, fee payment, identity checks, age ratings, privacy disclosures, testing and review are **not** completed by this repo.

## Deployment / product audit (MVP only)
- ✅ No real secret embedded in client assets; API creds server side.
- ✅ Cited official 2026/27 tuition for HKUST, CityUHK, CUHK; all other amounts intentionally marked unverified.
- ✅ Input size limits, no-store, same-origin requests, escaped UI content, no database migrations, privacy page.
- ⚠️ Anonymous paid AI endpoint lacks per-user durable rate limiting; **add rate limiting, auth, bot defense and spend limits before enabling paid AI publicly**.
- ⚠️ LocalStorage only: no multi-device sync, account deletion or collaborative database; browser storage can be cleared.
- ⚠️ Dataset is only a curated pilot and has no automatic re-verification; expand and verify with official university pages before public launch. Scores reflect personal preferences, **not likelihood of admission**.
- ⚠️ `gpa`, `ielts`, `sat` entered by users are self-reported. No verified eligibility calculator.
- ⚠️ No mobile native builds, signed bundles, test track or store approvals yet.

## Data provenance
- HKUST: https://registry.hkust.edu.hk/resource-library/tuition-rates-ug
- CityUHK: https://www.cityu.edu.hk/fo/htm/degree_fees.htm
- CUHK: https://www.iso.cuhk.edu.hk/images/publication/calendar/2026-2027/html5/english/48/

Last pilot data review: 15 October 2026.

## Update: PWA and deployment safeguards
- Offline shell caching via service worker. The AI endpoint is excluded.
- Security headers and restrictive CSP in `vercel.json`.
- The live AI route remains disabled until **both** an authenticated AI Gateway
  and a verified `AI_GATEWAY_MODEL` are configured server-side.
- Before public AI, implement durable per-user/IP rate limits, bot defense, and spending limits.

## Mobile scaffold
Read `MOBILE_RELEASE.md` and `capacitor.config.ts`. Native builds and store approvals are pending.

## Accounts (requires administrator setup)
Registration (email/password) and Google OAuth are implemented using Supabase Auth, but **not enabled in the public build** until a Supabase project is connected. Do not pretend registration works before this setup:

1. Create a Supabase project and run `supabase-schema.sql` in its SQL editor. All profile rows are protected by row-level-security `auth.uid()` policies. Verify RLS is enabled, and do not use a service-role key in browser code.
2. In Supabase Authentication > Providers enable Email and Google. Configure the Google Cloud OAuth consent screen/client credentials in Supabase (credentials should be entered privately in provider dashboards).
3. Add Supabase callback `https://<project-ref>.supabase.co/auth/v1/callback` to your Google OAuth authorized redirect URIs; add `https://unisearch-student.vercel.app/#profile` to Supabase Authentication URL redirect allow-list and use the production origin as Site URL.
4. Populate `auth-config.js` with the public Supabase URL and **publishable/anon** client key. The public key is expected in client code, unlike the secret service-role key.
5. Redeploy and test: register, email confirmation, Google login, refresh, profile save, logout, and another user unable to read/update the first user's profile.
6. Set password policy, CAPTCHA/rate limits in Supabase, and use a real Privacy Policy reflecting cloud storage of GPA, IELTS, SAT, priorities and email.

**Cloud privacy:** `student_profiles` contains student profile attributes, under RLS. Avoid collecting full names, IDs, application documents or sensitive personal data in the MVP. Logout does not delete the saved server-side account; add account deletion/withdrawal procedure before releasing apps.

## Tuition data
Where known, the 2026/27 published international undergraduate fee appears immediately on the catalog cards. All other fee amounts remain **Not verified**. HKU fee reflects STEM programmes (HK$249,000); non-STEM is HK$224,000. NYU Abu Dhabi tuition is $68,574, while total estimated attendance is $90,434 for 2026/27. Academic categories, year and intake may affect the amount.

Sources: https://www.hku.hk/en/admission-aid/tuition-fee-scholarships , https://admissions.hkbu.edu.hk/fees-and-scholarships.html , https://nyuad.nyu.edu/en/apply/undergraduate/scholarships-and-financial-aid/cost-of-attendance.html

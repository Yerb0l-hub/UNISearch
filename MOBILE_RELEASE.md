# UNISearch — Android / iOS release preparation

Status: scaffold prepared; Android and iOS native builds **not yet generated**.
The Vercel deployment is the web/PWA app, not an app-store binary.

## Environment
- Node 22+
- Android: Android Studio + Android SDK
- iOS: macOS + Xcode 26+ (for Capacitor v8)

## First setup
```bash
npm install @capacitor/core@^8 @capacitor/android@^8 @capacitor/ios@^8
npm install -D @capacitor/cli@^8
npm run build
npx cap add android
# On a Mac with Xcode:
npx cap add ios
npx cap sync
```

## Open the native projects
```bash
npx cap open android
npx cap open ios
```

Build an Android App Bundle (AAB) with a release signing configuration
in Android Studio. Archive/sign the iOS build in Xcode, upload it to
App Store Connect, and submit it for review.

## Product work before submitting
1. Test all screens, keyboard, safe areas and navigation on physical
   Android/iOS devices.
2. Choose a unique final application ID and brand identity before
   distributing builds.
3. Add a real support contact, app-store privacy disclosures, and
   verified institution/source update process. Define an age rating.
4. Treat admissions matches as estimates of preference fit, not
   predictions of acceptance or eligibility.
5. The AI Advisor currently falls back to deterministic local guidance
   in a native WebView. If live AI is added, create a carefully scoped,
   authenticated cross-origin mobile API integration and enforce
   durable rate limiting and spending quotas.
6. Add meaningful mobile-native capabilities and obtain beta feedback:
   a simple website wrapper may not satisfy store review.
7. Complete developer-account identity, agreements, store listing,
   screenshots, signing, testing and publication with an eligible
   account holder; the scaffold itself does not publish anything.

Official references:
https://capacitorjs.com/docs/getting-started
https://capacitorjs.com/docs/getting-started/environment-setup
https://developer.apple.com/help/account/membership/program-enrollment/
https://support.google.com/googleplay/android-developer/answer/14151465

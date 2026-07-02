# نور — NOOR

**Your daily companion for prayer and dhikr** · رفيقك اليومي للصلاة والذِّكر

NOOR is a premium, subscription-based Islamic mobile app built with **React Native (Expo)**.
It brings together accurate prayer times, smart reminders, daily Islamic content (hadith,
sunnahs, rulings), Quran reading, adhkar with full authentic texts, Islamic occasions and
step-by-step prayer guides — in an elegant, fully **RTL Arabic-first** experience localized
into **21 languages**.

The UI is a pixel-faithful implementation of the Claude Design handoff found in
[`design/`](design/) (19 screens, full token spec and animation keyframes).

---

## ✨ Product highlights

- **Arabic-first, fully RTL** — IBM Plex Sans Arabic for UI, Amiri for Quran & calligraphy.
- **Complete setup funnel** — animated splash → 4 animated onboarding stories → 4-step
  personalization quiz → sign-up / sign-in / guest → 3-day-trial paywall → location picker.
- **Subscription-first monetization** — the trial paywall can be dismissed with ✕, but every
  tab, button and feature a free user touches re-opens it (`usePaywallGate`). Pricing is
  defined in USD and displayed in the user's local currency.
- **Real religious value** — the content shipped in the app is complete and authentic:
  - Morning/evening/post-prayer adhkar with full texts, repeat counts, sources and virtues.
  - Step-by-step prayer guides (all five prayers) with the complete recitations — a user
    can open the page and pray from it.
  - Rotating daily-hadith archive (27 items with warm Arabic explanations).
  - **The complete Quran** — all 114 surahs / 6,236 ayahs in Uthmani script (Hafs,
    Tanzil text), with a virtualized reader (verse highlighting, bookmark, font
    scaling), a searchable surah index, and **real streaming recitation**
    (expo-audio; 4 reciters incl. Mishary Alafasy, seek + reciter switching).
- **Live prayer engine** — offline calculation via [`adhan`](https://github.com/batoulapps/adhan-js)
  (7 calculation methods, Shafi/Hanafi madhhab), sunnah times (midnight, last third, duha),
  **official Umm al-Qura hijri dates** (@umalqura/core, tabular fallback) and upcoming
  Islamic occasions with countdowns.
- **Dark mode** — a full dark palette derived from the design tokens; the appearance
  switch (فاتح / داكن / تلقائي) applies live, with `auto` following the system scheme.
- **Real local accounts** — registered users with salted SHA-256 password hashing
  (expo-crypto), duplicate-email/wrong-password flows; guest mode; backend-swappable.
- **Local notifications** — adhan per prayer, configurable pre-alerts (5/10/15 min), Friday
  sunnah, Monday/Thursday fasting, morning/evening adhkar, daily wird, trial-ending reminder.
- **Language intelligence** — on first launch, if the device language differs from Arabic,
  a bottom sheet offers to switch (or stay in Arabic). Language can also be changed any time
  in Settings; RTL/LTR direction syncs automatically.

## 🛠 Tech stack

| Area | Choice |
|---|---|
| Framework | Expo SDK 57 · React Native 0.86 · TypeScript (strict) |
| Navigation | React Navigation 7 (native stack + bottom tabs, custom blurred tab bar) |
| State | zustand (+ AsyncStorage persistence) |
| i18n | i18next / react-i18next + expo-localization (21 locales, Arabic default) |
| Prayer times | adhan (offline astronomical calculation) |
| Animation | react-native-reanimated 4 (design keyframes: float, twinkle, pulse, orbit, shimmer…) |
| Graphics | expo-linear-gradient, react-native-svg (radial glows), expo-blur (glass chips) |
| Notifications | expo-notifications (local scheduling; push-ready permission/channel setup) |
| Fonts | @expo-google-fonts: IBM Plex Sans Arabic (300–700) + Amiri (400/700) |

## 🚀 Getting started

```bash
npm install
npx expo start          # scan the QR with Expo Go, or press i / a for simulators
```

Useful checks:

```bash
npx tsc --noEmit        # typecheck (strict)
npx expo export --platform ios   # verify the release bundle compiles
```

> The app forces RTL for Arabic. In Expo Go the first launch after switching between
> RTL/LTR languages may require reloading the app for the direction to apply.

## 📁 Project structure

```
design/            Claude Design handoff (19-screen HTML reference + token spec)
docs/ARCHITECTURE.md  Implementation contract (tokens, components, stores, rules)
src/
  components/      Reusable UI: AppText, buttons, cards, controls, glass chips,
                   star logo, radial glows, animation primitives, language sheet
  content/         Sacred content data (Arabic, verbatim): quran, adhkar, hadith,
                   prayerGuides, cities (+types)
  hooks/           usePaywallGate, useNow, usePrayerSchedule
  i18n/            i18next setup, device-language detection, locales/*.json (21)
  navigation/      RootNavigator (stack) + MainTabs (custom tab bar) + types
  screens/
    SplashScreen, LocationSetupScreen, RemindersScreen
    onboarding/    4 animated hero pages
    quiz/          gender / age / goals / religiosity (+shared layout)
    auth/          sign-up, sign-in (guest supported)
    paywall/       TrialPaywall (3-day trial), SubscriptionPaywall (free-vs-premium)
    main/          Home, PrayerTimes, QuranReader, SurahList, DailyContent,
                   CustomsHolidays, Settings
    reader/        AdhkarReader (tap-to-count), PrayerGuide (full how-to-pray)
    settings/      Profile, LanguagePicker
  services/        prayerTimes (adhan), hijri, dates, islamicEvents,
                   notifications, currency (USD → local display), auth-ready stores
  store/           useUserStore, useSettingsStore, useSubscriptionStore, useContentStore
  theme/           Design tokens: colors, gradients, shadows, typography, radii
```

## 💰 Monetization model

- Plans: **yearly $59.99** (≈$4.99/mo, "save 50%") and **monthly $9.99**, both with a
  **3-day free trial**. Amounts are converted for display to the local currency
  (`src/services/currency.ts`) — real store pricing will come from the stores at
  IAP integration time.
- `useSubscriptionStore.startTrial()` is a **mock purchase**: it grants the entitlement
  locally. The call sites are clean and centralized so StoreKit / Google Play Billing /
  RevenueCat can be dropped in without touching screens.
- Gating rule (product requirement): everything except *viewing* the Home screen requires
  an entitlement. `usePaywallGate` wraps every interactive feature; the bottom tab bar
  gates all tabs except Home.

## 🧪 Quality

- `npx tsc --noEmit` — strict, zero errors.
- `npm test` — 24 unit tests over the service layer (hijri anchors & round-trips,
  prayer-time ordering/rollover/madhhab, currency formatting, occasions, dates).
- `npx expo export` — release bundle verified.
- Branded assets (app icon, adaptive icon, splash, favicon) generated from the
  8-point-star motif; `eas.json` ships dev/preview/production build profiles.

## ✅ Implemented

- All 19 design screens + auth, profile, language picker, surah list, adhkar reader and
  prayer-guide screens (23 screens total), pixel-faithful to the handoff incl. ambient
  animations (traveling sun arc, radar pulses, card stack, gold orbits, shimmer CTAs).
- Full setup flow with persisted progress (cold start resumes at the right step).
- Prayer engine + home countdown + times per day (yesterday/today/tomorrow) + per-prayer
  notification toggles + calculation method / madhhab settings.
- Daily content with mark-as-read/save/share, archive; occasions with hijri countdowns.
- Adhkar reader with tap-to-count repeats, haptics and completion state.
- 21 UI locales (ar default; en, fr, es, de, tr, ur, id, ms, fa, ru, hi, bn, pt, it, nl,
  zh, ja, ko, sw, he) — sacred texts remain Arabic by design.
- Local notification scheduling wired to settings; device-language suggestion sheet.
- Strict TypeScript, clean `tsc`, verified `expo export` bundle.

## 🔜 Next steps (post-handoff integration work)

- **Payments** (the one intentionally-open integration): connect StoreKit / Play
  Billing (or RevenueCat) to `useSubscriptionStore`; replace the display-time FX
  table with store-provided localized prices; server receipt validation.
- **Backend sync**: the account system is local-first by design — plug a remote API
  into `services/auth.ts` and sync personalization/progress/subscription state.
- **Remote push sending**: devices already register Expo push tokens
  (`services/pushToken.ts`); sending requires a backend that stores tokens and
  calls the Expo push API (local scheduled notifications are fully working).
- **Adhan audio in notifications**: bundle licensed muezzin recordings for the
  selectable adhan voices (notifications currently use the system sound).

## 📐 Design source

The complete design handoff lives in [`design/`](design/):
`Noor App Screens.dc.html` (all 19 screens with animation keyframes) and `README.md`
(tokens, typography, motifs, interactions). `docs/ARCHITECTURE.md` documents how the
implementation maps onto it.

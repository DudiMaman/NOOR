# NOOR — Architecture & Implementation Contract

React Native (Expo SDK 57, TypeScript strict) subscription app. Full RTL Arabic-first UI
recreated pixel-faithfully from the Claude Design handoff in `design/`.

## Folder structure

```
src/
  components/   reusable UI (see “Component library” below)
  screens/      one file per screen; folders: onboarding/ quiz/ auth/ paywall/ main/ reader/ settings/
  navigation/   RootNavigator (native stack) + MainTabs (custom tab bar) + types.ts
  services/     prayerTimes (adhan), hijri, dates, notifications, currency, islamicEvents
  store/        zustand + AsyncStorage persist: useUserStore, useSettingsStore, useSubscriptionStore, useContentStore
  hooks/        usePaywallGate, useNow, usePrayerSchedule
  i18n/         i18next; locales/*.json (ar = source of truth, 21 languages); languages.ts
  content/      Arabic sacred content data: quran, adhkar, hadith, prayerGuides, cities (+types.ts)
  theme/        design tokens: colors, gradients, shadows, fonts, typography, radii, spacing
```

## Non-negotiable rules

1. **Design fidelity** — implement each screen from its HTML reference slice (colors,
   sizes, spacing, radii and copy are final intent at 402×874pt). Use tokens from
   `src/theme` — never hard-code a color that exists as a token.
   **Theming**: screens consume colors via `const { colors } = useTheme()`
   (light/dark palettes share token names — see `theme/palettes.ts`). The static
   `colors` export remains only for the design-dark screens (Splash, Onboarding,
   TrialPaywall) that render identically in both schemes.
2. **RTL** — the app forces RTL for Arabic (`I18nManager`). Write layouts in the same
   order as the HTML's RTL DOM: a `flexDirection:'row'` renders first-child on the
   right under RTL. Use `start`/`end` style properties (`marginStart`,
   `borderTopStartRadius`, `left`→ physical only for decorative absolutes copied from
   the HTML, which is already RTL).
3. **Numerals** — Western digits for times/prices (`4:12`, `19.90`); Arabic-Indic
   (١٢٣) only for Quran verse markers. Times use `tabular` prop of `AppText`.
4. **i18n** — every UI string via `useTranslation()` + keys that exist in
   `src/i18n/locales/ar.json`. Sacred content (Quran/adhkar/hadith/prayer texts and
   Arabic city names) is rendered from `src/content/*` verbatim, NOT via i18n.
5. **Paywall gate** — everything except viewing the Home screen requires an
   entitlement. Wrap every interactive feature action with
   `const gate = usePaywallGate(); onPress={() => gate(() => …)}`. Tabs are already
   gated in `MainTabs`. The trial paywall's ✕ merely closes it; the next touch
   re-opens it (that is exactly what the gate does).
6. **Fonts** — `AppText` only (never bare `<Text>`): IBM Plex Sans Arabic via
   `weight` prop; Amiri via `amiri` prop for Quran/quotes/calligraphy/wordmark.
7. **TypeScript strict** — `npx tsc --noEmit` must stay clean.

## Component library (`src/components`)

- `AppText` — props: `weight('light'|'regular'|'medium'|'semibold'|'bold')`, `size`,
  `color`, `amiri`, `center`, `lineHeight`, `tabular`.
- `PrimaryButton` / `GoldButton` — pill CTAs; props: `label onPress disabled withArrow shimmer height style`.
- `StarLogo(size,color,withDot,dotSize)` — 8-point star; `DiamondBullet(size,color,outline)`.
- `GlassChip(label|children,onPress,pill,softBorder)` — glass chip on dark heroes.
- `Card(padded,onPress)` / `ListCard` (children auto-separated) / `SelectableCard(selected,onPress,checkPosition)`
  / `IconChip(size,dark,gold)` / `SectionLabel` / `KickerLabel(label)`.
- `IOSToggle(value,onValueChange,goldWhenOn)` / `SegmentedControl(options,value,onChange,compact)`
  / `CheckCircle(checked,size)` / `ProgressBar(progress,height,…)`.
- Animation primitives (Reanimated, mirror the design keyframes):
  `FadeUp(delay)` = nUp entrance; `Floating(amplitude,duration,delay)` = nFloat;
  `Twinkle(size,duration,delay,style)` = nTwinkle; `Glow(duration)` = nGlow;
  `PulseRing(size,delay)` = nPulse; `Orbit(duration,reverse)`; `Shimmer(light)` = nShimmer.
- `RadialGlow(size,opacity,color,style)` — gold radial glow;
  `EmeraldRadialBackground(highlight,mid,dark,cy)` — full-bleed dark radial bg.
- `LanguageSuggestionSheet` — device-language popup (mounted at root).

## Navigation

`RootStackParamList` in `src/navigation/types.ts`. Setup flow:
`Splash → Onboarding → QuizGender → QuizAge → QuizGoals → QuizReligiosity →
AuthSignUp (skippable → guest) → TrialPaywall(source:'setup') → LocationSetup → Main`.
Progress is persisted as `useUserStore.flowStage`; Splash routes to the stage on cold
start. `TrialPaywall` is also presented as a full-screen modal by the gate
(`source:'gate'`). Pushed screens: Reminders, CustomsHolidays,
AdhkarReader{kind}, PrayerGuide{prayer}, SurahList, Profile, LanguagePicker,
SubscriptionPaywall.

## State

- `useUserStore` — flowStage, profile (guest/registered), quiz answers.
- `useSettingsStore` — language, languagePromptDismissed, appearance, location,
  calcMethod, madhhab, adhanSound, reminders (per-prayer toggles, preAlertMinutes…),
  quranFontScale.
- `useSubscriptionStore` — status none|trial|active|expired, plan, trialEndsAt,
  selectedPlan; `startTrial(plan)`; `useIsPremium()` selector.
- `useContentStore` — readDays, savedItemIds, bookmark, ward progress, adhkar completion.

## Services

- `usePrayerSchedule()` hook → `{ now, today: DayPrayerTimes, next: NextPrayerInfo, locationLabel, dayFor(offset) }`.
- `services/dates.ts` → `formatDualDate(date,t)` ("الخميس 17 محرّم 1448 هـ · 2 يوليو 2026"),
  `formatDualDateShort`, `formatRemainingShort(ms)` ("1:24"), `remainingParts(ms)`,
  `dateKey()`, `weekdayName`, `formatShortDate`.
- `services/prayerTimes.ts` → `formatTime(date)` ("16:24"), `PRAYER_ORDER`, `dayProgress`.
- `services/islamicEvents.ts` → `getUpcomingEvents()`, `getNextEvent()` (name via `t(event.nameKey)`).
- `services/currency.ts` → `getPlanPrices()` → localized `{monthly, yearly, yearlyPerMonth}`
  strings from USD base prices.
- `services/notifications.ts` → `rescheduleAll(...)` (already wired in App.tsx).

## Monetization rules (product)

USD base pricing displayed in local currency ($9.99/mo, $59.99/yr ≈ save 50%),
3-day free trial, mock purchase in `useSubscriptionStore.startTrial` (StoreKit/Play
Billing to be integrated later — keep the call sites clean).

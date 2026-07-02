# Handoff: Noor (نور) — Islamic Prayer & Daily Companion App

## Overview
A premium, subscription-based iOS mobile app for Muslim users: prayer times, smart reminders, daily Islamic content (hadith, sunnah, rulings), Quran reading, holidays/customs, and personalization. Full RTL Arabic UI. The design covers the complete flow: Splash → Onboarding (4 value screens) → Personalization quiz (4 screens) → Trial paywall → Location picker → Core app (Home, Prayer Times, Quran Reader, Customs & Holidays, Daily Content, Reminders) → Subscription paywall (free-vs-premium) → Settings.

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes showing the intended look, motion and behavior. They are NOT production code to copy directly. The task is to **recreate these designs in the target codebase's environment** (SwiftUI / React Native / Flutter — whichever the project uses; if none exists yet, choose the most appropriate mobile framework) using its established patterns. The iPhone bezel/status bar in the HTML (`ios-frame.jsx`) is a presentation frame only — do not implement it.

## Fidelity
**High-fidelity.** Colors, typography, spacing, radii, copy and animations are final intent. Recreate pixel-perfectly at 402×874pt reference size (iPhone), scaling naturally to other sizes.

## Critical Global Requirements
- **Full RTL layout**, `dir="rtl"`, Arabic content throughout. Numerals: Western digits (4:12, 19.90) for times/prices; Arabic-Indic (١٢٣) only for Quran verse markers.
- iOS-native feel: safe-area aware, min touch target 44pt.
- Light theme shown; Settings includes light/dark/auto appearance switch (dark theme to be derived from the same palette).

## Design Tokens

### Colors
| Token | Value | Use |
|---|---|---|
| emerald-900 | `#082A1F` | darkest bg (splash/paywall gradients) |
| emerald-800 (primary) | `#0D3528` | primary buttons, dark cards, tab active |
| emerald-700 | `#124534` | gradient partner of primary |
| emerald-600 | `#16503C` / `#1B5B44` | gradient highlights |
| gold-500 (accent) | `#C4A45F` | accents, progress, badges, CTAs |
| gold-300 | `#E8D9B4` | light gold (glows, icons on dark) |
| gold-100 | `#F0EAD9` | icon-chip bg on light |
| cream (bg) | `#F6F3EC` | app background |
| cream-tint | `#FBF7EE` | selected card bg |
| card | `#FFFFFF` | cards |
| ink | `#14231E` (headings) / `#1B2A23` (Quran text) / `#3E4E45` (body) | text |
| muted | `#66756B` | secondary text |
| faint | `#9AA79F` / `#C9D2CC` | tertiary text / chevrons |
| destructive | `#B05B4C` | logout |
| hairline | `rgba(13,53,40,0.06–0.10)` | borders/separators |

Common gradients:
- Dark hero/splash: `radial-gradient(120% 60% at 50% -5%, #1B5B44 0%, #0D3528 55%, #082A1F 100%)`
- Card/hero panel: `linear-gradient(160–180deg, #124534 0%, #0D3528 100%)`
- Gold CTA: `linear-gradient(135deg, #E8D9B4 0%, #C4A45F 100%)`
- Gold radial glow: `radial-gradient(circle, rgba(196,164,95,0.2–0.4) 0%, transparent ~65%)`

### Typography
- **UI font:** IBM Plex Sans Arabic (300–700). Fallback: system Arabic.
- **Quran / calligraphy / quotes:** Amiri (400/700).
- Scale: wordmark 64–96 (Amiri); screen title 25–28/700; hero clock 52/700 tabular; card title 15–17/600–700; body 14–16, line-height 1.7–1.9; captions 11–13; Quran body 23px Amiri, line-height 2.35, justified.

### Shape & Elevation
- Radii: cards 18–24; hero cards 22–24; bottom sheet top 38; pills/buttons 999 (pill); onboarding illustration arch `170px 170px 28px 28px`.
- Primary CTA: height 54–58, pill, bg emerald-800, text `#F5EEDC`, shadow `0 8–10px 24–28px rgba(13,53,40,0.25–0.3)`.
- Gold CTA (trial): gold gradient, text emerald-800, shadow `0 10px 30px rgba(196,164,95,0.35)`.
- Card border: `1px solid rgba(13,53,40,0.07)`; floating glass chips on dark: `rgba(246,243,236,0.10)` + `backdrop-blur(10px)` + border `rgba(232,217,180,0.35)`.
- iOS toggle: 50×30 track (on: emerald-800, off: `rgba(13,53,40,0.15)`), 25px white knob.

### Brand Motif
8-point star = two 45°-rotated overlapping square outlines in gold. Used as: logo mark (with center dot + glow), section bullets, twinkle particles. Skyline silhouette (dome + 2 minarets) in `#061E16` used subtly on onboarding screen 1.

## Screens (flow order)

1. **Splash (1a)** — dark radial emerald bg, gold radial glow; 8-point star logo (66px squares, center gold dot with `0 0 24px` glow); "نور" Amiri 64; tagline "رفيقك اليومي للصلاة والذِّكر"; 3 loading dots (gold, descending opacity).

2–5. **Onboarding ×4 (2a–2d)** — shared structure: full-bleed dark emerald animated hero; glass "تخطّي" (skip) chip top-left; **bottom sheet** (cream, radius 38 top, shadow `0 -20px 50px rgba(6,30,22,0.45)`) containing: gold star + kicker label, title 27/700 (2 lines), body 15.5 muted, progress (active segment 28×7 gold pill + 7px dots) + "n / 4" counter (LTR, nowrap), CTA pill with gold 44px circle arrow (←) and moving shimmer. Sheet content staggers in (see Animations).
   - **2a Prayer times:** gold arc (270×135, top-radius semicircle border) with sun dot traveling along it (rotating 260px arm, ±58°, 9s alternate); horizon hairline; dome+minaret silhouette; 3 floating glass time chips (الفجر 4:12 / الظهر 12:46 / المغرب 19:48) bobbing; twinkle diamonds. Kicker: "مواقيت دقيقة", title "كل مواقيتك في مكانٍ واحد".
   - **2b Smart reminders:** pulsing radar (3 rings scale .45→1.7 fade, 3.2s staggered 0/1.1/2.2s) around gold location-pin puck; two live notification cards (248px, white, real content "حان وقت العصر 16:24 · القدس" / "تذكير: أذكار المساء") cycling in/out (6.5s loop, offset 3.25s). Kicker "في الوقت تمامًا", title "تنبيهات ذكية تلائم يومك".
   - **2c Daily content:** fanned card stack — two translucent back cards slowly tilting, top white hadith card («إنما الأعمال بالنيات…», Amiri 18.5) floating with gold shimmer sweep; 3 floating glass tag chips (سُنن / أحكام ميسّرة / أذكار). Kicker "دقيقتان في اليوم", title "محتوى يومي قصير ونافع".
   - **2d Arabic experience:** "نور" Amiri 96 with breathing gold glow; 2 orbit rings (200px solid / 280px dashed) with orbiting gold diamond (14s) and dot (22s reverse); glass chips "بالعربية بالكامل" / "حسب مذهبك"; CTA is GOLD gradient ("لنبدأ") with emerald arrow circle. Kicker "صُنع لأجلك", title "تجربة عربية، شخصية ودقيقة".

6–9. **Quiz ×4 (1f–1i)** — cream bg; top progress bar (5px track `rgba(13,53,40,0.1)`, gold fill 25/50/75/100%) + "n / 4" (LTR nowrap); title 25/700 + helper text; selection cards: default white/hairline; selected `#FBF7EE` + `1.5px #C4A45F` border + gold shadow + 22px emerald check circle. Bottom CTA "متابعة" / "إنهاء الإعداد".
   - 1f gender (2-column cards رجل/امرأة with Amiri medallions), 1g age (6 stacked ranges, "25–34" selected), 1h goals multi-select (5 options, 3 selected), 1i religiosity (4 options with subtitles, "أسعى للالتزام أكثر" selected).

10. **Trial Paywall (1j)** — dark emerald; ✕ close top-left; star mark; gold badge "3 أيام مجانًا"; title "نور بريميوم"; 3 diamond-bullet benefits; plan cards: **yearly** (light card, gold border, floating badge "الأفضل قيمة · وفّر 50٪", "سنوي / 9.99 ₪ شهريًا فقط / 119.90 ₪ في السنة") + **monthly** (glass outline, 19.90 ₪); gold gradient CTA "ابدأ 3 أيام مجانًا"; reassurance line "بلا التزام — يمكنك الإلغاء في أي وقت"; footer links استعادة الشراء / الشروط / الخصوصية.

11. **Location (1k)** — title "أين أنت؟"; primary emerald card "استخدام موقعي الحالي (GPS)"; "أو اختر مدينة" divider; search field; city list (القدس ✓ selected, عمّان, القاهرة, إسطنبول, دبي with country subtitles); CTA "تأكيد الموقع".

12. **Home (1l)** — emerald header (radius 0 0 34 34): greeting "السلام عليكم / أحمد", location pill "القدس", bell with gold badge dot; dual date "الخميس 17 محرّم 1448 هـ · 2 يوليو 2026"; next-prayer hero ("الصلاة القادمة · العصر", 16:24 at 52px, countdown "متبقٍ 1 ساعة و24 دقيقة", mini sun-arc); 6-column times strip with العصر highlighted (gold tint chip). Body cards: **contextual reading card** (gold tint, "الآن: أذكار المساء" + button "ابدأ القراءة" — appears when a prayer/reading window is active); weekly reading card (سورة الكهف, progress bar 35%, "تابع"); hadith-of-day card (Amiri quote). Bottom tab bar (blurred cream): الرئيسية (active) / المواقيت / القرآن / المحتوى / الإعدادات.

13. **Prayer Times (1m)** — segmented أمس/اليوم/غدًا; date line; 6 rows (الفجر 4:12, الشروق 5:38 "ليست صلاة", الظهر 12:46, **العصر 16:24 — next: full emerald card, gold time, "القادمة · متبقٍ 1:24"**, المغرب 19:48, العشاء 21:18) each with icon chip, 20px tabular time, per-prayer notification toggle; extra strip منتصف الليل 12:00 / الثلث الأخير 1:56 / الضحى 6:05; footer "طريقة الحساب: أم القرى · المذهب: شافعي · تغيير".

14. **Quran Reader (1s)** — top bar: back circle, centered "سورة الكهف / الجزء 15 · الصفحة 293", bookmark + font-size (Aا) buttons; emerald ornament header: Amiri "سُورَةُ الكَهْف", "مكية · 110 آيات", bismillah in gold between hairlines; reading card: Amiri 23/2.35 justified, gold-circle Arabic-Indic verse markers (٢٧px), **current verse highlighted** `rgba(196,164,95,0.16)` rounded; bottom fade + progress chip "وردك اليومي: 12 / 110 آية"; audio player bar (emerald card): gold play circle, "تلاوة: مشاري راشد العفاسي", progress 2:41/6:03 (44%), chip "الآية ٣".

15. **Customs & Holidays (1n)** — hero emerald card: "المناسبة القادمة / المولد النبوي الشريف / 12 ربيع الأول 1448 هـ · 25 أغسطس 2026" + countdown ring "54 يومًا" + action chips; "سُنن هذا الأسبوع": gold-tinted card "اليوم الخميس — يُسنّ الصيام" + white card "غدًا الجمعة — سورة الكهف"; upcoming list (الإسراء والمعراج, رمضان, عيد الفطر with dates + day counts).

16. **Daily Content (1o)** — hero reading card: kicker "حديث اليوم", Amiri quote 23px («مَن سلك طريقًا يلتمس فيه علمًا…» رواه مسلم), divider, 15px explanation, tag chips; action row: "تمّت القراءة ✓" pill + save + share circles; "من الأيام السابقة" archive list with category chips (سُنّة/فضل/حُكم).

17. **Reminders (1p)** — grouped cards with iOS toggles: الصلوات (الأذان لكل صلاة ON highlighted row, تنبيه قبل الصلاة with 5/10/15 min segmented chips — 10 selected, تذكير الجمعة ON); الأذكار والقرآن (صباح 7:00 ON, مساء ON, ورد يومي 21:00 OFF); المناسبات (أعياد ON — "قبل 3 أيام", صيام الاثنين والخميس OFF).

18. **Subscription Paywall (1q)** — social proof (5 gold diamonds, "4.9 · أكثر من 12,000 تقييم"); title "افتح تجربة نور الكاملة"; **comparison table** (3 cols: feature / مجاني / بريميوم✦): basic times ✓/✓, smart reminders —/✓, full daily content —/✓, adhkar+Quran جزئي/✓, no ads —/✓; compact plan selector (yearly gold-bordered "وفّر 50٪" 9.99₪/mo, monthly 19.90₪); emerald CTA "ابدأ التجربة المجانية — 3 أيام"; trust line "بلا التزام · نذكّرك قبل انتهاء التجربة · إلغاء بنقرة واحدة".

19. **Settings (1r)** — emerald profile card (Amiri avatar "أ", أحمد محمود, badge "بريميوم ✦ / خطة سنوية"); groups: الصلاة (طريقة الحساب أم القرى, المذهب شافعي, الموقع القدس, صوت الأذان مكة المكرمة), عام (التذكيرات, اللغة العربية, المظهر segmented فاتح/داكن/تلقائي), الاشتراك (إدارة الاشتراك — يتجدد 2.7.2027, استعادة الشراء); destructive "تسجيل الخروج".

## Interactions & Behavior
- Onboarding: swipe/CTA advances; skip jumps to quiz; progress dots animate.
- Quiz: single-select (1f/1g/1i), multi-select (1h); CTA disabled until selection.
- Paywalls: plan cards toggle selection; trial CTA starts StoreKit purchase; close (✕) on trial paywall only after delay if desired.
- Home: contextual reading card appears only during active prayer/adhkar windows and deep-links into the reader; tapping time strip opens Prayer Times.
- Prayer times: per-prayer toggles persist; segmented day switcher.
- Quran reader: verse-level highlight follows audio; font-size button cycles sizes; bookmark persists position.
- Reminders: toggles + pre-alert offset (5/10/15 min) persist and schedule local notifications.

## Animations (keyframes, from the HTML)
All ambient loops, ease-in-out unless noted:
- `nUp` — entrance: translateY(26px)+fade → 0; 0.7s; staggered delays .05/.15/.28/.4/.5s (bottom-sheet content).
- `nFloat` / `nFloat2` — chips bobbing ±7–11px; 5–6.5s infinite, staggered delays.
- `nPulse` — radar ring: scale .45→1.7, opacity .9→0; 3.2s ease-out infinite, delays 0/1.1/2.2s.
- `nSun` — arc arm rotate −58°→58°; 9s infinite alternate.
- `nOrbit` / `nOrbitR` — 360° rotation; 14s / 22s linear infinite.
- `nTwinkle` — diamond particles: opacity .12→.95, scale .6→1.2 (kept at 45° rotation); 3.4–4.6s.
- `nGlow` — radial glow opacity .3→.85; 4.5–7s.
- `nCardBack`/`nCardBack2`/`nCardTop` — card-stack tilt/drift (±3° rotate, ±7px Y); 6–7s.
- `nNotif` — notification card: slide-up in (12→22%), hold (→78%), fade-up out (90→100%); 6.5s loop, second card offset 3.25s.
- `nShimmer` — light strip sweep across CTA/card: translateX(130%→−130%) skewX(−18°); 3.2–4.5s.

## State Management
- Onboarding/quiz answers: gender, ageRange, goals[], religiosityLevel → personalize content.
- Subscription: free | trial(endDate) | premium(plan, renewalDate).
- Location: city or GPS coords → prayer-time calculation (method: أم القرى default; madhhab: شافعي default — both editable).
- Prayer schedule: computed daily; nextPrayer + countdown ticking.
- Reminders: per-prayer bool, preAlertMinutes, adhkar/quran/occasion toggles.
- Quran: surah, verse position, daily-ward progress, audio state (reciter, time).
- Content: daily item + read/saved flags, archive.

## Assets
- No raster assets. Logo/star motif, arcs, radar, silhouettes are simple shapes (recreate in code or export as SVG).
- Fonts: Google Fonts — IBM Plex Sans Arabic, Amiri (both OFL-licensed).
- Sample data (dates, times, prices in ₪, hadith texts, Surat Al-Kahf verses 1–5) is real but illustrative.

## Files
- `Noor App Screens.dc.html` — all 19 screens (canvas layout; each screen is a `data-screen-label`-tagged block inside an iPhone frame). Animation keyframes are in the `<style>` block at the top.
- `ios-frame.jsx` — presentation-only iPhone bezel/status bar used by the HTML preview. Do not implement.

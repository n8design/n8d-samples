# NACS demo checklist: CSS Tips and Tricks for SPFx

**Solution:** `n8d-samples/2026/css-spfx-toolchain`
**Start:** `npm run start`, then open the demo page with `?debugManifestsFile=https://localhost:4321/temp/build/manifests.js&loadSPFX=true`

**Versions:** SPFx 1.23.2 · Node 22.22.0 · heft 1.2.17 · heft-sass-plugin 1.4.1 · Dart Sass (sass-embedded) 1.85.1 · TypeScript 5.8.3

**Status key:** ✅ checked in the build output · ⏳ needs a tenant test · ❌ claim is wrong, fix the slide

---

## Running demo: team card

| Slide | Web part | Show | Status |
|---|---|---|---|
| Before state | **01 Team card (before)** | `@import`, viewport media queries, column detection via `.CanvasSection-xl*` classes, px sizes, hardcoded Segoe, `[theme:]` tokens | ✅ build |
| After state | **02 Team card (after)** | Container query on the web part root, `cqi`/`clamp()`, `auto-fit` grid, prefixed `@property`, runtime theme tokens | ✅ build · ⏳ render |
| Side by side | 01 + 02 | Put both in a one-third column: 01 keeps the desktop layout, 02 adapts | ⏳ |

---

## Section 1: Heft and style processing

| Slide claim | Verdict | Correct statement | Demo |
|---|---|---|---|
| Sass config location | ✅ | `config/sass.json` extends the rig's `sass.json` | Show the file |
| `.module.scss` vs `.scss` | ❌ changed in 1.23 | **Every `.scss` is a CSS module** (typed + hashed). Only `*.global.scss` is global. In 1.22, plain `.scss` was typed but **not** hashed | **03 Probe** → `plainClass_xxxxxxxx` |
| Typings import style, new vs upgraded project | ✅ same | `import styles from './X.module.scss'`; typings go in `temp/sass-ts` | — |
| `@import` deprecation warnings | ❌ not visible | Sass 1.85 deprecates `@import`, but the default config **silences** it (`silenceDeprecations: [import, …]`), so the build stays quiet | Build log of 01 |
| `@use` / `@forward` work out of the box | ✅ | No extra config | 02 uses `@use` |
| Tilde imports | ⚠️ changed | Tilde still works at the **start** of an `@use`/`@import` line (rewritten to `pkg:`). It **fails** in `meta.load-css()` or a nested `@import` | **03 Probe** table |
| Bare / `node_modules/` package paths | ❌ new break | `@use '@scope/pkg/…'` and `'node_modules/…'` **no longer compile** (they worked in 1.22). **Use `pkg:` everywhere** | **03 Probe** table |
| `:global` | ✅ | Still works | 03 Probe (border via `.CanvasSection`) |
| **Key claim:** custom properties, `@property` and container names are not hashed | ✅ build | Only classes and `@keyframes` are hashed. The real risk is `@property` (registered for the whole page) and `:root`. Container names are **harmless**, because they only match ancestors | **04a + 04b** |

### Package import forms (heft-sass-plugin 1.4.1)

| Form | 1.22.x | 1.23.2 |
|---|---|---|
| `@use '~pkg/…'` / `@import '~pkg/…'` at line start | ✅ | ✅ (rewritten to `pkg:`) |
| `@use 'pkg:pkg/…'` | ❌ | ✅ |
| `meta.load-css('pkg:pkg/…')` | ❌ | ✅ |
| `@use '@scope/pkg/…'` (bare) | ✅ | ❌ |
| `@use 'node_modules/@scope/pkg/…'` | ✅ | ❌ |
| `meta.load-css('~pkg/…')` | ✅ | ❌ "Unexpected tilde" |
| `.x { @import '~…'; }` (nested) | ✅ | ❌ "Unexpected tilde" |

### Collision demo, expected results (⏳ tenant)

| Setup | A shows | B shows |
|---|---|---|
| A alone, shared names | **lime** (`inherits:false` blocks the `:root` value) | — |
| B alone, shared names | — | blue |
| A + B, shared names | **lime** | **lime** (A's registration also kills B's fallback) |
| A + B, prefixed toggle on | red | blue |

---

## Section 2: Container queries

| Slide claim | Verdict | Demo |
|---|---|---|
| `@container`, named and range syntax, survives the build | ✅ | 02 |
| `cqi` / `cqb` units survive the build | ✅ | 02, 05, 07 |
| Works in a one-third column, a vertical section and a full-width section | ⏳ | 02 in each layout |
| Containment on the root causes no collapse | ⏳ | 02 |
| Full-width detection by size alone, no DOM sniffing | ✅ code · ⏳ render | 02 `@container n8d-team-card (inline-size >= 60rem)` vs 01 canvas sniffing |
| Media queries that stay: `hover`, `prefers-reduced-motion`, `forced-colors` | ✅ | 02 |
| Teams tab / Viva Connections | ⏳ | Manifest allows Teams hosts; test if available |

---

## Section 3: `@property`

| Slide claim | Verdict | Demo |
|---|---|---|
| Survives Sass and bundling unchanged | ✅ | All |
| Animated theme colour; the version without `@property` snaps | ✅ build · ⏳ visual | **05** panel 1 (toggle button) |
| `inherits: false` as a barrier | ⏳ | **05** panel 2 |
| `initial-value` as fallback for a missing theme slot | ⏳ | **05** panel 3 |
| Graceful degradation | ⏳ | **05** panel 4 |
| Needs prefixing | ✅ **yes, mandatory** | 04a/04b, plus `2025/brandcenter/.../_css-properties.scss` (57 unprefixed SharePoint slot names, `initial-value: lime`) |

---

## Section 4: Column layout

| Slide claim | Verdict | Demo |
|---|---|---|
| `repeat(auto-fit, minmax(min(100%, …), 1fr))`, `clamp()`, `min()` survive | ✅ | 02 |
| Measured section padding and column gaps | ⏳ | Measure with DevTools on the demo page |
| Negative-margin hacks in existing code | ✅ none on web part roots | — |
| Before uses DOM sniffing, after uses intrinsic layout | ✅ | 01 vs 02 |
| px breaks zoom and user font settings | ⏳ no evidence yet | Zoom to 200% on 01 vs 02 |

---

## Section 5: Fonts and theming

| Slide claim | Verdict | Demo |
|---|---|---|
| Runtime theme object (`ThemeProvider`, `onThemeChanged`) | ✅ | 02, 05 (`onThemeChanged`), 06, 07 (`ThemeProvider`) |
| Legacy `[theme:slot, default:]` still works | ✅ build · ⏳ render | 01 |
| **New gotcha:** a `[theme:]` token inside a shorthand is deleted | ✅ | 01: `border: 1px solid "[theme:…]"` ships as `border:1px solid` |
| Map the theme onto custom properties on the root once | ✅ | `src/common/ThemeService.ts` |
| Section background change repaints the web part | ⏳ | **06**: switch Neutral / Soft / Strong |
| Brand Center font reachable at runtime | ⏳ **open question** | **07** diagnostics: `--fontFamilyBase` on body/root, `tryGetThemeV2().fontFamilyBase` |
| Live Brand Center font change, no code change | ⏳ | 07 + 02 |
| `Get-SPOTheme` payload | ⏳ | Theme JSON in the repo has **no font keys** |

---

## Cut from the outline or rewrite

- ❌ "Plain `.scss` vs `.module.scss` is only about hashing." In 1.23, both are modules.
- ❌ "You'll see `@import` deprecation warnings." They're silenced by default.
- ❌ "PostCSS mangles container queries." It doesn't.
- ⚠️ "Tilde imports changed." Rewrite as: **bare and `node_modules/` paths broke; use `pkg:`**.
- ⚠️ "Container names collide." They don't in practice; `@property` and `:root` do.

## Not in the outline, worth a slot

1. The `pkg:` import breaking change (affects hTWOo `load-css` users).
2. `@property` registration is page-wide and disables `var()` fallbacks (brandcenter code as the real example).
3. cssnano deletes `[theme:]` tokens inside shorthands.
4. Relative colour syntax for section backgrounds: `rgb(from var(--bodyBackground) r g b / 60%)` (06).
5. `tryGetThemeV2()` (Fluent v9 theme) as the typed source for fonts.

## Blog follow-ups (n8d.at)

- Tilde post: add the 1.23 `pkg:` change and the forms that now fail.
- hTWOo docs: replace `meta.load-css('node_modules/@n8d/…')` / `'@n8d/…'` with `pkg:@n8d/…`.
- Theming posts: the shorthand-token gotcha, and that fonts are missing from the theme object.

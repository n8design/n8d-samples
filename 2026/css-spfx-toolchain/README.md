# css-spfx-toolchain

Demo solution for the NACS session **CSS Tips and Tricks for SPFx: What the New Toolchain Changes for Your Styling**.
One web part per section, so a failure in one demo doesn't take down the others.

## Versions

| Tool | Version |
|---|---|
| SPFx (`@microsoft/generator-sharepoint`) | 1.23.2 |
| Node | 22.22.0 (engines: `>=22.14.0 <23`) |
| `@rushstack/heft` | 1.2.17 |
| `@rushstack/heft-sass-plugin` | 1.4.1 |
| `sass-embedded` (Dart Sass) | 1.85.1 |
| `@microsoft/sp-css-loader` | 1.23.2 (cssnano 5.1.15, autoprefixer 10, postcss-modules-* ) |
| TypeScript | 5.8.3 |

Scaffolded with `yo @microsoft/sharepoint` 1.23.2, no framework. `config/sass.json` is untouched from the scaffold.
Watch out: a globally installed beta generator wins over `npx -p @microsoft/generator-sharepoint@x`; run the generator by path.

```
npm install
npm run build   # heft test --production + package-solution -> sharepoint/solution/*.sppkg
npm run start   # hosted workbench
```

## Web parts

| Toolbox title | Folder | Session section | Ported from |
|---|---|---|---|
| 01 Team card (before) | `teamCardBefore` | Running demo, before | `2025/workshop` atoms, molecules, `_base-grid-config.scss` |
| 02 Team card (after) | `teamCardAfter` | Running demo, after | `master-the-grid/webparts/.../_03-container-queries.scss`, `2025/brandcenter` ThemeService |
| 03 SCSS pipeline probe | `scssPipelineProbe` | 1 Heft and Sass | new |
| 04a / 04b Token collision | `tokenCollisionA`, `tokenCollisionB` | 1 key claim, 3 | pattern from `2025/brandcenter/.../_css-properties.scss` |
| 05 @property in SharePoint | `propertyAnimation` | 3 `@property` | new |
| 06 Theme and section background | `themeBackground` | 5 Theming | `2025/brandcenter` BrandColors and BrandCenterShowcase |
| 07 Brand Center fonts | `brandFonts` | 5 Fonts | `2025/workshop` ResponsiveTypography, `2025/brandcenter` typography slots |

Shared code is in `src/common`: `teamCard.ts`, `ThemeService.ts`, `collisionDemo.ts`, `styles/_tokens.scss` and `styles/_legacy-grid.scss`.

## Build-verified behaviour (SPFx 1.23.2)

All of the following was observed in this project's build output (`temp/sass-ts`, `lib`, `dist`), not taken from documentation.

### Config defaults
The rig's `sass.json` (`@microsoft/spfx-web-build-rig/profiles/default/config/sass.json`):
- `fileExtensions: [.sass, .scss, .css]`
- `nonModuleFileExtensions: [.global.*]`
- `silenceDeprecations: [mixed-decls, import, global-builtin, color-functions]`
- `preserveIcssExports`, `doNotTrimOriginalFileExtension` and `sourceMap` are all set.

### Module vs global
Every `.scss` file is a CSS module, including plain `X.scss`, which gets both typings and hashed class names. Only `*.global.scss` stays global; its typing is `export {}`, so you import it for side effects only.

This changed from SPFx 1.22. There, webpack hashed only `.module.*` files, so a plain `.scss` file got typings but its classes stayed global at runtime.

### Typings
Typings use `import styles from './X.module.scss'` and are generated into `temp/sass-ts`.

### `@import` deprecation
Sass 1.85 deprecates `@import`, but the default config prints no warning because the rig silences it. TeamCardBefore uses `@import` and builds silently.

### Package imports
Handled by heft-sass-plugin 1.4.1:

| Form | Compiles |
|---|---|
| `@use '~@scope/pkg/file'` / `@import '~…'` at line start (rewritten to `pkg:`) | yes |
| `@use 'pkg:@scope/pkg/file'` | yes |
| `meta.load-css('pkg:@scope/pkg/file')` | yes |
| `@use '@scope/pkg/file'` (bare) | **no**. It worked in 1.22. |
| `@use 'node_modules/@scope/pkg/file'` | **no** |
| `meta.load-css('~@scope/pkg/file')` | **no** ("Unexpected tilde") |
| `.x { @import '~…'; }` (nested) | **no** ("Unexpected tilde") |

**Recommendation:** use `pkg:` everywhere. This affects hTWOo users who write `meta.load-css('@n8d/htwoo-core/…')` or `'node_modules/@n8d/…'`.

### What CSS modules rename
Only class names and `@keyframes` names get a hash. Custom properties, `@property`, `:root` and `container-name` reach the bundle unchanged. `:global(...)` still works.

### What survives cssnano
`@container` (named and range syntax), `cqi`/`cqb`, `clamp()`/`min()`, `repeat(auto-fit, minmax(...))`, transitions on registered properties, and the `hover`, `prefers-reduced-motion` and `forced-colors` media queries.

### Legacy `"[theme:slot, default:…]"` tokens
These still pass through to `load-themed-styles` at runtime, with one **gotcha**: cssnano drops a token inside a shorthand. `border: 1px solid "[theme:…]"` ships as `border:1px solid` with no warning. Longhands survive.

## Tenant test checklist (not yet run)

Record the tenant and date for each result.

- [ ] **Collision**: add 04a and 04b to one page in "shared names" mode. Expected:
  - A alone: lime (its own `inherits:false` blocks `:root`)
  - B alone: blue
  - Both: both lime
  - Prefixed mode: red and blue

  Also check whether any SharePoint UI changes.
- [ ] **Container queries**: put 01 and 02 in a one-third column, a two-thirds column, a vertical section and a full-width section. Only 02 should adapt per column.
- [ ] **Containment**: confirm `container-type: inline-size` on the root causes no collapse inside the canvas.
- [ ] **@property**: check every panel in 05. Toggle theme state (registered interpolates, unregistered snaps), and check with reduced motion turned on.
- [ ] **Section backgrounds**: switch 06 between section background variants (Neutral, Soft, Strong) and check that it repaints without a reload.
- [ ] **Brand Center fonts**: does `--fontFamilyBase` arrive on `<body>` and on the web part root? Is `tryGetThemeV2().fontFamilyBase` set? Change the Brand Center font and reload.
- [ ] **Theme payload**: compare with `Get-SPOTheme`.
- [ ] **Teams and Viva**: test the same web parts in a Teams tab, if available.

// Map the runtime theme onto custom properties on the web part root, once.
// Ported from n8d-samples/2025/brandcenter/src/services/ThemeService.ts
// (trimmed to plain functions; the ServiceKey wrapper added nothing here).

import type { IReadonlyTheme } from '@microsoft/sp-component-base';

export type ThemeSlots = { [key: string]: string };

export function getThemeSlots(theme: IReadonlyTheme | undefined): ThemeSlots {
  const slots: ThemeSlots = {};
  if (!theme) {
    return slots;
  }
  const sources = [theme.semanticColors, theme.palette] as (ThemeSlots | undefined)[];
  sources.forEach(source => {
    if (source) {
      Object.keys(source).forEach(key => {
        if (source[key]) {
          slots[key] = source[key];
        }
      });
    }
  });
  return slots;
}

// Apply to the element only - never :root, so two web parts in differently
// themed sections (section background variants) keep their own values.
export function applyThemeSlots(element: HTMLElement, theme: IReadonlyTheme | undefined): ThemeSlots {
  const slots = getThemeSlots(theme);
  Object.keys(slots).forEach(key => element.style.setProperty(`--${key}`, slots[key]));
  return slots;
}

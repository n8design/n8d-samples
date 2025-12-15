/**
 * Theme CSS Variable Injector
 * Manually applies theme colors as CSS custom properties to bypass SharePoint ThemeProvider limitations
 */

export interface IThemeVariables {
  [key: string]: string;
}

export interface IThemeJson {
  [key: string]: string;
}

export class ThemeCSSInjector {
  private static _instance: ThemeCSSInjector;
  private _styleElement: HTMLStyleElement | null = null;

  public static getInstance(): ThemeCSSInjector {
    if (!ThemeCSSInjector._instance) {
      ThemeCSSInjector._instance = new ThemeCSSInjector();
    }
    return ThemeCSSInjector._instance;
  }

  /**
   * Inject theme CSS variables into the web part
   * @param element - The web part container element
   * @param themeJson - The theme JSON object
   */
  public injectThemeVariables(element: HTMLElement, themeJson: IThemeJson): void {
    console.log('🎨 Injecting theme CSS variables:', themeJson);

    // Create CSS custom properties from theme JSON
    const cssVariables = this.convertThemeJsonToCSSVariables(themeJson);
    
    // Apply CSS variables directly to the web part element
    this.applyCSSVariables(element, cssVariables);
  }

  /**
   * Convert theme JSON to CSS custom properties
   * @param themeJson - The theme JSON object
   * @returns CSS variables object
   */
  private convertThemeJsonToCSSVariables(themeJson: IThemeJson): IThemeVariables {
    const cssVars: IThemeVariables = {};

    // Map theme properties to CSS variables
    const themeMapping = {
      // Primary colors
      'themePrimary': '--themePrimary',
      'themeDark': '--themeDark',
      'themeDarker': '--themeDarker',
      'themeLight': '--themeLight',
      'themeLighter': '--themeLighter',
      'themeLighterAlt': '--themeLighterAlt',
      'themeSecondary': '--themeSecondary',
      'themeTertiary': '--themeTertiary',
      
      // Neutral colors
      'neutralPrimary': '--neutralPrimary',
      'neutralPrimaryAlt': '--neutralPrimaryAlt',
      'neutralDark': '--neutralDark',
      'neutralSecondary': '--neutralSecondary',
      'neutralSecondaryAlt': '--neutralSecondaryAlt',
      'neutralTertiary': '--neutralTertiary',
      'neutralTertiaryAlt': '--neutralTertiaryAlt',
      'neutralQuaternary': '--neutralQuaternary',
      'neutralQuaternaryAlt': '--neutralQuaternaryAlt',
      'neutralLight': '--neutralLight',
      'neutralLighter': '--neutralLighter',
      'neutralLighterAlt': '--neutralLighterAlt',
      
      // Semantic colors
      'white': '--white',
      'black': '--black',
      'accent': '--accent',
      
      // Custom colors
      'primaryColor': '--primaryColor',
      'backgroundColor': '--backgroundColor',
      'foregroundColor': '--foregroundColor'
    };

    // Convert theme properties to CSS variables
    Object.entries(themeMapping).forEach(([themeKey, cssVar]) => {
      if (themeJson[themeKey]) {
        cssVars[cssVar] = themeJson[themeKey];
      }
    });

    return cssVars;
  }

  /**
   * Apply CSS variables to an element
   * @param element - Target element
   * @param cssVariables - CSS variables to apply
   */
  private applyCSSVariables(element: HTMLElement, cssVariables: IThemeVariables): void {
    Object.entries(cssVariables).forEach(([property, value]) => {
      element.style.setProperty(property, value);
    });

    console.log('✅ Applied CSS variables:', Object.keys(cssVariables).length, 'variables');
  }

  /**
   * Remove all injected theme variables
   * @param element - The web part container element
   */
  public removeThemeVariables(element: HTMLElement): void {
    // Remove CSS custom properties
    Array.from(element.style).forEach(property => {
      if (property.startsWith('--theme') || property.startsWith('--neutral') || property.startsWith('--primary')) {
        element.style.removeProperty(property);
      }
    });

    console.log('🗑️ Removed theme CSS variables');
  }

  /**
   * Get current CSS variables from element
   * @param element - Target element
   * @returns Object with current CSS variables
   */
  public getCurrentCSSVariables(element: HTMLElement): IThemeVariables {
    const cssVars: IThemeVariables = {};
    const computedStyles = getComputedStyle(element);
    
    Array.from(element.style).forEach(property => {
      if (property.startsWith('--')) {
        cssVars[property] = computedStyles.getPropertyValue(property).trim();
      }
    });

    return cssVars;
  }
}
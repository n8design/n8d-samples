import { ServiceScope, ServiceKey } from '@microsoft/sp-core-library';
import { ThemeProvider, IReadonlyTheme } from '@microsoft/sp-component-base';

// Declare global window interface for themeState
declare global {
  interface Window {
    __themeState__: {
      theme: { [key: string]: string };
    };
  }
}

export interface IThemeService {
  initialize(serviceScope: ServiceScope): void;
  registerCSSVariables(element: HTMLElement, themeVariant?: IReadonlyTheme): void;
  refreshTheme(): void;
  getThemeColors(themeVariant?: IReadonlyTheme): { [key: string]: string };
  getPaletteColors(themeVariant?: IReadonlyTheme): { [key: string]: string };
  getSemanticColors(themeVariant?: IReadonlyTheme): { [key: string]: string };
}

export class ThemeService implements IThemeService {
  public static readonly serviceKey: ServiceKey<IThemeService> = ServiceKey.create<IThemeService>('BrandCenter:ThemeService', ThemeService);

  private _themeProvider: ThemeProvider;
  private _isInitialized: boolean = false;

  public initialize(serviceScope: ServiceScope): void {
    if (this._isInitialized) {
      return;
    }

    // Consume the ThemeProvider service
    this._themeProvider = serviceScope.consume(ThemeProvider.serviceKey);
    
    console.debug('ThemeService initialized');
    
    this._isInitialized = true;
  }

  public registerCSSVariables(element: HTMLElement, themeVariant?: IReadonlyTheme): void {
    if (!this._isInitialized) {
      throw new Error('ThemeService must be initialized before registering CSS variables');
    }

    // Get all theme colors using provided theme variant
    const allColors = this.getThemeColors(themeVariant);
    
    // Apply only to specific element - no global :root scope
    this._applyElementCSSVariables(element, allColors);
  }

  public refreshTheme(): void {
    if (!this._isInitialized) {
      throw new Error('ThemeService must be initialized before refreshing theme');
    }

    console.debug('Refreshing theme - note: CSS variables are scoped to web part instances only, not global :root');
    
    // Note: refreshTheme only logs the refresh action
    // CSS variables will be applied when registerCSSVariables is called with specific elements
  }

  public getThemeColors(themeVariant?: IReadonlyTheme): { [key: string]: string } {
    const colors: { [key: string]: string } = {};
    
    // Use provided theme variant or try to get fresh one
    const currentThemeVariant = themeVariant || (this._themeProvider ? this._themeProvider.tryGetTheme() : undefined);
    
    // Try to get colors from theme variant first
    if (currentThemeVariant) {
      console.debug('Using theme variant for colors:', currentThemeVariant);
      
      // Add semantic colors
      const semanticColors = this.getSemanticColors(currentThemeVariant);
      const semanticKeys = Object.keys(semanticColors);
      for (let i = 0; i < semanticKeys.length; i++) {
        const key = semanticKeys[i];
        colors[key] = semanticColors[key];
      }
      
      // Add palette colors
      const paletteColors = this.getPaletteColors(currentThemeVariant);
      const paletteKeys = Object.keys(paletteColors);
      for (let i = 0; i < paletteKeys.length; i++) {
        const key = paletteKeys[i];
        colors[key] = paletteColors[key];
      }
    } else if (window.__themeState__ && window.__themeState__.theme) {
      // Fallback to global theme state
      console.debug("THEME STATE USED as fallback");
      const themeKeys = Object.keys(window.__themeState__.theme);
      for (let i = 0; i < themeKeys.length; i++) {
        const key = themeKeys[i];
        colors[key] = window.__themeState__.theme[key];
      }
    }
    
    return colors;
  }

  public getPaletteColors(themeVariant?: IReadonlyTheme): { [key: string]: string } {
    // Use provided theme variant or try to get fresh one
    const currentThemeVariant = themeVariant || (this._themeProvider ? this._themeProvider.tryGetTheme() : undefined);
    
    if (currentThemeVariant && currentThemeVariant.palette) {
      return currentThemeVariant.palette as { [key: string]: string };
    }
    return {};
  }

  public getSemanticColors(themeVariant?: IReadonlyTheme): { [key: string]: string } {
    // Use provided theme variant or try to get fresh one
    const currentThemeVariant = themeVariant || (this._themeProvider ? this._themeProvider.tryGetTheme() : undefined);
    
    if (currentThemeVariant && currentThemeVariant.semanticColors) {
      return currentThemeVariant.semanticColors as { [key: string]: string };
    }
    return {};
  }

  private _applyElementCSSVariables(element: HTMLElement, colors: { [key: string]: string }): void {
    const colorKeys = Object.keys(colors);
    for (let i = 0; i < colorKeys.length; i++) {
      const key = colorKeys[i];
      const value = colors[key];
      if (value) {
        element.style.setProperty(`--${key}`, value);
      }
    }
    console.debug('Element CSS variables applied to:', element.tagName, Object.keys(colors).length, 'properties');
  }
}

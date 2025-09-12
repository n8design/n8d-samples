import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  ThemeProvider,
  ThemeChangedEventArgs,
  IReadonlyTheme
} from '@microsoft/sp-component-base';
import { ThemeService, IThemeService } from '../../services/ThemeService';
import { ColorRamp } from './components/ColorRamp';

import styles from './BrandColorsWebPart.module.scss';

export interface IBrandColorsWebPartProps {
}

export default class BrandColorsWebPart extends BaseClientSideWebPart<IBrandColorsWebPartProps> {
  private _themeService: IThemeService;
  private _themeProvider: ThemeProvider;
  private _themeVariant: IReadonlyTheme | undefined;

  public render(): void {
    console.log('BrandColorsWebPart render() called');
    console.log('Current theme variant:', this._themeVariant);
    
    // Always refresh theme to get latest values (no caching)
    if (this._themeService && this._themeVariant) {
      this._themeService.refreshTheme();
      // Re-register CSS variables scoped to this web part instance using our theme variant
      this._themeService.registerCSSVariables(this.domElement, this._themeVariant);
    }
    
    // Get palette colors using our theme variant context
    const paletteColors = this._themeService && this._themeVariant ? 
      this._themeService.getPaletteColors(this._themeVariant) : 
      (this._themeVariant?.palette as { [key: string]: string } || {});
    
    console.debug('Palette colors for ColorRamp:', paletteColors);
    console.debug('Theme Primary from palette:', paletteColors.themePrimary);
    console.debug('Theme Primary from variant:', this._themeVariant?.palette?.themePrimary);
    
    // Clear the container
    this.domElement.innerHTML = '';
    
    // Create and render the color ramp (now includes all hTWOo colors)
    const colorRamp = new ColorRamp();
    colorRamp.render(this.domElement, paletteColors);
  }

  protected onInit(): Promise<void> {

    this.domElement.classList.add(styles.brandColors);
    console.log('BrandColorsWebPart onInit() called');
    
    try {
      // Consume the new ThemeProvider service
      this._themeProvider = this.context.serviceScope.consume(ThemeProvider.serviceKey);

      // If it exists, get the theme variant
      this._themeVariant = this._themeProvider.tryGetTheme();

      // Register a handler to be notified if the theme variant changes
      this._themeProvider.themeChangedEvent.add(this, this._handleThemeChangedEvent);

      // Initialize the theme service
      this._themeService = this.context.serviceScope.consume(ThemeService.serviceKey);
      this._themeService.initialize(this.context.serviceScope);
      
      // Register CSS variables scoped to this web part instance with our theme variant
      if (this._themeVariant) {
        this._themeService.registerCSSVariables(this.domElement, this._themeVariant);
      }
      
      // Debug output using theme variant context
      console.debug('Theme variant:', this._themeVariant);
      console.debug('Theme colors available:', this._themeService.getThemeColors(this._themeVariant));
      console.debug('Palette colors:', this._themeService.getPaletteColors(this._themeVariant));
      console.debug('Semantic colors:', this._themeService.getSemanticColors(this._themeVariant));
    } catch (error) {
      console.error('Error initializing theme services:', error);
    }

    return super.onInit().then(() => {
      console.log('onInit completed, calling render()');
      // Re-render after theme services are initialized
      this.render();
    });
  }

  /**
   * Update the current theme variant reference and re-render.
   *
   * @param args The new theme
   */
  private _handleThemeChangedEvent(args: ThemeChangedEventArgs): void {
    console.log('Theme changed event received:', args.theme);
    this._themeVariant = args.theme;
    this.render();
  }

  protected onDispose(): void {
    // Clean up theme change event handler
    if (this._themeProvider) {
      this._themeProvider.themeChangedEvent.remove(this, this._handleThemeChangedEvent);
    }
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}

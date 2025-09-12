import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  ThemeProvider,
  ThemeChangedEventArgs,
  IReadonlyTheme
} from '@microsoft/sp-component-base';
import { ThemeService, IThemeService } from '../../services/ThemeService';

import styles from './BrandCenterShowcaseWebPart.module.scss';

export interface IBrandCenterShowcaseWebPartProps {
}

export default class BrandCenterShowcaseWebPart extends BaseClientSideWebPart<IBrandCenterShowcaseWebPartProps> {
  private _themeService: IThemeService;
  private _themeProvider: ThemeProvider;
  private _themeVariant: IReadonlyTheme | undefined;

  public render(): void {
    console.log('BrandCenterShowcaseWebPart render() called');
    console.log('Current theme variant:', this._themeVariant);

    // Always refresh theme to get latest values (no caching)
    if (this._themeService && this._themeVariant) {
      this._themeService.refreshTheme();
      // Re-register CSS variables scoped to this web part instance using our theme variant
      this._themeService.registerCSSVariables(this.domElement, this._themeVariant);
    }

    this.domElement.innerHTML = `<div class="${styles.brandCenterShowcase}">
    <div class="${styles.gradient}"></div>
    <div class="${styles.semiTransparent}">Hello world</div>
    </div>`;
  }

  protected onInit(): Promise<void> {
    this.domElement.classList.add(styles.brandCenterShowcase);
    console.log('BrandCenterShowcaseWebPart onInit() called');

    try {
      // Consume the new ThemeProvider service
      this._themeProvider = this.context.serviceScope.consume(ThemeProvider.serviceKey);

      // If it exists, get the theme variant
      this._themeVariant = this._themeProvider.tryGetTheme();
      console.debug("V2::::", this._themeProvider.tryGetThemeV2())

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

    this._themeProvider.themeChangedEvent.add(this, this._handleThemeChangedEvent);

    return super.onInit().then(() => {
      console.log('onInit completed, calling render()');
      // Re-render after theme services are initialized
      this.render();
    });
  }

  private _handleThemeChangedEvent(args: ThemeChangedEventArgs): void {
    this._themeVariant = args.theme;
    this.render(); // Re-render the web part to apply new theme
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}

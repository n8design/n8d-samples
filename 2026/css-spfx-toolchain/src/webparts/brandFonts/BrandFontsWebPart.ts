import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { ThemeProvider } from '@microsoft/sp-component-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './BrandFontsWebPart.module.scss';

export interface IBrandFontsWebPartProps {}

interface IBrandCenterConfig {
  BrandFontLibraryUrl?: { DecodedUrl: string };
  IsPublicCdnEnabled?: boolean;
  IsBrandCenterSiteFeatureEnabled?: boolean;
}

// Variables SharePoint *may* inject on the page. This web part never sets them -
// the diagnostics panel shows whether they actually arrive.
const FONT_VARIABLES = [
  '--fontFamilyBase',
  '--fontFamilyMonospace',
  '--fontFamilyNumeric',
  '--fontFamilyCustomFont100',
  '--fontFamilyCustomFont200',
  '--fontFamilyCustomFont300',
  '--fontFamilyCustomFont400',
  '--fontFamilyCustomFont500'
];

const SLOTS = [100, 200, 300, 400, 500];

// Section 5: is the Brand Center font reachable from a web part at runtime?
// Answers it on the page instead of assuming. Fetch pattern ported from
// n8d-samples/2025/workshop/src/webparts/responsiveTypography; slot CSS from
// n8d-samples/2025/brandcenter/src/webparts/typography/_base-font-slot.scss.
export default class BrandFontsWebPart extends BaseClientSideWebPart<IBrandFontsWebPartProps> {

  private _themeProvider: ThemeProvider | undefined;
  private _config: IBrandCenterConfig | string = 'loading...';

  protected onInit(): Promise<void> {
    this._themeProvider = this.context.serviceScope.consume(ThemeProvider.serviceKey);
    this._themeProvider.themeChangedEvent.add(this, this._handleThemeChangedEvent);

    this._fetchBrandCenterConfig().then(
      config => { this._config = config; this.render(); },
      (error: Error) => { this._config = `not available (${error.message})`; this.render(); }
    );
    return super.onInit();
  }

  public render(): void {
    const theme = this._themeProvider?.tryGetTheme();
    const themeV2 = this._themeProvider?.tryGetThemeV2();

    this.domElement.innerHTML = `
      <section class="${styles.brandFonts}">
        <div class="${styles.samples}">
          ${SLOTS.map(slot => `
            <p class="${styles.sample}" style="font-family:var(--fontFamilyCustomFont${slot}, var(--fontFamilyBase))">
              <span>Slot ${slot}</span> The quick brown fox jumps over the lazy dog</p>`).join('')}
        </div>

        <h4>Diagnostics</h4>
        <table>
          <tbody>
            <tr><th>Font actually used by this web part</th><td><code data-used></code></td></tr>
            <tr><th>ThemeProvider.tryGetTheme().fonts.medium.fontFamily</th>
              <td><code>${escape(theme?.fonts?.medium?.fontFamily || 'undefined')}</code></td></tr>
            <tr><th>ThemeProvider.tryGetThemeV2().fontFamilyBase</th>
              <td><code>${escape(themeV2?.fontFamilyBase || 'undefined')}</code></td></tr>
            <tr><th>Brand Center font library</th><td><code>${escape(this._describeConfig())}</code></td></tr>
          </tbody>
        </table>
        <table>
          <thead><tr><th>Variable</th><th>on &lt;body&gt;</th><th>on web part root</th></tr></thead>
          <tbody data-variables></tbody>
        </table>
      </section>`;

    // Computed values only exist after the element is in the document.
    const body = getComputedStyle(document.body);
    const root = getComputedStyle(this.domElement);
    (this.domElement.querySelector('[data-used]') as HTMLElement).textContent = root.fontFamily;
    (this.domElement.querySelector('[data-variables]') as HTMLElement).innerHTML = FONT_VARIABLES.map(name => `
      <tr><td><code>${name}</code></td>
        <td><code>${escape(body.getPropertyValue(name).trim() || 'unset')}</code></td>
        <td><code>${escape(root.getPropertyValue(name).trim() || 'unset')}</code></td></tr>`).join('');
  }

  private async _fetchBrandCenterConfig(): Promise<IBrandCenterConfig> {
    const response = await fetch(`${this.context.pageContext.web.absoluteUrl}/_api/SP.BrandCenter/Configuration`, {
      headers: { 'Accept': 'application/json;odata=nometadata' }
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
  }

  private _describeConfig(): string {
    if (typeof this._config === 'string') {
      return this._config;
    }
    const url = this._config.BrandFontLibraryUrl?.DecodedUrl || 'no font library';
    return `${url} (public CDN: ${this._config.IsPublicCdnEnabled ? 'on' : 'off'})`;
  }

  // Brand Center font changes reach the page as a theme change.
  private _handleThemeChangedEvent(): void {
    this.render();
  }

  protected onDispose(): void {
    this._themeProvider?.themeChangedEvent.remove(this, this._handleThemeChangedEvent);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}

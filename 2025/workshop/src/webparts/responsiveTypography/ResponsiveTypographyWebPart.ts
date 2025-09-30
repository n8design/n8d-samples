import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import styles from './ResponsiveTypographyWebPart.module.scss';

export interface IResponsiveTypographyWebPartProps {
}

export default class ResponsiveTypographyWebPart extends BaseClientSideWebPart<IResponsiveTypographyWebPartProps> {

  private _fontBaseUrl: string | null = null;
  private _fontBaseUrlCdn: string | null = null;

  // Propertiy
  static readonly FONTFILENAME: string = 'Gotham-Ultra.otf';

  public render(): void {

    this.domElement.innerHTML += `<div class="${styles.responsiveTypography}">BRAND<br> CENTER<br>POWER</div>`;
  }

  private async _fetchCdnFontBaseUrl(): Promise<string> {
    const response = await fetch(`${this.context.pageContext.web.absoluteUrl}/_api/SP.BrandCenter/Configuration?src=ResponsiveTypographyWebPart`, {
      headers: {
        'Accept': 'application/json;odata=nometadata'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.debug('Brand Center Configuration:', data);

    // CND Base Endpoint
    const cdnBaseUrl = this.context.pageContext.legacyPageContext.publicCdnBaseUrl;
    // brandCenterConfig is the retrieved brand center config 
    const fontBasePath = data.BrandFontLibraryUrl.DecodedUrl.replace(
      `${window.location.protocol}//`, ''
    );
    const fontCDNUrl = `${cdnBaseUrl}/${fontBasePath}`;
    console.debug('Font URL:', fontCDNUrl);
    console.debug('Font URL:', data.BrandFontLibraryUrl.DecodedUrl);

    // Set local Storage for base URL
    localStorage.setItem('n8dFontBaseUrl', data.BrandFontLibraryUrl.DecodedUrl);
    // Set local Storage for the CND URL
    localStorage.setItem('n8dFontBaseUrlCDN', fontCDNUrl);

    return cdnBaseUrl;
  }

private _renderFontDefinition(): void {
  const styleBlock = `
  <style>
      @font-face {
    font-family: Gotham;
    src: url(${this._fontBaseUrlCdn + '/' + ResponsiveTypographyWebPart.FONTFILENAME}) format("opentype"),
      url(${this._fontBaseUrl + '/' + ResponsiveTypographyWebPart.FONTFILENAME}) format("opentype");
    font-weight: 950;
    font-style: normal;
    font-display: swap;
  }
    </style>
`;

  this.domElement.innerHTML += styleBlock;

}

  protected async onInit(): Promise<void> {

    this._fontBaseUrl = localStorage.getItem('n8dFontBaseUrl') || null;
    this._fontBaseUrlCdn = localStorage.getItem('n8dFontBaseUrlCDN') || null;

    if (!this._fontBaseUrlCdn && !this._fontBaseUrl) {
      console.debug('CDN Base URL from localStorage:', this._fontBaseUrlCdn);
      this._fontBaseUrlCdn = await this._fetchCdnFontBaseUrl();
      console.debug('CDN Base URL after fetch:', this._fontBaseUrlCdn);
      console.debug('DOM Element:', this.domElement);
    } else {
      console.debug('CDN Base URL from localStorage:', this._fontBaseUrlCdn);
      console.debug('DOM Element:', this.domElement);
    }

    // init font loading
    this._renderFontDefinition();

    return super.onInit();

  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}

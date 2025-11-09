import { Version } from '@microsoft/sp-core-library';
import { 
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneSlider
} from '@microsoft/sp-webpart-base';

import styles from './ResponsiveTypographyWebPart.module.scss';

// Import sp-top-actions types and enums
import {
  ITopActions,
  TopActionsFieldType
} from '@microsoft/sp-top-actions';

export interface IResponsiveTypographyWebPartProps {
  fontSizeMultiplier: number;
}

export default class ResponsiveTypographyWebPart extends BaseClientSideWebPart<IResponsiveTypographyWebPartProps> {

  private _fontBaseUrl: string | null = null;
  private _fontBaseUrlCdn: string | null = null;

  // Propertiy
  static readonly FONTFILENAME: string = 'Gotham-Ultra.otf';

  public getTopActionsConfiguration(): ITopActions | undefined {
    return {
      topActions: [
        {
          targetProperty: 'IncreaseFont',
          type: TopActionsFieldType.Button,
          title: 'Button',
          properties: {
            ariaLabel: 'Increase font size',
            icon: 'FontIncrease'
          }
        },
        {
          targetProperty: 'DecreaseFont',
          type: TopActionsFieldType.Button,
          title: 'Button',
          properties: {
            ariaLabel: 'Decrease font size',
            icon: 'FontDecrease'
          }
        }
      ],
      onExecute: (actionName: string, newValue: unknown): void => {
        const currentSize = this.properties.fontSizeMultiplier || 1;
        let newSize = currentSize;
        
        switch (actionName) {
          case 'IncreaseFont':
            // Only increase if we're not already at the maximum
            if (currentSize < 2.0) {
              newSize = Math.round(Math.min(currentSize + 0.1, 2.0) * 10) / 10;
            }
            break;
          case 'DecreaseFont':
            // Only decrease if we're not already at the minimum
            if (currentSize > 0.5) {
              newSize = Math.round(Math.max(currentSize - 0.1, 0.5) * 10) / 10;
            }
            break;
        }
        
        // Only update if the value actually changed
        if (newSize !== currentSize) {
          this.properties.fontSizeMultiplier = newSize;
          this.domElement.style.setProperty('--font-size-multiplier', this.properties.fontSizeMultiplier.toString());
          console.debug('Top Action executed:', actionName, 'New multiplier:', this.properties.fontSizeMultiplier);
        } else {
          console.debug('Top Action ignored - already at limit:', actionName, 'Current:', currentSize);
        }
      }
    };
  }

  public render(): void {
    // Apply the saved font size multiplier, rounded to 1 decimal place
    const fontSizeMultiplier = Math.round((this.properties.fontSizeMultiplier || 1) * 10) / 10;
    this.domElement.style.setProperty('--font-size-multiplier', fontSizeMultiplier.toString());

    this.domElement.innerHTML = `<div class="${styles.responsiveTypography}">NEW YORK</div>`;
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

    this.domElement.innerHTML = styleBlock;
    this.domElement.classList.add(styles.outerContainer);

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

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: 'Configure your responsive typography settings'
          },
          groups: [
            {
              groupName: 'Typography Settings',
              groupFields: [
                PropertyPaneSlider('fontSizeMultiplier', {
                  label: 'Font Size Multiplier',
                  min: 0.5,
                  max: 2.0,
                  step: 0.1,
                  showValue: true,
                  value: this.properties.fontSizeMultiplier || 1
                })
              ]
            }
          ]
        }
      ]
    };
  }

  protected onPropertyPaneFieldChanged(propertyPath: string, oldValue: unknown, newValue: unknown): void {
    if (propertyPath === 'fontSizeMultiplier') {
      // Round to 1 decimal place
      const roundedValue = Math.round((newValue as number) * 10) / 10;
      this.properties.fontSizeMultiplier = roundedValue;
      this.domElement.style.setProperty('--font-size-multiplier', roundedValue.toString());
    }
    super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}

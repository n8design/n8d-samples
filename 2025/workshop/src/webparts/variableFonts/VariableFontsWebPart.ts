import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import styles from './VariableFontsWebPart.module.scss';

export interface IVariableFontsWebPartProps {
}

export default class VariableFontsWebPart extends BaseClientSideWebPart<IVariableFontsWebPartProps> {

  private _fontBaseUrl: string | null = null;
  private _fontBaseUrlCdn: string | null = null;
  private _currentWeight: number = 300;
  private _currentOpticalSize: number = 12;
  private _italicEnabled: boolean = false;
  private _kerningEnabled: boolean = true;
  private _discretionaryLigatures: boolean = false;
  private _fractions: boolean = false;
  private _tabularNumbers: boolean = false;
  private _oldStyleNumbers: boolean = false;
  private _caseSensitive: boolean = false;
  private _stylisticSet1: boolean = false;

  // Property
  static readonly FONTFILENAME: string = 'SegoeUI-VF.ttf';
  // static readonly FONTFILENAME: string = 'Sono-VariableFont_MONO,wght.ttf';

  public render(): void {

    this.domElement.innerHTML += `
      <div class="${styles.variableFonts}">
        <div class="${styles.fontDisplay}">
          ALL UPPERCASE<br>
          Variable Typography Demo<br>
          Aa Bb Cc Dd Ee Ff Gg<br>
          1234567890 1/2 3/4<br>
          HEADLINES & fine print<br>
          office coffee staff
        </div>
        <div class="${styles.controls}">
          <div class="${styles.controlGroup}">
            <label for="fontWeightSlider" class="${styles.sliderLabel}">
              Font Weight: <span id="fontWeightValue">${this._currentWeight}</span>
            </label>
            <input 
              type="range" 
              id="fontWeightSlider" 
              class="${styles.slider}"
              min="300" 
              max="700" 
              step="1" 
              value="${this._currentWeight}"
            />
          </div>
          
          <div class="${styles.controlGroup}">
            <label for="opticalSizeSlider" class="${styles.sliderLabel}">
              Optical Size: <span id="opticalSizeValue">${this._currentOpticalSize}</span>pt
            </label>
            <input 
              type="range" 
              id="opticalSizeSlider" 
              class="${styles.slider}"
              min="5" 
              max="36" 
              step="1" 
              value="${this._currentOpticalSize}"
            />
          </div>
          
          <div class="${styles.controlGroup}">
            <label class="${styles.checkboxLabel}">
              <input 
                type="checkbox" 
                id="italicCheckbox" 
                class="${styles.checkbox}"
                ${this._italicEnabled ? 'checked' : ''}
              />
              <span class="${styles.checkboxText}">Italic</span>
            </label>
          </div>
          
          <div class="${styles.controlGroup}">
            <h3 class="${styles.sectionTitle}">OpenType Features</h3>
            
            <label class="${styles.checkboxLabel}">
              <input 
                type="checkbox" 
                id="kerningCheckbox" 
                class="${styles.checkbox}"
                ${this._kerningEnabled ? 'checked' : ''}
              />
              <span class="${styles.checkboxText}">Kerning (kern)</span>
            </label>
            
            <label class="${styles.checkboxLabel}">
              <input 
                type="checkbox" 
                id="discretionaryLigaturesCheckbox" 
                class="${styles.checkbox}"
                ${this._discretionaryLigatures ? 'checked' : ''}
              />
              <span class="${styles.checkboxText}">Discretionary Ligatures (dlig)</span>
            </label>
            
            <label class="${styles.checkboxLabel}">
              <input 
                type="checkbox" 
                id="fractionsCheckbox" 
                class="${styles.checkbox}"
                ${this._fractions ? 'checked' : ''}
              />
              <span class="${styles.checkboxText}">Fractions (frac)</span>
            </label>
            
            <label class="${styles.checkboxLabel}">
              <input 
                type="checkbox" 
                id="tabularNumbersCheckbox" 
                class="${styles.checkbox}"
                ${this._tabularNumbers ? 'checked' : ''}
              />
              <span class="${styles.checkboxText}">Tabular Numbers (tnum)</span>
            </label>
            
            <label class="${styles.checkboxLabel}">
              <input 
                type="checkbox" 
                id="oldStyleNumbersCheckbox" 
                class="${styles.checkbox}"
                ${this._oldStyleNumbers ? 'checked' : ''}
              />
              <span class="${styles.checkboxText}">Old Style Numbers (onum)</span>
            </label>
            
            <label class="${styles.checkboxLabel}">
              <input 
                type="checkbox" 
                id="caseSensitiveCheckbox" 
                class="${styles.checkbox}"
                ${this._caseSensitive ? 'checked' : ''}
              />
              <span class="${styles.checkboxText}">Case Sensitive (case)</span>
            </label>
            
            <label class="${styles.checkboxLabel}">
              <input 
                type="checkbox" 
                id="stylisticSet1Checkbox" 
                class="${styles.checkbox}"
                ${this._stylisticSet1 ? 'checked' : ''}
              />
              <span class="${styles.checkboxText}">Stylistic Set 1 (ss01)</span>
            </label>
          </div>
        </div>
      </div>
    `;

    // Set initial CSS custom properties
    this.domElement.style.setProperty('--font-weight', this._currentWeight.toString());
    this.domElement.style.setProperty('--optical-size', this._currentOpticalSize.toString());
    this.domElement.style.setProperty('--kerning', this._kerningEnabled ? '1' : '0');
    this.domElement.style.setProperty('--discretionary-ligatures', this._discretionaryLigatures ? '1' : '0');
    this.domElement.style.setProperty('--fractions', this._fractions ? '1' : '0');
    this.domElement.style.setProperty('--tabular-numbers', this._tabularNumbers ? '1' : '0');
    this.domElement.style.setProperty('--old-style-numbers', this._oldStyleNumbers ? '1' : '0');
    this.domElement.style.setProperty('--case-sensitive', this._caseSensitive ? '1' : '0');
    this.domElement.style.setProperty('--stylistic-set-1', this._stylisticSet1 ? '1' : '0');

    // Additional feature settings with defaults
    this.domElement.style.setProperty('--discretionary-ligatures', '0');
    this.domElement.style.setProperty('--fractions', '0');
    this.domElement.style.setProperty('--tabular-numbers', '0');
    this.domElement.style.setProperty('--old-style-numbers', '0');
    this.domElement.style.setProperty('--case-sensitive', '0');
    this.domElement.style.setProperty('--stylistic-set-1', '0');

    // Debug: Check what font axes are actually supported
    this._debugFontSupport();

    // Add event listeners
    this._attachSliderEvents();

  }

  private _debugFontSupport(): void {
    // This will help us understand what the font actually supports
    const fontDisplay = this.domElement.querySelector(`.${styles.fontDisplay}`) as HTMLElement;
    if (fontDisplay) {
      const computedStyle = window.getComputedStyle(fontDisplay);
      console.debug('Font family resolved to:', computedStyle.fontFamily);
      console.debug('Font variation settings:', computedStyle.fontVariationSettings || 'Not supported');
      console.debug('Font feature settings:', computedStyle.fontFeatureSettings || 'Not supported');
    }
  }

  private _attachSliderEvents(): void {
    // Font Weight Slider
    const weightSlider = this.domElement.querySelector('#fontWeightSlider') as HTMLInputElement;
    const weightValueDisplay = this.domElement.querySelector('#fontWeightValue') as HTMLSpanElement;

    if (weightSlider && weightValueDisplay) {
      weightSlider.addEventListener('input', (event) => {
        const target = event.target as HTMLInputElement;
        const newWeight = parseInt(target.value, 10);

        // Update current weight
        this._currentWeight = newWeight;

        // Update CSS custom property
        this.domElement.style.setProperty('--font-weight', newWeight.toString());

        // Update display value
        weightValueDisplay.textContent = newWeight.toString();

        console.debug('Font weight updated via slider to:', newWeight);
      });
    }

    // Optical Size Slider
    const opticalSlider = this.domElement.querySelector('#opticalSizeSlider') as HTMLInputElement;
    const opticalValueDisplay = this.domElement.querySelector('#opticalSizeValue') as HTMLSpanElement;

    if (opticalSlider && opticalValueDisplay) {
      opticalSlider.addEventListener('input', (event) => {
        const target = event.target as HTMLInputElement;
        const newOpticalSize = parseInt(target.value, 10);

        // Update current optical size
        this._currentOpticalSize = newOpticalSize;

        // Update CSS custom property
        this.domElement.style.setProperty('--optical-size', newOpticalSize.toString());

        // Update display value
        opticalValueDisplay.textContent = newOpticalSize.toString();

        console.debug('Optical size updated via slider to:', newOpticalSize);
      });
    }

    // Italic Checkbox
    const italicCheckbox = this.domElement.querySelector('#italicCheckbox') as HTMLInputElement;

    if (italicCheckbox) {
      italicCheckbox.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement;
        const italicEnabled = target.checked;

        // Update current italic state
        this._italicEnabled = italicEnabled;

        // Toggle CSS class on font display element
        const fontDisplay = this.domElement.querySelector(`.${styles.fontDisplay}`) as HTMLElement;
        if (fontDisplay) {
          if (italicEnabled) {
            fontDisplay.classList.add(styles.italic);
          } else {
            fontDisplay.classList.remove(styles.italic);
          }
        }

        console.debug('Italic updated to:', italicEnabled);
      });
    }

    // Kerning Checkbox
    const kerningCheckbox = this.domElement.querySelector('#kerningCheckbox') as HTMLInputElement;

    if (kerningCheckbox) {
      kerningCheckbox.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement;
        const kerningEnabled = target.checked;

        // Update current kerning state
        this._kerningEnabled = kerningEnabled;

        // Update CSS custom property
        this.domElement.style.setProperty('--kerning', kerningEnabled ? '1' : '0');

        console.debug('Kerning updated via checkbox to:', kerningEnabled);
      });
    }

    // Discretionary Ligatures Checkbox
    const dligCheckbox = this.domElement.querySelector('#discretionaryLigaturesCheckbox') as HTMLInputElement;
    if (dligCheckbox) {
      dligCheckbox.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement;
        this._discretionaryLigatures = target.checked;
        this.domElement.style.setProperty('--discretionary-ligatures', target.checked ? '1' : '0');
        console.debug('Discretionary ligatures updated to:', target.checked);
      });
    }

    // Fractions Checkbox
    const fracCheckbox = this.domElement.querySelector('#fractionsCheckbox') as HTMLInputElement;
    if (fracCheckbox) {
      fracCheckbox.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement;
        this._fractions = target.checked;
        this.domElement.style.setProperty('--fractions', target.checked ? '1' : '0');
        console.debug('Fractions updated to:', target.checked);
      });
    }

    // Tabular Numbers Checkbox
    const tnumCheckbox = this.domElement.querySelector('#tabularNumbersCheckbox') as HTMLInputElement;
    if (tnumCheckbox) {
      tnumCheckbox.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement;
        this._tabularNumbers = target.checked;
        this.domElement.style.setProperty('--tabular-numbers', target.checked ? '1' : '0');
        console.debug('Tabular numbers updated to:', target.checked);
      });
    }

    // Old Style Numbers Checkbox
    const onumCheckbox = this.domElement.querySelector('#oldStyleNumbersCheckbox') as HTMLInputElement;
    if (onumCheckbox) {
      onumCheckbox.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement;
        this._oldStyleNumbers = target.checked;
        this.domElement.style.setProperty('--old-style-numbers', target.checked ? '1' : '0');
        console.debug('Old style numbers updated to:', target.checked);
      });
    }

    // Case Sensitive Checkbox
    const caseCheckbox = this.domElement.querySelector('#caseSensitiveCheckbox') as HTMLInputElement;
    if (caseCheckbox) {
      caseCheckbox.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement;
        this._caseSensitive = target.checked;
        this.domElement.style.setProperty('--case-sensitive', target.checked ? '1' : '0');
        console.debug('Case sensitive updated to:', target.checked);
      });
    }

    // Stylistic Set 1 Checkbox
    const ss01Checkbox = this.domElement.querySelector('#stylisticSet1Checkbox') as HTMLInputElement;
    if (ss01Checkbox) {
      ss01Checkbox.addEventListener('change', (event) => {
        const target = event.target as HTMLInputElement;
        this._stylisticSet1 = target.checked;
        this.domElement.style.setProperty('--stylistic-set-1', target.checked ? '1' : '0');
        console.debug('Stylistic set 1 updated to:', target.checked);
      });
    }
  }

  private async _fetchCdnFontBaseUrl(): Promise<string> {
    const response = await fetch(`${this.context.pageContext.web.absoluteUrl}/_api/SP.BrandCenter/Configuration?src=VariableFontsWebPart`, {
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
        font-family: "Segoe UI Variable";
        src: 
          
             url(${this._fontBaseUrlCdn + '/' + VariableFontsWebPart.FONTFILENAME}),
             url(${this._fontBaseUrl + '/' + VariableFontsWebPart.FONTFILENAME});
        font-weight: 300 700;
        font-style: normal;
        font-display: swap;
        font-optical-sizing: auto;
      }
      @font-face {
        font-family: "Segoe UI Variable";
        src: 
          
             url(${this._fontBaseUrlCdn + '/' + VariableFontsWebPart.FONTFILENAME}),
             url(${this._fontBaseUrl + '/' + VariableFontsWebPart.FONTFILENAME});
        font-weight: 300 700;
        font-style: italic;
        font-display: swap;
        font-optical-sizing: auto;
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
    // Render font definitions after DOM content is set
    this._renderFontDefinition();
    return super.onInit();

  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}

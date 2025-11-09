import { BrandCenterService } from '../services/BrandCenterService';
import { WebPartContext } from '@microsoft/sp-webpart-base';

/**
 * Utility class for common Brand Center operations
 */
export class BrandCenterUtils {

  /**
   * Creates CSS custom properties from Brand Center colors
   * @param brandCenterService - Instance of BrandCenterService
   * @returns Promise<string> - CSS string with custom properties
   */
  public static async generateColorCSS(brandCenterService: BrandCenterService): Promise<string> {
    try {
      const colors = await brandCenterService.getBrandColors();
      
      const cssProperties = colors.map(color => 
        `  --brand-${color.BrandColorName.toLowerCase().replace(/\s+/g, '-')}: ${color.BrandColorValue};`
      ).join('\n');

      return `:root {\n${cssProperties}\n}`;
    } catch (error) {
      console.error('Error generating color CSS:', error);
      return '';
    }
  }

  /**
   * Applies Brand Center colors as CSS custom properties to the document
   * @param brandCenterService - Instance of BrandCenterService
   */
  public static async applyBrandColors(brandCenterService: BrandCenterService): Promise<void> {
    try {
      const colors = await brandCenterService.getBrandColors();
      const root = document.documentElement;

      colors.forEach(color => {
        const propertyName = `--brand-${color.BrandColorName.toLowerCase().replace(/\s+/g, '-')}`;
        root.style.setProperty(propertyName, color.BrandColorValue);
      });
    } catch (error) {
      console.error('Error applying brand colors:', error);
    }
  }

  /**
   * Loads and applies Brand Center fonts to the page
   * @param brandCenterService - Instance of BrandCenterService
   * @param fontNames - Optional array of specific font names to load
   */
  public static async loadBrandFonts(
    brandCenterService: BrandCenterService, 
    fontNames?: string[]
  ): Promise<void> {
    try {
      const fonts = await brandCenterService.getBrandFonts();
      const fontsToLoad = fontNames 
        ? fonts.filter(font => fontNames.some(name => font.Name.includes(name)))
        : fonts;

      const fontLoadPromises = fontsToLoad.map(async (font) => {
        try {
          const fontUrl = await brandCenterService.getFontCdnUrl(font.ServerRelativeUrl);
          return BrandCenterUtils.loadFontFromUrl(font.Name, fontUrl);
        } catch (error) {
          console.warn(`Failed to load font ${font.Name}:`, error);
          return false;
        }
      });

      await Promise.all(fontLoadPromises);
    } catch (error) {
      console.error('Error loading brand fonts:', error);
    }
  }

  /**
   * Loads a single font from a URL using CSS @font-face
   * @param fontName - Name of the font family
   * @param fontUrl - URL to the font file
   */
  private static async loadFontFromUrl(fontName: string, fontUrl: string): Promise<boolean> {
    return new Promise((resolve) => {
      const fontFace = new FontFace(fontName, `url(${fontUrl})`);
      
      fontFace.load().then(() => {
        // Use interface augmentation to properly type the add method
        (document.fonts as unknown as { add: (font: FontFace) => void }).add(fontFace);
        resolve(true);
      }).catch(() => {
        console.error(`Failed to load font ${fontName}`);
        resolve(false);
      });
    });
  }

  /**
   * Creates a theme object from Brand Center data
   * @param brandCenterService - Instance of BrandCenterService
   * @returns Promise<IThemeData> - Complete theme data object
   */
  public static async createThemeObject(brandCenterService: BrandCenterService): Promise<IThemeData> {
    try {
      const [config, colors, fonts, orgAssets] = await Promise.all([
        brandCenterService.getConfiguration(),
        brandCenterService.getBrandColors(),
        brandCenterService.getBrandFonts(),
        brandCenterService.getOrgAssets()
      ]);

      const colorPalette: { [key: string]: string } = {};
      colors.forEach(color => {
        colorPalette[color.BrandColorName] = color.BrandColorValue;
      });

      const fontUrls: { [key: string]: string } = {};
      for (const font of fonts) {
        try {
          const url = await brandCenterService.getFontCdnUrl(font.ServerRelativeUrl);
          fontUrls[font.Name] = url;
        } catch {
          console.warn(`Could not get CDN URL for font ${font.Name}`);
        }
      }

      return {
        metadata: {
          siteUrl: config.SiteUrl,
          isPublicCdnEnabled: config.IsPublicCdnEnabled,
          exportedAt: new Date().toISOString(),
          version: '1.0'
        },
        colors: colorPalette,
        fonts: fontUrls,
        orgAssets: orgAssets.map(asset => ({
          libraryUrl: asset.LibraryUrl.DecodedUrl,
          listId: asset.ListId,
          assetType: asset.OrgAssetType,
          thumbnailUrl: asset.ThumbnailUrl?.DecodedUrl
        }))
      };
    } catch (error) {
      console.error('Error creating theme object:', error);
      throw error;
    }
  }

  /**
   * Downloads theme data as a JSON file
   * @param themeData - The theme data to download
   * @param filename - Optional filename (defaults to auto-generated)
   */
  public static downloadThemeData(themeData: IThemeData, filename?: string): void {
    const blob = new Blob([JSON.stringify(themeData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `sharepoint-theme-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Validates if Brand Center is properly configured
   * @param brandCenterService - Instance of BrandCenterService
   * @returns Promise<IValidationResult> - Validation results
   */
  public static async validateBrandCenter(brandCenterService: BrandCenterService): Promise<IValidationResult> {
    const result: IValidationResult = {
      isValid: true,
      errors: [],
      warnings: []
    };

    try {
      const config = await brandCenterService.getConfiguration();
      
      if (!config.IsBrandCenterSiteFeatureEnabled) {
        result.isValid = false;
        result.errors.push('Brand Center feature is not enabled in this tenant');
      }

      if (!config.IsPublicCdnEnabled) {
        result.warnings.push('Public CDN is not enabled - fonts may not load properly');
      }

      try {
        const colors = await brandCenterService.getBrandColors();
        if (colors.length === 0) {
          result.warnings.push('No brand colors found in Brand Center');
        }
      } catch {
        result.warnings.push('Could not retrieve brand colors');
      }

      try {
        const fonts = await brandCenterService.getBrandFonts();
        if (fonts.length === 0) {
          result.warnings.push('No brand fonts found in Brand Center');
        }
      } catch {
        result.warnings.push('Could not retrieve brand fonts');
      }

    } catch (error) {
      result.isValid = false;
      result.errors.push(`Failed to validate Brand Center: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return result;
  }
}

/**
 * Interface for theme data export
 */
export interface IThemeData {
  metadata: {
    siteUrl: string;
    isPublicCdnEnabled: boolean;
    exportedAt: string;
    version: string;
  };
  colors: { [key: string]: string };
  fonts: { [key: string]: string };
  orgAssets: Array<{
    libraryUrl: string;
    listId: string;
    assetType: number;
    thumbnailUrl?: string;
  }>;
}

/**
 * Interface for validation results
 */
export interface IValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Example usage patterns for the Brand Center Service
 */
export class BrandCenterExamples {

  /**
   * Example: Basic usage pattern
   */
  public static async basicUsage(context: WebPartContext): Promise<void> {
    const brandCenterService = new BrandCenterService(context);
    
    try {
      // Check if Brand Center is enabled
      const isEnabled = await brandCenterService.isBrandCenterEnabled();
      if (!isEnabled) {
        console.log('Brand Center is not enabled');
        return;
      }

      // Load configuration
      const config = await brandCenterService.getConfiguration();
      console.log('Brand Center Site:', config.SiteUrl);

      // Load colors and fonts
      const [colors, fonts] = await Promise.all([
        brandCenterService.getBrandColors(),
        brandCenterService.getBrandFonts()
      ]);

      console.log(`Found ${colors.length} colors and ${fonts.length} fonts`);
    } catch (error) {
      console.error('Error using Brand Center service:', error);
    }
  }

  /**
   * Example: Apply brand styling to a web part
   */
  public static async applyBrandStyling(context: WebPartContext, webPartElement: HTMLElement): Promise<void> {
    const brandCenterService = new BrandCenterService(context);
    
    try {
      // Apply brand colors as CSS custom properties
      await BrandCenterUtils.applyBrandColors(brandCenterService);
      
      // Load brand fonts
      await BrandCenterUtils.loadBrandFonts(brandCenterService);
      
      // Apply a brand color to the web part
      const colors = await brandCenterService.getBrandColors();
      if (colors.length > 0) {
        webPartElement.style.borderLeft = `4px solid ${colors[0].BrandColorValue}`;
      }
      
    } catch (error) {
      console.error('Error applying brand styling:', error);
    }
  }

  /**
   * Example: Export complete theme data
   */
  public static async exportTheme(context: WebPartContext): Promise<void> {
    const brandCenterService = new BrandCenterService(context);
    
    try {
      // Validate Brand Center first
      const validation = await BrandCenterUtils.validateBrandCenter(brandCenterService);
      if (!validation.isValid) {
        console.error('Brand Center validation failed:', validation.errors);
        return;
      }

      // Create and download theme
      const themeData = await BrandCenterUtils.createThemeObject(brandCenterService);
      BrandCenterUtils.downloadThemeData(themeData);
      
    } catch (error) {
      console.error('Error exporting theme:', error);
    }
  }
}
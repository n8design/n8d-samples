import { BrandCenterService, IThemeData, IThemeDataInput, ThemeSourceType } from '../services/BrandCenterService';
import { WebPartContext } from '@microsoft/sp-webpart-base';

/**
 * Utility class for SharePoint Brand Center Theme Management
 * Provides high-level theme operations built on the enhanced BrandCenter service
 */
export class ThemeManagementUtils {

  /**
   * Creates a comprehensive theme export including all theme data
   * @param brandCenterService - Instance of BrandCenterService
   * @returns Promise<IThemeExport> - Complete theme export data
   */
  public static async exportAllThemes(brandCenterService: BrandCenterService): Promise<IThemeExport> {
    try {
      const [siteThemes, tenantThemes] = await Promise.all([
        brandCenterService.getSiteThemes(),
        brandCenterService.getTenantThemes()
      ]);

      return {
        exportedAt: new Date().toISOString(),
        version: '2.0',
        siteThemes: siteThemes.themeData,
        tenantThemes: {
          themes: tenantThemes.themeData,
          hideDefaultThemes: tenantThemes.hideDefaultThemes
        },
        totalThemes: siteThemes.themeData.length + tenantThemes.themeData.length
      };
    } catch (error) {
      console.error('Error exporting themes:', error);
      throw error;
    }
  }

  /**
   * Creates a new theme with validation
   * @param brandCenterService - Instance of BrandCenterService
   * @param themeInput - Theme data input
   * @param isTenan - Whether to create as tenant theme (default: false for site theme)
   * @returns Promise<IThemeData> - Created theme data
   */
  public static async createThemeWithValidation(
    brandCenterService: BrandCenterService,
    themeInput: IThemeDataInput,
    isTenant: boolean = false
  ): Promise<IThemeData> {
    try {
      // Validate theme name first
      const isValid = isTenant 
        ? await brandCenterService.validateTenantThemeName(themeInput.name)
        : await brandCenterService.validateSiteThemeName(themeInput.name);

      if (!isValid) {
        throw new Error(`Theme name '${themeInput.name}' is already in use or invalid`);
      }

      // Validate theme JSON
      ThemeManagementUtils.validateThemeJson(themeInput.themeJson);

      // Create the theme
      return isTenant 
        ? await brandCenterService.addTenantTheme(themeInput)
        : await brandCenterService.addSiteTheme(themeInput);
    } catch (error) {
      console.error('Error creating theme:', error);
      throw error;
    }
  }

  /**
   * Duplicates an existing theme with a new name
   * @param brandCenterService - Instance of BrandCenterService
   * @param sourceThemeId - ID of theme to duplicate
   * @param newName - Name for the new theme
   * @param isTenant - Whether working with tenant themes
   * @returns Promise<IThemeData> - Created theme data
   */
  public static async duplicateTheme(
    brandCenterService: BrandCenterService,
    sourceThemeId: number,
    newName: string,
    isTenant: boolean = false
  ): Promise<IThemeData> {
    try {
      // Get source theme
      const sourceTheme = isTenant 
        ? await brandCenterService.getTenantThemeById(sourceThemeId)
        : await brandCenterService.getSiteThemeById(sourceThemeId);

      // Create new theme based on source
      const newThemeInput: IThemeDataInput = {
        name: newName,
        isVisible: sourceTheme.isVisible,
        themeJson: sourceTheme.themeJson,
        isThemesV2: sourceTheme.isThemesV2
      };

      return await ThemeManagementUtils.createThemeWithValidation(
        brandCenterService,
        newThemeInput,
        isTenant
      );
    } catch (error) {
      console.error('Error duplicating theme:', error);
      throw error;
    }
  }

  /**
   * Bulk import themes from export data
   * @param brandCenterService - Instance of BrandCenterService
   * @param exportData - Theme export data
   * @param options - Import options
   * @returns Promise<IThemeImportResult> - Import results
   */
  public static async importThemes(
    brandCenterService: BrandCenterService,
    exportData: IThemeExport,
    options: IThemeImportOptions = {}
  ): Promise<IThemeImportResult> {
    const result: IThemeImportResult = {
      success: true,
      imported: [],
      skipped: [],
      errors: [],
      results: []
    };

    const { 
      overwriteExisting = false, 
      importSiteThemes = true, 
      importTenantThemes = true,
      namePrefix = ''
    } = options;

    try {
      // Import site themes
      if (importSiteThemes && exportData.siteThemes) {
        for (const theme of exportData.siteThemes) {
          try {
            const themeName = namePrefix + theme.name;
            const isValid = await brandCenterService.validateSiteThemeName(themeName);
            
            if (!isValid && !overwriteExisting) {
              result.skipped.push({ name: themeName, reason: 'Name already exists' });
              continue;
            }

            const themeInput: IThemeDataInput = {
              name: themeName,
              isVisible: theme.isVisible,
              themeJson: theme.themeJson,
              isThemesV2: theme.isThemesV2
            };

            const imported = await brandCenterService.addSiteTheme(themeInput);
            result.imported.push(imported);
            result.results.push({ name: themeName, success: true });
          } catch (error) {
            result.errors.push({ 
              name: theme.name, 
              error: error instanceof Error ? error.message : 'Unknown error' 
            });
            result.results.push({ 
              name: theme.name, 
              success: false, 
              error: error instanceof Error ? error.message : 'Unknown error' 
            });
          }
        }
      }

      // Import tenant themes
      if (importTenantThemes && exportData.tenantThemes?.themes) {
        for (const theme of exportData.tenantThemes.themes) {
          try {
            const themeName = namePrefix + theme.name;
            const isValid = await brandCenterService.validateTenantThemeName(themeName);
            
            if (!isValid && !overwriteExisting) {
              result.skipped.push({ name: themeName, reason: 'Name already exists' });
              continue;
            }

            const themeInput: IThemeDataInput = {
              name: themeName,
              isVisible: theme.isVisible,
              themeJson: theme.themeJson,
              isThemesV2: theme.isThemesV2
            };

            const imported = await brandCenterService.addTenantTheme(themeInput);
            result.imported.push(imported);
            result.results.push({ name: themeName, success: true });
          } catch (error) {
            result.errors.push({ 
              name: theme.name, 
              error: error instanceof Error ? error.message : 'Unknown error' 
            });
            result.results.push({ 
              name: theme.name, 
              success: false, 
              error: error instanceof Error ? error.message : 'Unknown error' 
            });
          }
        }
      }

      result.success = result.errors.length === 0;
      return result;
    } catch (error) {
      console.error('Error during theme import:', error);
      throw error;
    }
  }

  /**
   * Gets theme statistics and analysis
   * @param brandCenterService - Instance of BrandCenterService
   * @returns Promise<IThemeAnalysis> - Theme analysis data
   */
  public static async analyzeThemes(brandCenterService: BrandCenterService): Promise<IThemeAnalysis> {
    try {
      const [siteThemes, tenantThemes] = await Promise.all([
        brandCenterService.getSiteThemes(),
        brandCenterService.getTenantThemes()
      ]);

      const allThemes = [...siteThemes.themeData, ...tenantThemes.themeData];
      
      const analysis: IThemeAnalysis = {
        totalThemes: allThemes.length,
        siteThemesCount: siteThemes.themeData.length,
        tenantThemesCount: tenantThemes.themeData.length,
        visibleThemes: allThemes.filter(t => t.isVisible).length,
        hiddenThemes: allThemes.filter(t => !t.isVisible).length,
        themesV2Count: allThemes.filter(t => t.isThemesV2).length,
        legacyThemesCount: allThemes.filter(t => !t.isThemesV2).length,
        hideDefaultThemes: tenantThemes.hideDefaultThemes,
        sourceBreakdown: {
          system: allThemes.filter(t => t.source === ThemeSourceType.System).length,
          custom: allThemes.filter(t => t.source === ThemeSourceType.Custom).length,
          site: allThemes.filter(t => t.source === ThemeSourceType.Site).length,
          tenant: allThemes.filter(t => t.source === ThemeSourceType.Tenant).length
        },
        themes: allThemes
      };

      return analysis;
    } catch (error) {
      console.error('Error analyzing themes:', error);
      throw error;
    }
  }

  /**
   * Validates theme JSON structure
   * @param themeJson - JSON string to validate
   * @returns boolean - Whether the JSON is valid
   */
  public static validateThemeJson(themeJson: string): boolean {
    try {
      const parsed = JSON.parse(themeJson);
      
      // Basic validation - should have theme properties
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Theme JSON must be an object');
      }

      // Check for common theme properties
      const requiredProps = ['palette'];
      for (const prop of requiredProps) {
        if (!(prop in parsed)) {
          console.warn(`Theme JSON missing recommended property: ${prop}`);
        }
      }

      return true;
    } catch (error) {
      console.error('Invalid theme JSON:', error);
      throw new Error(`Invalid theme JSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Comprehensive theme JSON validation with detailed structure checking
   * @param themeJson - JSON string to validate
   * @returns IThemeValidationResult - Detailed validation result
   */
  public static validateThemeJsonStructure(themeJson: string): IThemeValidationResult {
    const result: IThemeValidationResult = {
      isValid: false,
      errors: [],
      warnings: [],
      themeType: 'unknown',
      hasRequiredProperties: false,
      hasValidPalette: false
    };

    try {
      const theme = JSON.parse(themeJson);
      
      if (!theme || typeof theme !== 'object') {
        result.errors.push('Theme must be a valid JSON object');
        return result;
      }

      // Detect theme type based on structure
      if (theme.palette && typeof theme.palette === 'object') {
        result.themeType = 'v2'; // Modern SharePoint theme
        result.hasValidPalette = this.validateThemePalette(theme.palette, result);
      } else if (theme.themeSlots && typeof theme.themeSlots === 'object') {
        result.themeType = 'v1'; // Legacy SharePoint theme
        result.warnings.push('This appears to be a legacy (v1) theme format');
      }

      // Validate required properties for v2 themes
      if (result.themeType === 'v2') {
        const requiredV2Props = ['palette'];
        const optionalV2Props = ['name', 'isInverted', 'displayMode', 'secondaryColors'];
        
        for (const prop of requiredV2Props) {
          if (!(prop in theme)) {
            result.errors.push(`Missing required property: ${prop}`);
          }
        }

        for (const prop of optionalV2Props) {
          if (prop in theme) {
            if (prop === 'name' && typeof theme.name !== 'string') {
              result.warnings.push('Theme name should be a string');
            }
            if (prop === 'isInverted' && typeof theme.isInverted !== 'boolean') {
              result.warnings.push('isInverted should be a boolean');
            }
            if (prop === 'displayMode' && theme.displayMode !== 'light' && theme.displayMode !== 'dark') {
              result.warnings.push('displayMode should be "light" or "dark"');
            }
          }
        }

        result.hasRequiredProperties = requiredV2Props.every(prop => prop in theme);
      }

      // Overall validation
      result.isValid = result.errors.length === 0 && result.hasValidPalette;

      return result;
    } catch (error) {
      result.errors.push(`JSON parsing error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return result;
    }
  }

  /**
   * Validates theme palette structure
   * @param palette - Theme palette object
   * @param result - Validation result to update
   * @returns boolean - Whether palette is valid
   */
  private static validateThemePalette(palette: { [key: string]: string | number }, result: IThemeValidationResult): boolean {
    const requiredColors = [
      'themePrimary', 'themeLighterAlt', 'themeLighter', 'themeLight',
      'themeTertiary', 'themeSecondary', 'themeDarkAlt', 'themeDark', 'themeDarker',
      'neutralLighterAlt', 'neutralLighter', 'neutralLight', 'neutralQuaternaryAlt',
      'neutralQuaternary', 'neutralTertiaryAlt', 'neutralTertiary', 'neutralSecondary',
      'neutralSecondaryAlt', 'neutralPrimaryAlt', 'neutralPrimary', 'neutralDark', 'black', 'white'
    ];

    const optionalColors = ['backgroundColor'];
    let hasAllRequired = true;
    let validColorCount = 0;

    for (const color of requiredColors) {
      if (!(color in palette)) {
        result.errors.push(`Missing required color: ${color}`);
        hasAllRequired = false;
      } else if (typeof palette[color] === 'string' && this.isValidColor(palette[color] as string)) {
        validColorCount++;
      } else {
        result.errors.push(`Invalid color value for ${color}: ${palette[color]}`);
      }
    }

    for (const color of optionalColors) {
      if (color in palette && (typeof palette[color] !== 'string' || !this.isValidColor(palette[color] as string))) {
        result.warnings.push(`Invalid optional color value for ${color}: ${palette[color]}`);
      }
    }

    // Check for extra properties (not necessarily errors, but good to know)
    const allKnownColors = [...requiredColors, ...optionalColors];
    for (const prop in palette) {
      if (allKnownColors.indexOf(prop) === -1) {
        result.warnings.push(`Unknown palette property: ${prop}`);
      }
    }

    return hasAllRequired && validColorCount >= requiredColors.length * 0.8; // Allow some flexibility
  }

  /**
   * Validates if a string is a valid color (hex)
   * @param color - Color string to validate
   * @returns boolean - Whether color is valid
   */
  private static isValidColor(color: string): boolean {
    if (typeof color !== 'string') return false;
    
    // Check for hex color format
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexRegex.test(color);
  }

  /**
   * Downloads theme data as JSON file
   * @param exportData - Theme export data
   * @param filename - Optional filename
   */
  public static downloadThemeExport(exportData: IThemeExport, filename?: string): void {
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `sharepoint-themes-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

/**
 * Interface for theme export data
 */
export interface IThemeExport {
  exportedAt: string;
  version: string;
  siteThemes: IThemeData[];
  tenantThemes: {
    themes: IThemeData[];
    hideDefaultThemes: boolean;
  };
  totalThemes: number;
}

/**
 * Interface for theme validation result
 */
export interface IThemeValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  themeType: 'v1' | 'v2' | 'unknown';
  hasRequiredProperties: boolean;
  hasValidPalette: boolean;
}

/**
 * Interface for theme import options
 */
export interface IThemeImportOptions {
  overwriteExisting?: boolean;
  validateNames?: boolean;
  importToTenant?: boolean;
  importToSite?: boolean;
  importSiteThemes?: boolean;
  importTenantThemes?: boolean;
  namePrefix?: string;
}

/**
 * Interface for theme import result
 */
export interface IThemeImportResult {
  success: boolean;
  imported: IThemeData[];
  skipped: Array<{ name: string; reason: string }>;
  errors: Array<{ name: string; error: string }>;
  results: {
    name: string;
    success: boolean;
    error?: string;
  }[];
}

/**
 * Interface for theme analysis result
 */
export interface IThemeAnalysis {
  totalThemes: number;
  siteThemesCount: number;
  tenantThemesCount: number;
  visibleThemes: number;
  hiddenThemes: number;
  themesV2Count: number;
  legacyThemesCount: number;
  hideDefaultThemes: boolean;
  sourceBreakdown: {
    system: number;
    custom: number;
    site: number;
    tenant: number;
  };
  themes: IThemeData[];
}

/**
 * Example usage patterns for theme management
 */
export class ThemeManagementExamples {

  /**
   * Example: Complete theme management workflow
   */
  public static async completeThemeWorkflow(context: WebPartContext): Promise<void> {
    const brandCenterService = new BrandCenterService(context);
    
    try {
      // 1. Analyze current themes
      console.log('Analyzing current themes...');
      const analysis = await ThemeManagementUtils.analyzeThemes(brandCenterService);
      console.log(`Found ${analysis.totalThemes} themes (${analysis.siteThemesCount} site, ${analysis.tenantThemesCount} tenant)`);

      // 2. Export all themes
      console.log('Exporting themes...');
      const exportData = await ThemeManagementUtils.exportAllThemes(brandCenterService);
      ThemeManagementUtils.downloadThemeExport(exportData);

      // 3. Create a new theme
      console.log('Creating new theme...');
      const newTheme: IThemeDataInput = {
        name: 'MyCustomTheme',
        isVisible: true,
        themeJson: JSON.stringify({
          palette: {
            themePrimary: '#0078d4',
            themeSecondary: '#106ebe',
            themeTertiary: '#005a9e'
          }
        })
      };
      
      const created = await ThemeManagementUtils.createThemeWithValidation(
        brandCenterService,
        newTheme,
        false // Create as site theme
      );
      console.log(`Created theme: ${created.name} (ID: ${created.id})`);

      // 4. Duplicate an existing theme
      if (analysis.tenantThemesCount > 0) {
        const firstTenantTheme = analysis.themes.find(t => t.source === ThemeSourceType.Tenant);
        if (firstTenantTheme) {
          const duplicated = await ThemeManagementUtils.duplicateTheme(
            brandCenterService,
            firstTenantTheme.id,
            'Copy of ' + firstTenantTheme.name,
            true
          );
          console.log(`Duplicated theme: ${duplicated.name}`);
        }
      }

    } catch (error) {
      console.error('Error in theme workflow:', error);
    }
  }

  /**
   * Example: Theme validation and bulk operations
   */
  public static async themeValidationExample(context: WebPartContext): Promise<void> {
    const brandCenterService = new BrandCenterService(context);
    
    try {
      // Validate theme names
      const nameToCheck = 'TestTheme';
      const [siteNameValid, tenantNameValid] = await Promise.all([
        brandCenterService.validateSiteThemeName(nameToCheck),
        brandCenterService.validateTenantThemeName(nameToCheck)
      ]);
      
      console.log(`Theme name '${nameToCheck}' availability:`);
      console.log(`  Site theme: ${siteNameValid ? 'Available' : 'Taken'}`);
      console.log(`  Tenant theme: ${tenantNameValid ? 'Available' : 'Taken'}`);

      // Get specific themes
      const tenantThemes = await brandCenterService.getTenantThemes();
      if (tenantThemes.themeData.length > 0) {
        const firstTheme = tenantThemes.themeData[0];
        console.log(`First tenant theme: ${firstTheme.name} (Visible: ${firstTheme.isVisible})`);
        
        // Get by name
        const themeByName = await brandCenterService.getTenantThemeByName(firstTheme.name);
        console.log(`Retrieved by name: ${themeByName.name}`);
      }

    } catch (error) {
      console.error('Error in validation example:', error);
    }
  }
}
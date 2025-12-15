import { spfi, SPFI, SPFx } from "@pnp/sp";
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { LogLevel, PnPLogging } from "@pnp/logging";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import "@pnp/sp/context-info";

// Import existing interfaces from the original service
import type {
  IBrandCenterConfiguration,
  IBrandColor,
  IThemeData,
  IThemeDataInput,
  IThemeApplicationHistoryEntry
} from './BrandCenterService';

// Additional interfaces for PnPjs service
interface IBrandFontItem {
  Id: number;
  Name: string;
  ServerRelativeUrl: string;
  TimeCreated: string;
  TimeLastModified: string;
  File: {
    Length: number;
  };
}

interface IWebInfo {
  Url: string;
  Title: string;
  [key: string]: unknown;
}

interface IListItem {
  Id: number;
  Title: string;
  BrandColorValue: string;
  BrandColorName: string;
  BrandColorDescription?: string;
}

/**
 * Enhanced BrandCenterService using PnPjs for improved performance and simplified code
 * 
 * This service combines PnPjs fluent API for standard SharePoint operations
 * with custom REST calls for Brand Center specific endpoints.
 */
export class BrandCenterServiceV2 {
  private sp: SPFI;
  private context: WebPartContext;
  private brandCenterConfig: IBrandCenterConfiguration | null = null;

  constructor(context: WebPartContext) {
    this.context = context;
    
    // Initialize PnPjs with SPFx context and logging
    this.sp = spfi().using(SPFx(context)).using(PnPLogging(LogLevel.Warning));
  }

  // ========================================
  // CONFIGURATION METHODS
  // ========================================

  /**
   * Gets Brand Center configuration using custom REST call
   * @returns Promise<IBrandCenterConfiguration>
   */
  public async getBrandCenterConfiguration(): Promise<IBrandCenterConfiguration> {
    try {
      // Brand Center configuration requires custom REST call
      const response = await this.sp.web.select(
        "*"
      )().then(async () => {
        // Use custom REST call for SP.BrandCenter namespace
        const url = `${this.context.pageContext.web.absoluteUrl}/_api/SP.BrandCenter/Configuration`;
        const result = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          credentials: 'same-origin'
        });
        
        if (!result.ok) {
          throw new Error(`HTTP error! status: ${result.status}`);
        }
        
        return result.json();
      });

      this.brandCenterConfig = response;
      return response;
    } catch (error) {
      console.error('Error fetching Brand Center configuration:', error);
      throw error;
    }
  }

  /**
   * Gets cached configuration or fetches if not available
   * @returns Promise<IBrandCenterConfiguration>
   */
  public async getConfiguration(): Promise<IBrandCenterConfiguration> {
    if (!this.brandCenterConfig) {
      return await this.getBrandCenterConfiguration();
    }
    return this.brandCenterConfig;
  }

  // ========================================
  // BRAND ASSETS METHODS (Using PnPjs)
  // ========================================

  /**
   * Gets brand colors using PnPjs fluent API
   * @returns Promise<IBrandColor[]>
   */
  public async getBrandColors(): Promise<IBrandColor[]> {
    try {
      const config = await this.getConfiguration();
      
      if (!config.IsBrandCenterSiteFeatureEnabled) {
        throw new Error('Brand Center is not enabled in this tenant');
      }

      // Use PnPjs for SharePoint list operations
      const colorListUrl = config.BrandColorListUrl.DecodedUrl;
      const spSite = spfi(colorListUrl).using(SPFx(this.context));
      
      const items = await spSite.web.lists
        .getById(config.BrandColorListId)
        .items
        .select('Id', 'Title', 'BrandColorValue', 'BrandColorName', 'BrandColorDescription')();

      return items.map((item: IListItem) => ({
        Id: item.Id,
        Title: item.Title,
        BrandColorValue: item.BrandColorValue,
        BrandColorName: item.BrandColorName,
        BrandColorDescription: item.BrandColorDescription
      }));
    } catch (error) {
      console.error('Error fetching brand colors:', error);
      throw error;
    }
  }

  /**
   * Gets brand fonts using PnPjs fluent API
   * @returns Promise<any[]>
   */
  public async getBrandFonts(): Promise<IBrandFontItem[]> {
    try {
      const config = await this.getConfiguration();
      
      if (!config.IsBrandCenterSiteFeatureEnabled) {
        throw new Error('Brand Center is not enabled in this tenant');
      }

      // Use PnPjs for SharePoint document library operations
      const fontLibraryUrl = config.BrandFontLibraryListUrl.DecodedUrl;
      const spSite = spfi(fontLibraryUrl).using(SPFx(this.context));
      
      const items = await spSite.web.lists
        .getById(config.BrandFontLibraryId)
        .items
        .select('Id', 'Name', 'ServerRelativeUrl', 'TimeCreated', 'TimeLastModified', 'File/Length')
        .expand('File')();

      return items;
    } catch (error) {
      console.error('Error fetching brand fonts:', error);
      throw error;
    }
  }

  // ========================================
  // THEME RETRIEVAL METHODS (Custom REST)
  // ========================================

  /**
   * Gets site themes using custom REST call
   * @returns Promise<{ themeData: IThemeData[] }>
   */
  public async getSiteThemes(): Promise<{ themeData: IThemeData[] }> {
    try {
      const brandCenterUrl = await this.getBrandCenterApiUrl();
      
      const response = await fetch(`${brandCenterUrl}/_api/brandcenter/GetSiteThemes`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching site themes:', error);
      throw error;
    }
  }

  /**
   * Gets tenant themes using custom REST call
   * @returns Promise<{ themeData: IThemeData[] }>
   */
  public async getTenantThemes(): Promise<{ themeData: IThemeData[] }> {
    try {
      const brandCenterUrl = await this.getBrandCenterApiUrl();
      
      const response = await fetch(`${brandCenterUrl}/_api/brandcenter/GetTenantThemes`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching tenant themes:', error);
      throw error;
    }
  }

  // ========================================
  // THEME MANAGEMENT METHODS (Custom REST)
  // ========================================

  /**
   * Adds a new site theme using custom REST call
   * @param themeData - Theme data to add
   * @returns Promise<IThemeData>
   */
  public async addSiteTheme(themeData: IThemeDataInput): Promise<IThemeData> {
    try {
      // Get request digest using PnPjs
      const digest = await this.sp.web.getContextInfo();
      
      const response = await fetch(`${this.context.pageContext.web.absoluteUrl}/_api/SP.BrandCenter/AddSiteTheme`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-RequestDigest': digest.FormDigestValue.toString()
        },
        body: JSON.stringify({ 
          themeData: { 
            ...themeData, 
            isThemesV2: themeData.isThemesV2 || true 
          } 
        }),
        credentials: 'same-origin'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding site theme:', error);
      throw error;
    }
  }

  /**
   * Adds a new tenant theme using custom REST call
   * @param themeData - Theme data to add
   * @returns Promise<IThemeData>
   */
  public async addTenantTheme(themeData: IThemeDataInput): Promise<IThemeData> {
    try {
      const brandCenterUrl = await this.getBrandCenterApiUrl();
      
      // Get request digest using PnPjs
      const spBrandCenter = spfi(brandCenterUrl).using(SPFx(this.context));
      const digest = await spBrandCenter.web.getContextInfo();
      
      const requestBody = {
        themeData: {
          name: themeData.name,
          themeJson: themeData.themeJson,
          isVisible: themeData.isVisible,
          source: 1
        }
      };
      
      const response = await fetch(`${brandCenterUrl}/_api/brandcenter/AddTenantTheme`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json;odata.metadata=minimal',
          'Content-Type': 'application/json;charset=utf-8',
          'odata-version': '4.0',
          'X-RequestDigest': digest.FormDigestValue.toString()
        },
        body: JSON.stringify(requestBody),
        credentials: 'same-origin'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error adding tenant theme:', error);
      throw error;
    }
  }

  // ========================================
  // THEME VALIDATION METHODS (Custom REST)
  // ========================================

  /**
   * Validates if a site theme name is available
   * @param name - Theme name to validate
   * @returns Promise<boolean>
   */
  public async validateSiteThemeName(name: string): Promise<boolean> {
    try {
      const encodedName = encodeURIComponent(`'${name}'`);
      
      const response = await fetch(`${this.context.pageContext.web.absoluteUrl}/_api/SP.BrandCenter/ValidateSiteThemeName(name=${encodedName})`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.value || false;
    } catch (error) {
      console.error('Error validating site theme name:', error);
      throw error;
    }
  }

  /**
   * Validates if a tenant theme name is available
   * @param name - Theme name to validate
   * @returns Promise<boolean>
   */
  public async validateTenantThemeName(name: string): Promise<boolean> {
    try {
      const encodedName = encodeURIComponent(`'${name}'`);
      
      const response = await fetch(`${this.context.pageContext.web.absoluteUrl}/_api/SP.BrandCenter/ValidateTenantThemeName(name=${encodedName})`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.value || false;
    } catch (error) {
      console.error('Error validating tenant theme name:', error);
      throw error;
    }
  }

  // ========================================
  // THEME APPLICATION METHODS
  // ========================================

  /**
   * Previews a theme on the current site (temporary application)
   * @param themeJson - Theme JSON to preview
   * @returns Promise<void>
   */
  public async previewTheme(themeJson: string): Promise<void> {
    try {
      // Get request digest using PnPjs
      const digest = await this.sp.web.getContextInfo();
      
      const themePayload = JSON.parse(themeJson);
      
      const response = await fetch(`${this.context.pageContext.web.absoluteUrl}/_api/ThemeManager/ApplyTheme`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json;odata=verbose',
          'Content-Type': 'application/json;odata=verbose',
          'X-RequestDigest': digest.FormDigestValue.toString()
        },
        body: JSON.stringify(themePayload),
        credentials: 'same-origin'
      });

      // Handle the 406 error case (theme is applied successfully but header validation error)
      if (!response.ok) {
        const errorText = await response.text();
        
        if (response.status === 406 && errorText.includes('ACCEPT is missing or its value is invalid')) {
          console.warn('Theme applied successfully but received header validation error:', errorText);
          return;
        }
        
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }
    } catch (error) {
      console.error('Error previewing theme:', error);
      throw error;
    }
  }

  /**
   * Gets theme application history using PnPjs
   * @param siteUrl - Optional site URL (defaults to current site)
   * @returns Promise<IThemeApplicationHistoryEntry[]>
   */
  public async getThemeApplicationHistory(siteUrl?: string): Promise<IThemeApplicationHistoryEntry[]> {
    try {
      const targetSiteUrl = siteUrl || this.context.pageContext.web.absoluteUrl;
      
      // This is a Brand Center specific API endpoint, use custom REST call
      const response = await fetch(`${targetSiteUrl}/_api/SP.BrandCenter/GetThemeApplicationHistory`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.value || [];
    } catch (error) {
      console.error('Error fetching theme application history:', error);
      throw error;
    }
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  /**
   * Gets Brand Center API URL using PnPjs web information
   * @returns Promise<string>
   */
  public async getBrandCenterApiUrl(): Promise<string> {
    try {
      // Use PnPjs for web information retrieval
      const webInfo = await this.sp.web.select("Url", "Title")();
      
      // For now, assume Brand Center is on the root site
      // This logic can be enhanced based on your tenant configuration
      const rootSiteUrl = webInfo.Url.split('/sites/')[0];
      return `${rootSiteUrl}/sites/brandcenter`;
    } catch (error) {
      console.error('Error getting Brand Center API URL:', error);
      throw error;
    }
  }

  /**
   * Gets current site information using PnPjs
   * @returns Promise<any>
   */
  public async getCurrentSiteInfo(): Promise<IWebInfo> {
    try {
      return await this.sp.web.select("*")();
    } catch (error) {
      console.error('Error getting current site info:', error);
      throw error;
    }
  }

  // ========================================
  // ADDITIONAL THEME METHODS
  // ========================================

  /**
   * Gets site theme by ID
   * @param id - Theme ID
   * @returns Promise<IThemeData>
   */
  public async getSiteThemeById(id: string): Promise<IThemeData> {
    try {
      const response = await fetch(`${this.context.pageContext.web.absoluteUrl}/_api/SP.BrandCenter/GetSiteThemeById(id=${id})`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching site theme by ID:', error);
      throw error;
    }
  }

  /**
   * Gets tenant theme by ID
   * @param id - Theme ID  
   * @returns Promise<IThemeData>
   */
  public async getTenantThemeById(id: string): Promise<IThemeData> {
    try {
      const response = await fetch(`${this.context.pageContext.web.absoluteUrl}/_api/SP.BrandCenter/GetTenantThemeById(id=${id})`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        credentials: 'same-origin'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching tenant theme by ID:', error);
      throw error;
    }
  }

  // ========================================
  // THEME CRUD OPERATIONS
  // ========================================

  /**
   * Updates a site theme
   * @param themeData - Updated theme data
   * @returns Promise<IThemeData>
   */
  public async updateSiteTheme(themeData: IThemeDataInput): Promise<IThemeData> {
    try {
      const digest = await this.sp.web.getContextInfo();
      
      const response = await fetch(`${this.context.pageContext.web.absoluteUrl}/_api/SP.BrandCenter/UpdateSiteTheme`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-RequestDigest': digest.FormDigestValue.toString()
        },
        body: JSON.stringify({ themeData }),
        credentials: 'same-origin'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating site theme:', error);
      throw error;
    }
  }

  /**
   * Deletes a site theme
   * @param themeId - Theme ID to delete
   * @param themeName - Theme name
   * @returns Promise<void>
   */
  public async deleteSiteTheme(themeId: string, themeName: string): Promise<void> {
    try {
      const digest = await this.sp.web.getContextInfo();
      
      const response = await fetch(`${this.context.pageContext.web.absoluteUrl}/_api/SP.BrandCenter/AddAppliedThemeHistoryEntry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-RequestDigest': digest.FormDigestValue.toString()
        },
        body: JSON.stringify({ 
          themeData: { 
            id: themeId, 
            name: themeName 
          } 
        }),
        credentials: 'same-origin'
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error deleting site theme:', error);
      throw error;
    }
  }
}
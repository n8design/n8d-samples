import { useState, useCallback } from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { 
  BrandCenterService, 
  IBrandCenterConfiguration, 
  IBrandColor, 
  IBrandFont, 
  IOrgAssets,
  IThemeData,
  IThemeDataInput
} from '../services/BrandCenterService';

/**
 * Hook state interface
 */
interface IBrandCenterHookState {
  configuration: IBrandCenterConfiguration | undefined;
  colors: IBrandColor[];
  fonts: IBrandFont[];
  orgAssets: IOrgAssets[];
  siteThemes: IThemeData[];
  tenantThemes: IThemeData[];
  hideDefaultThemes: boolean;
  isLoading: boolean;
  error: string | undefined;
}

/**
 * Custom React hook for Brand Center data
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useBrandCenter = (context: WebPartContext): any => {
  const [state, setState] = useState<IBrandCenterHookState>({
    configuration: undefined,
    colors: [],
    fonts: [],
    orgAssets: [],
    siteThemes: [],
    tenantThemes: [],
    hideDefaultThemes: false,
    isLoading: false,
    error: undefined
  });

  const [brandCenterService] = useState(() => new BrandCenterService(context));

  const setError = useCallback((error: string | undefined) => {
    setState(prev => ({ ...prev, error, isLoading: false }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState(prev => ({ ...prev, isLoading, error: undefined }));
  }, []);

  /**
   * Load Brand Center configuration
   */
  const loadConfiguration = useCallback(async () => {
    try {
      setLoading(true);
      const config = await brandCenterService.getBrandCenterConfiguration();
      setState(prev => ({ ...prev, configuration: config, isLoading: false }));
      return config;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load configuration');
      return undefined;
    }
  }, [brandCenterService, setLoading, setError]);

  /**
   * Load Brand Center colors
   */
  const loadColors = useCallback(async () => {
    try {
      setLoading(true);
      const colors = await brandCenterService.getBrandColors();
      setState(prev => ({ ...prev, colors, isLoading: false }));
      return colors;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load colors');
      return [];
    }
  }, [brandCenterService, setLoading, setError]);

  /**
   * Load Brand Center fonts
   */
  const loadFonts = useCallback(async () => {
    try {
      setLoading(true);
      const fonts = await brandCenterService.getBrandFonts();
      setState(prev => ({ ...prev, fonts, isLoading: false }));
      return fonts;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load fonts');
      return [];
    }
  }, [brandCenterService, setLoading, setError]);

  /**
   * Load organization assets
   */
  const loadOrgAssets = useCallback(async () => {
    try {
      setLoading(true);
      const orgAssets = await brandCenterService.getOrgAssets();
      setState(prev => ({ ...prev, orgAssets, isLoading: false }));
      return orgAssets;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load org assets');
      return [];
    }
  }, [brandCenterService, setLoading, setError]);

  /**
   * Load all Brand Center data
   */
  const loadAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [config, colors, fonts, orgAssets] = await Promise.all([
        brandCenterService.getBrandCenterConfiguration(),
        brandCenterService.getBrandColors(),
        brandCenterService.getBrandFonts(),
        brandCenterService.getOrgAssets()
      ]);

      setState({
        configuration: config,
        colors,
        fonts,
        orgAssets,
        siteThemes: [],
        tenantThemes: [],
        hideDefaultThemes: false,
        isLoading: false,
        error: undefined
      });

      return { config, colors, fonts, orgAssets };
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load Brand Center data');
      return undefined;
    }
  }, [brandCenterService, setLoading, setError]);

  /**
   * Get CDN URL for a font
   */
  const getFontCdnUrl = useCallback(async (serverRelativeUrl: string) => {
    try {
      return await brandCenterService.getFontCdnUrl(serverRelativeUrl);
    } catch (error) {
      console.error('Error getting font CDN URL:', error);
      return undefined;
    }
  }, [brandCenterService]);

  /**
   * Check if Brand Center is enabled
   */
  const checkBrandCenterEnabled = useCallback(async () => {
    try {
      return await brandCenterService.isBrandCenterEnabled();
    } catch (error) {
      console.error('Error checking Brand Center status:', error);
      return false;
    }
  }, [brandCenterService]);

  /**
   * Check if Public CDN is enabled
   */
  const checkPublicCdnEnabled = useCallback(async () => {
    try {
      return await brandCenterService.isPublicCdnEnabled();
    } catch (error) {
      console.error('Error checking Public CDN status:', error);
      return false;
    }
  }, [brandCenterService]);

  /**
   * Clear cached data
   */
  const clearCache = useCallback(() => {
    brandCenterService.clearCache();
    setState({
      configuration: undefined,
      colors: [],
      fonts: [],
      orgAssets: [],
      siteThemes: [],
      tenantThemes: [],
      hideDefaultThemes: false,
      isLoading: false,
      error: undefined
    });
  }, [brandCenterService]);

  /**
   * Refresh all data
   */
  const refresh = useCallback(async () => {
    clearCache();
    return await loadAllData();
  }, [clearCache, loadAllData]);

  // ==========================================
  // THEME MANAGEMENT METHODS
  // ==========================================

  /**
   * Load site themes
   */
  const loadSiteThemes = useCallback(async () => {
    try {
      setLoading(true);
      const siteThemes = await brandCenterService.getSiteThemes();
      setState(prev => ({ ...prev, siteThemes: siteThemes.themeData, isLoading: false }));
      return siteThemes.themeData;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load site themes');
      return [];
    }
  }, [brandCenterService, setLoading, setError]);

  /**
   * Load tenant themes
   */
  const loadTenantThemes = useCallback(async () => {
    try {
      setLoading(true);
      const tenantThemes = await brandCenterService.getTenantThemes();
      setState(prev => ({ 
        ...prev, 
        tenantThemes: tenantThemes.themeData,
        hideDefaultThemes: tenantThemes.hideDefaultThemes,
        isLoading: false 
      }));
      return tenantThemes.themeData;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load tenant themes');
      return [];
    }
  }, [brandCenterService, setLoading, setError]);

  /**
   * Get theme by ID
   */
  const getSiteThemeById = useCallback(async (id: number) => {
    try {
      return await brandCenterService.getSiteThemeById(id);
    } catch (error) {
      console.error(`Error getting site theme ${id}:`, error);
      return undefined;
    }
  }, [brandCenterService]);

  /**
   * Get tenant theme by ID
   */
  const getTenantThemeById = useCallback(async (id: number) => {
    try {
      return await brandCenterService.getTenantThemeById(id);
    } catch (error) {
      console.error(`Error getting tenant theme ${id}:`, error);
      return undefined;
    }
  }, [brandCenterService]);

  /**
   * Get tenant theme by name
   */
  const getTenantThemeByName = useCallback(async (name: string) => {
    try {
      return await brandCenterService.getTenantThemeByName(name);
    } catch (error) {
      console.error(`Error getting tenant theme '${name}':`, error);
      return undefined;
    }
  }, [brandCenterService]);

  /**
   * Validate theme names
   */
  const validateSiteThemeName = useCallback(async (name: string) => {
    try {
      return await brandCenterService.validateSiteThemeName(name);
    } catch (error) {
      console.error(`Error validating site theme name '${name}':`, error);
      return false;
    }
  }, [brandCenterService]);

  const validateTenantThemeName = useCallback(async (name: string) => {
    try {
      return await brandCenterService.validateTenantThemeName(name);
    } catch (error) {
      console.error(`Error validating tenant theme name '${name}':`, error);
      return false;
    }
  }, [brandCenterService]);

  /**
   * Add themes
   */
  const addSiteTheme = useCallback(async (themeData: IThemeDataInput) => {
    try {
      const newTheme = await brandCenterService.addSiteTheme(themeData);
      // Refresh site themes
      await loadSiteThemes();
      return newTheme;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add site theme');
      return undefined;
    }
  }, [brandCenterService, loadSiteThemes, setError]);

  const addTenantTheme = useCallback(async (themeData: IThemeDataInput) => {
    try {
      const newTheme = await brandCenterService.addTenantTheme(themeData);
      // Refresh tenant themes
      await loadTenantThemes();
      return newTheme;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to add tenant theme');
      return undefined;
    }
  }, [brandCenterService, loadTenantThemes, setError]);

  /**
   * Update themes
   */
  const updateSiteTheme = useCallback(async (themeData: IThemeData) => {
    try {
      const updatedTheme = await brandCenterService.updateSiteTheme(themeData);
      // Refresh site themes
      await loadSiteThemes();
      return updatedTheme;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update site theme');
      return undefined;
    }
  }, [brandCenterService, loadSiteThemes, setError]);

  const updateTenantTheme = useCallback(async (themeData: IThemeData) => {
    try {
      const updatedTheme = await brandCenterService.updateTenantTheme(themeData);
      // Refresh tenant themes
      await loadTenantThemes();
      return updatedTheme;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update tenant theme');
      return undefined;
    }
  }, [brandCenterService, loadTenantThemes, setError]);

  /**
   * Delete themes
   */
  const deleteSiteTheme = useCallback(async (themeId: number) => {
    try {
      await brandCenterService.deleteSiteTheme(themeId);
      // Refresh site themes
      await loadSiteThemes();
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete site theme');
      return false;
    }
  }, [brandCenterService, loadSiteThemes, setError]);

  const deleteTenantTheme = useCallback(async (themeId: number) => {
    try {
      await brandCenterService.deleteTenantTheme(themeId);
      // Refresh tenant themes
      await loadTenantThemes();
      return true;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete tenant theme');
      return false;
    }
  }, [brandCenterService, loadTenantThemes, setError]);

  return {
    // State
    ...state,
    
    // Actions
    loadConfiguration,
    loadColors,
    loadFonts,
    loadOrgAssets,
    loadAllData,
    getFontCdnUrl,
    checkBrandCenterEnabled,
    checkPublicCdnEnabled,
    clearCache,
    refresh,
    
    // Theme Management Actions
    loadSiteThemes,
    loadTenantThemes,
    getSiteThemeById,
    getTenantThemeById,
    getTenantThemeByName,
    validateSiteThemeName,
    validateTenantThemeName,
    addSiteTheme,
    addTenantTheme,
    updateSiteTheme,
    updateTenantTheme,
    deleteSiteTheme,
    deleteTenantTheme,
    
    // Service instance (for advanced usage)
    brandCenterService
  };
};
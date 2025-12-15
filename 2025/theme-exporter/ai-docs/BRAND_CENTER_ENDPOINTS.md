# SharePoint Brand Center API Endpoints Documentation

This document provides a comprehensive overview of all SharePoint Brand Center API endpoints used in the BrandCenterService.

## 📋 Overview

The BrandCenterService interacts with multiple SharePoint API endpoints to manage themes, colors, fonts, and branding configuration. This documentation categorizes all endpoints by functionality.

---

## 🔧 Configuration Endpoints

### 1. Get Brand Center Configuration
- **Endpoint:** `/_api/SP.BrandCenter/Configuration`
- **Method:** `GET`
- **Purpose:** Retrieves Brand Center configuration including feature status and resource IDs
- **Returns:** `IBrandCenterConfiguration`
- **Usage:** Initial setup and configuration validation

```typescript
// Current Implementation
GET {webUrl}/_api/SP.BrandCenter/Configuration

// Response Structure
{
  IsBrandCenterSiteFeatureEnabled: boolean,
  IsPublicCdnEnabled: boolean,
  BrandColorListId: string,
  BrandColorListUrl: { DecodedUrl: string },
  BrandFontLibraryId: string,
  BrandFontLibraryListUrl: { DecodedUrl: string },
  OrgAssets: IOrgAssets[],
  SiteId: string,
  SiteUrl: string
}
```

### 2. Get Current Branding Configuration  
- **Endpoint:** `/_api/SP.BrandCenter/CurrentBrandingConfiguration`
- **Method:** `GET`
- **Purpose:** Gets current site branding configuration
- **Returns:** Current branding settings

---

## 🎨 Theme Management Endpoints

### Site Themes

#### 3. Get Site Themes
- **Endpoint:** `/_api/brandcenter/GetSiteThemes`
- **Method:** `GET`
- **Purpose:** Retrieves all available site themes
- **Base URL:** Brand Center URL
- **Returns:** `{ themeData: IThemeData[] }`

#### 4. Get Site Theme by ID
- **Endpoint:** `/_api/SP.BrandCenter/GetSiteThemeById(id={id})`
- **Method:** `GET`
- **Purpose:** Retrieves specific site theme by ID
- **Parameters:** `id` (string) - Theme identifier

#### 5. Add Site Theme
- **Endpoint:** `/_api/SP.BrandCenter/AddSiteTheme`
- **Method:** `POST`
- **Purpose:** Creates new site theme
- **Body:** `{ themeData: IThemeDataInput }`
- **Headers:** `Content-Type: application/json`, `Accept: application/json`

#### 6. Update Site Theme
- **Endpoint:** `/_api/SP.BrandCenter/UpdateSiteTheme`
- **Method:** `POST`
- **Purpose:** Updates existing site theme
- **Body:** `{ themeData: IThemeDataInput }`

#### 7. Delete Site Theme
- **Endpoint:** `/_api/SP.BrandCenter/DeleteSiteTheme`
- **Method:** `POST`
- **Purpose:** Deletes site theme
- **Body:** `{ themeData: { id: string, name: string } }`

#### 8. Validate Site Theme Name
- **Endpoint:** `/_api/SP.BrandCenter/ValidateSiteThemeName(name={name})`
- **Method:** `GET`  
- **Purpose:** Validates if site theme name is available
- **Parameters:** `name` (encoded string) - Theme name to validate

### Tenant Themes

#### 9. Get Tenant Themes
- **Endpoint:** `/_api/brandcenter/GetTenantThemes`
- **Method:** `GET`
- **Purpose:** Retrieves all available tenant themes
- **Base URL:** Brand Center URL
- **Returns:** `{ themeData: IThemeData[] }`

#### 10. Get Tenant Theme by ID
- **Endpoint:** `/_api/SP.BrandCenter/GetTenantThemeById(id={id})`
- **Method:** `GET`
- **Purpose:** Retrieves specific tenant theme by ID
- **Parameters:** `id` (string) - Theme identifier

#### 11. Get Tenant Theme by Name
- **Endpoint:** `/_api/SP.BrandCenter/GetTenantThemeByName(name={name})`
- **Method:** `GET`
- **Purpose:** Retrieves tenant theme by name
- **Parameters:** `name` (encoded string) - Theme name

#### 12. Add Tenant Theme
- **Endpoint:** `/_api/brandcenter/AddTenantTheme`
- **Method:** `POST`
- **Purpose:** Creates new tenant theme
- **Base URL:** Brand Center URL
- **Body:** `{ themeData: { name, themeJson, isVisible, source: 1 } }`
- **Headers:** Custom headers including `X-RequestDigest`

#### 13. Update Tenant Theme
- **Endpoint:** `/_api/brandcenter/UpdateTenantTheme`
- **Method:** `POST`
- **Purpose:** Updates existing tenant theme
- **Base URL:** Brand Center URL
- **Body:** `{ themeData: IThemeDataInput }`
- **Headers:** Custom headers including `X-RequestDigest`

#### 14. Delete Tenant Theme
- **Endpoint:** `/_api/SP.BrandCenter/DeleteTenantTheme`
- **Method:** `POST`
- **Purpose:** Deletes tenant theme
- **Body:** `{ themeData: { id: string, name: string } }`

#### 15. Validate Tenant Theme Name
- **Endpoint:** `/_api/SP.BrandCenter/ValidateTenantThemeName(name={name})`
- **Method:** `GET`
- **Purpose:** Validates if tenant theme name is available
- **Parameters:** `name` (encoded string) - Theme name to validate

---

## 🎯 Theme Application Endpoints

#### 16. Apply Theme (Preview)
- **Endpoint:** `/_api/ThemeManager/ApplyTheme`
- **Method:** `POST`
- **Purpose:** Applies theme to current site (preview mode)
- **Headers:** `Accept: application/json;odata=verbose`, `Content-Type: application/json;odata=verbose`
- **Body:** Theme JSON object with palette data
- **Note:** Uses native `fetch()` instead of SPHttpClient due to header compatibility

#### 17. Get Theme Application History
- **Endpoint:** `/_api/web/ThemeApplicationActionHistory`
- **Method:** `GET`
- **Purpose:** Retrieves theme application history for a site
- **Returns:** Array of theme application entries

---

## 🎨 Brand Assets Endpoints

### Colors

#### 18. Get Brand Colors
- **Endpoint:** `/_api/web/lists(guid'{listId}')/items`
- **Method:** `GET`
- **Purpose:** Retrieves brand colors from Brand Color list
- **Base URL:** Brand Color List URL from configuration
- **Query:** `$select=Id,Title,BrandColorValue,BrandColorName,BrandColorDescription`
- **Returns:** `IBrandColor[]`

### Fonts

#### 19. Get Brand Fonts
- **Endpoint:** `/_api/web/lists(guid'{listId}')/items`
- **Method:** `GET`
- **Purpose:** Retrieves brand fonts from Brand Font library
- **Base URL:** Brand Font Library URL from configuration  
- **Query:** `$select=Id,Name,ServerRelativeUrl,TimeCreated,TimeLastModified,File/Length&$expand=File`
- **Returns:** Font file metadata array

---

## 🔐 Authentication & Utility Endpoints

#### 20. Get Request Digest
- **Endpoint:** `/_api/contextinfo`
- **Method:** `POST`
- **Purpose:** Retrieves form digest value for authenticated requests
- **Returns:** `{ FormDigestValue: string }`

#### 21. Get Web Information
- **Endpoint:** `/_api/web`
- **Method:** `POST`
- **Purpose:** Retrieves web information for site context
- **Body:** Empty object `{}`
- **Headers:** `X-RequestDigest` required

---

## 🔗 URL Construction Patterns

### Base URL Types
1. **Current Web:** `this.context.pageContext.web.absoluteUrl`
2. **Brand Center URL:** Retrieved via `getBrandCenterApiUrl()` method
3. **Color List URL:** From configuration `BrandColorListUrl.DecodedUrl`
4. **Font Library URL:** From configuration `BrandFontLibraryListUrl.DecodedUrl`

### Common URL Patterns
```typescript
// SP.BrandCenter endpoints (current web)
{webUrl}/_api/SP.BrandCenter/{method}

// Brand Center endpoints (brand center site)
{brandCenterUrl}/_api/brandcenter/{method}

// SharePoint List endpoints
{listUrl}/_api/web/lists(guid'{listId}')/{operation}

// Theme Manager endpoints  
{webUrl}/_api/ThemeManager/{method}
```

---

## 📝 Request/Response Formats

### Common Headers
```typescript
// Standard requests
{
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}

// OData requests
{
  'Accept': 'application/json;odata.metadata=minimal',
  'Content-Type': 'application/json;charset=utf-8',
  'odata-version': '4.0'
}

// Theme Manager requests
{
  'Accept': 'application/json;odata=verbose',
  'Content-Type': 'application/json;odata=verbose',
  'X-RequestDigest': '{digest}'
}
```

### Theme Data Structure
```typescript
interface IThemeDataInput {
  name: string;
  themeJson: string;
  isVisible?: boolean;
  source?: number;
  isThemesV2?: boolean;
}

interface IThemeData extends IThemeDataInput {
  id: string;
  // Additional response fields
}
```

---

## 🚀 PnPjs Migration Considerations

### Direct API Mappings
- **Configuration endpoints** → Custom REST calls (SP.BrandCenter namespace)
- **List operations** → PnPjs `sp.web.lists` fluent API
- **Theme operations** → Custom REST calls (brandcenter namespace)
- **Context info** → PnPjs built-in authentication

### Benefits for PnPjs Migration
1. **Simplified list operations** for brand colors and fonts
2. **Built-in authentication** replaces manual digest handling
3. **Type safety** with fluent API
4. **Error handling** standardization
5. **Caching capabilities** for configuration data

### Custom REST Requirements
Some endpoints will still require custom REST calls:
- All `SP.BrandCenter/*` endpoints
- All `brandcenter/*` endpoints  
- `ThemeManager/*` endpoints

### Hybrid Approach Recommended
- Use PnPjs for standard SharePoint operations (lists, web info)
- Use custom REST calls for Brand Center specific APIs
- Leverage PnPjs authentication and error handling throughout
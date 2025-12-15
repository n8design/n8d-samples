# Theme JSON Validation Examples

## 🎯 Available Theme Validation Methods

Your enhanced BrandCenter service now includes comprehensive theme validation capabilities:

### **1. Theme Name Validation (Server-side)**
```typescript
// Validates if theme name is available/unique
const isValid = await brandCenterService.validateSiteThemeName("Aventure - Works");
const isValidTenant = await brandCenterService.validateTenantThemeName("Aventure - Works");
```

### **2. Basic Theme JSON Validation**
```typescript
// Simple JSON structure validation
const isValidJson = ThemeManagementUtils.validateThemeJson(themeJsonString);
```

### **3. Comprehensive Theme Structure Validation (NEW!)**
```typescript
// Detailed validation with error reporting
const validationResult = ThemeManagementUtils.validateThemeJsonStructure(themeJsonString);
```

## 🧪 Testing Your Theme Example

Here's how to validate your specific theme JSON:

```typescript
const themeJson = `{
  "name": "Aventure - Works",
  "isInverted": false,
  "palette": {
    "themeDarker": "#0e1532",
    "themeDark": "#141c44",
    "themeDarkAlt": "#172250",
    "themePrimary": "#1A265A",
    "themeSecondary": "#29356d",
    "themeTertiary": "#59659c",
    "themeLight": "#a2aacd",
    "themeLighter": "#cbcfe4",
    "themeLighterAlt": "#f1f3f8",
    "black": "#000000",
    "neutralDark": "#201f1e",
    "neutralPrimary": "#323130",
    "neutralPrimaryAlt": "#3b3a39",
    "neutralSecondary": "#605e5c",
    "neutralTertiary": "#a19f9d",
    "neutralTertiaryAlt": "#c6c2be",
    "neutralLight": "#e8e3de",
    "neutralLighter": "#f2ede8",
    "neutralLighterAlt": "#f6f1ec",
    "white": "#FCF7F2",
    "neutralQuaternaryAlt": "#d8d4cf",
    "neutralQuaternary": "#cecac6",
    "backgroundColor": "#FCF7F2"
  },
  "displayMode": "light",
  "secondaryColors": {
    "light": [
      {
        "themePrimary": "#ffffff",
        "backgroundColor": "#1A265A"
      },
      {
        "themePrimary": "#C0414C",
        "backgroundColor": "#FCF7F2"
      },
      {
        "themePrimary": "#ffffff",
        "backgroundColor": "#C0414C"
      }
    ],
    "dark": []
  }
}`;

// Comprehensive validation
const validation = ThemeManagementUtils.validateThemeJsonStructure(themeJson);

console.log('Validation Results:');
console.log('- Is Valid:', validation.isValid);
console.log('- Theme Type:', validation.themeType);
console.log('- Has Valid Palette:', validation.hasValidPalette);
console.log('- Errors:', validation.errors);
console.log('- Warnings:', validation.warnings);
```

## 📊 Expected Results for Your Theme

Based on your theme JSON, here's what the validation should return:

```typescript
{
  isValid: true,
  errors: [],
  warnings: [],
  themeType: 'v2',
  hasRequiredProperties: true,
  hasValidPalette: true
}
```

## 🔍 What Gets Validated

### **Required Properties (v2 Themes)**
- ✅ `palette` - Theme color palette
- ⚠️ `name` - Theme name (optional but recommended)
- ⚠️ `isInverted` - Whether theme is inverted (optional)
- ⚠️ `displayMode` - Light/dark mode (optional)

### **Palette Validation**
- ✅ **Required Colors** (23 colors):
  - Primary colors: `themePrimary`, `themeSecondary`, `themeTertiary`
  - Theme variations: `themeDarker`, `themeDark`, `themeDarkAlt`, `themeLight`, `themeLighter`, `themeLighterAlt`
  - Neutral colors: `neutralDark`, `neutralPrimary`, `neutralPrimaryAlt`, `neutralSecondary`, `neutralTertiary`, `neutralTertiaryAlt`, `neutralQuaternary`, `neutralQuaternaryAlt`, `neutralLight`, `neutralLighter`, `neutralLighterAlt`
  - Base colors: `black`, `white`

- ⚠️ **Optional Colors**:
  - `backgroundColor` - Custom background color

### **Color Format Validation**
- ✅ Hex format: `#RRGGBB` or `#RGB`
- ❌ Invalid formats: `rgb()`, `hsl()`, named colors

## 🛠️ Integration Examples

### **With BrandCenter Service**
```typescript
import { BrandCenterService } from '../services/BrandCenterService';
import { ThemeManagementUtils } from '../utils/ThemeManagementUtils';

const brandCenterService = new BrandCenterService(context);

// Full validation workflow
async function validateAndCreateTheme(themeName: string, themeJson: string) {
  try {
    // 1. Validate theme name availability
    const isNameValid = await brandCenterService.validateTenantThemeName(themeName);
    if (!isNameValid) {
      throw new Error(`Theme name "${themeName}" is already in use`);
    }

    // 2. Validate theme JSON structure
    const validation = ThemeManagementUtils.validateThemeJsonStructure(themeJson);
    if (!validation.isValid) {
      throw new Error(`Invalid theme JSON: ${validation.errors.join(', ')}`);
    }

    // 3. Create theme if valid
    const newTheme = await brandCenterService.addTenantTheme({
      name: themeName,
      isVisible: true,
      themeJson: themeJson,
      isThemesV2: true
    });

    console.log('Theme created successfully:', newTheme);
    return newTheme;
  } catch (error) {
    console.error('Theme validation/creation failed:', error);
    throw error;
  }
}
```

### **With React Hook**
```typescript
import { useBrandCenter } from '../hooks/useBrandCenter';
import { ThemeManagementUtils } from '../utils/ThemeManagementUtils';

function ThemeValidationComponent() {
  const { validateTenantThemeName, addTenantTheme } = useBrandCenter(context);

  const handleCreateTheme = async (themeName: string, themeJson: string) => {
    try {
      // Client-side validation first
      const validation = ThemeManagementUtils.validateThemeJsonStructure(themeJson);
      if (!validation.isValid) {
        alert(`Invalid theme: ${validation.errors.join(', ')}`);
        return;
      }

      // Server-side name validation
      const isNameValid = await validateTenantThemeName(themeName);
      if (!isNameValid) {
        alert(`Theme name "${themeName}" is already in use`);
        return;
      }

      // Create theme
      await addTenantTheme({
        name: themeName,
        isVisible: true,
        themeJson: themeJson
      });

      alert('Theme created successfully!');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };
}
```

## 🎨 Theme JSON Validation Response

The enhanced validation provides detailed feedback:

```typescript
interface IThemeValidationResult {
  isValid: boolean;           // Overall validation result
  errors: string[];           // Critical errors that prevent usage
  warnings: string[];         // Non-critical issues
  themeType: 'v1' | 'v2' | 'unknown';  // Detected theme format
  hasRequiredProperties: boolean;       // All required props present
  hasValidPalette: boolean;            // Palette structure valid
}
```

## ✅ Your Theme Status

Your "Aventure - Works" theme JSON should pass all validations:
- ✅ Valid JSON structure
- ✅ Contains required `palette` property
- ✅ All required colors present with valid hex values
- ✅ Proper v2 theme format
- ✅ Optional properties (name, displayMode, secondaryColors) properly formatted

The theme is **ready for use** with the SharePoint Brand Center! 🎉
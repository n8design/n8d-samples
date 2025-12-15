# Theme Color Save Issue - Debug Investigation

## Problem Description
User reports that when saving a theme, the primary and neutral colors are different from what was selected in the UI.

## Investigation Steps

### 1. Potential Causes
- Color conversion issues (hex to HSL to hex)
- JSON parsing/stringification changing color values  
- Theme generation algorithms modifying colors
- Monaco editor content not syncing with UI state
- Service API modifying colors during save

### 2. Debug Points to Check

#### A. Color Input and State Management
- Check if `handlePrimaryColorChange` and `handleNeutralColorChange` are setting correct values
- Verify state updates are properly reflected in UI inputs
- Ensure Monaco editor JSON updates reflect the exact colors selected

#### B. Theme Generation Process
- Verify `generateThemeColors(primaryColor)` returns correct `themePrimary`
- Check `generateNeutralColors(neutralColor)` returns correct `neutralPrimary`
- Ensure JSON stringification doesn't modify color values

#### C. Save Process
- Verify the JSON sent to `addTenantTheme` contains correct colors
- Check if service API modifies colors during processing
- Ensure saved theme JSON matches what was generated

### 3. Debugging Code Additions

Add console logging in key methods:

```typescript
// In handlePrimaryColorChange
console.log('Primary color changed:', color);
console.log('Generated theme colors:', themeColors);

// In handleNeutralColorChange  
console.log('Neutral color changed:', color);
console.log('Generated neutral colors:', neutralColors);

// In saveTheme before API call
console.log('Saving theme with JSON:', parsedJson);
console.log('Theme primary in JSON:', parsedJson.palette?.themePrimary);
console.log('Neutral primary in JSON:', parsedJson.palette?.neutralPrimary);
```

### 4. Common Issues and Solutions

#### Issue: Color Conversion Precision
- HSL to Hex conversions may introduce slight variations
- Solution: Preserve original hex values where possible

#### Issue: JSON Formatting
- JSON.stringify might format colors differently
- Solution: Ensure consistent color format (lowercase, uppercase, etc.)

#### Issue: Auto-Recommend Neutral Overriding Manual Selection
- Harmony-based generation might override manual neutral color
- Solution: Check `autoRecommendNeutral` flag logic

### 5. Quick Fix Strategy

1. Add debug logging to identify where colors change
2. Verify color conversion methods maintain precision
3. Ensure UI state and JSON content stay synchronized
4. Test with simple color values (e.g., #ff0000, #000000) to isolate issue

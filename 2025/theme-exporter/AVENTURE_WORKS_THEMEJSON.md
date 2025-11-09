# 🎨 Your "Aventure - Works" ThemeJson Complete Structure

## 📋 Raw ThemeJson String
From your SP.ThemeData response:
```json
{
  "id": 88,
  "isThemesV2": true,
  "isVisible": true,
  "name": "Aventure - Works",
  "source": 1,
  "themeJson": "{\"name\":\"Aventure - Works\",\"isInverted\":false,\"palette\":{\"themeDarker\":\"#0e1532\",\"themeDark\":\"#141c44\",\"themeDarkAlt\":\"#172250\",\"themePrimary\":\"#1A265A\",\"themeSecondary\":\"#29356d\",\"themeTertiary\":\"#59659c\",\"themeLight\":\"#a2aacd\",\"themeLighter\":\"#cbcfe4\",\"themeLighterAlt\":\"#f1f3f8\",\"black\":\"#000000\",\"neutralDark\":\"#201f1e\",\"neutralPrimary\":\"#323130\",\"neutralPrimaryAlt\":\"#3b3a39\",\"neutralSecondary\":\"#605e5c\",\"neutralTertiary\":\"#a19f9d\",\"neutralTertiaryAlt\":\"#c6c2be\",\"neutralLight\":\"#e8e3de\",\"neutralLighter\":\"#f2ede8\",\"neutralLighterAlt\":\"#f6f1ec\",\"white\":\"#FCF7F2\",\"neutralQuaternaryAlt\":\"#d8d4cf\",\"neutralQuaternary\":\"#cecac6\",\"backgroundColor\":\"#FCF7F2\"},\"displayMode\":\"light\",\"secondaryColors\":{\"light\":[{\"themePrimary\":\"#ffffff\",\"backgroundColor\":\"#1A265A\"},{\"themePrimary\":\"#C0414C\",\"backgroundColor\":\"#FCF7F2\"},{\"themePrimary\":\"#ffffff\",\"backgroundColor\":\"#C0414C\"}],\"dark\":[]}}"
}
```

## 🎨 Parsed ThemeJson Content (Formatted)

Here's your themeJson string parsed and beautifully formatted:

```json
{
  "name": "Aventure - Works",
  "isInverted": false,
  "displayMode": "light",
  "palette": {
    "themePrimary": "#1A265A",
    "themeSecondary": "#29356d",
    "themeTertiary": "#59659c",
    "themeLight": "#a2aacd",
    "themeLighter": "#cbcfe4",
    "themeLighterAlt": "#f1f3f8",
    "themeDark": "#141c44",
    "themeDarkAlt": "#172250",
    "themeDarker": "#0e1532",
    "neutralLighterAlt": "#f6f1ec",
    "neutralLighter": "#f2ede8",
    "neutralLight": "#e8e3de",
    "neutralQuaternaryAlt": "#d8d4cf",
    "neutralQuaternary": "#cecac6",
    "neutralTertiaryAlt": "#c6c2be",
    "neutralTertiary": "#a19f9d",
    "neutralSecondary": "#605e5c",
    "neutralPrimaryAlt": "#3b3a39",
    "neutralPrimary": "#323130",
    "neutralDark": "#201f1e",
    "black": "#000000",
    "white": "#FCF7F2",
    "backgroundColor": "#FCF7F2"
  },
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
}
```

## 🎯 Structure Breakdown

### **Top Level Properties:**
- **`name`**: `"Aventure - Works"` - Theme display name
- **`isInverted`**: `false` - Not a dark/inverted theme
- **`displayMode`**: `"light"` - Light mode theme
- **`palette`**: Object with 23 theme colors
- **`secondaryColors`**: Object with light/dark variations

### **Palette Colors (23 total):**

#### **🔵 Primary Theme Colors:**
```json
"themePrimary": "#1A265A",      // Deep navy blue (main brand color)
"themeSecondary": "#29356d",    // Lighter navy blue
"themeTertiary": "#59659c",     // Even lighter navy blue
```

#### **🌈 Theme Variations:**
```json
"themeLight": "#a2aacd",        // Light navy blue
"themeLighter": "#cbcfe4",      // Very light navy blue  
"themeLighterAlt": "#f1f3f8",   // Almost white with navy tint
"themeDark": "#141c44",         // Darker navy blue
"themeDarkAlt": "#172250",      // Medium dark navy blue
"themeDarker": "#0e1532",       // Darkest navy blue
```

#### **⚪ Neutral Colors (Text/UI):**
```json
"neutralLighterAlt": "#f6f1ec",  // Lightest neutral (warm white)
"neutralLighter": "#f2ede8",     // Very light neutral
"neutralLight": "#e8e3de",       // Light neutral
"neutralQuaternaryAlt": "#d8d4cf", // Light gray
"neutralQuaternary": "#cecac6",   // Medium light gray
"neutralTertiaryAlt": "#c6c2be",  // Medium gray
"neutralTertiary": "#a19f9d",     // Dark gray
"neutralSecondary": "#605e5c",    // Darker gray (secondary text)
"neutralPrimaryAlt": "#3b3a39",   // Very dark gray
"neutralPrimary": "#323130",      // Primary text color
"neutralDark": "#201f1e",         // Almost black
```

#### **🔲 Base Colors:**
```json
"black": "#000000",              // Pure black
"white": "#FCF7F2",              // Warm white (not pure white)
"backgroundColor": "#FCF7F2"     // Same as white - warm background
```

### **🎨 Secondary Colors (3 variations):**

#### **Variation 1: White on Navy**
```json
{
  "themePrimary": "#ffffff",     // White text
  "backgroundColor": "#1A265A"   // Navy background
}
```
*Use case: Headers, navigation, high contrast elements*

#### **Variation 2: Red on Light**
```json
{
  "themePrimary": "#C0414C",     // Red/burgundy text
  "backgroundColor": "#FCF7F2"   // Light warm background
}
```
*Use case: Warnings, attention elements, secondary actions*

#### **Variation 3: White on Red**
```json
{
  "themePrimary": "#ffffff",     // White text
  "backgroundColor": "#C0414C"   // Red/burgundy background
}
```
*Use case: Call-to-action buttons, alerts, important notices*

## 🎨 Color Palette Visualization

### **Primary Color Spectrum (Navy Blue):**
- **Darkest**: `#0e1532` → **Primary**: `#1A265A` → **Lightest**: `#f1f3f8`

### **Neutral Spectrum (Warm Grays):**
- **Black**: `#000000` → **Text**: `#323130` → **White**: `#FCF7F2`

### **Accent Colors:**
- **Red/Burgundy**: `#C0414C` (for attention/warnings)
- **Warm White**: `#FCF7F2` (background instead of pure white)

## 🔍 Notable Features

1. **Warm Color Scheme**: Uses `#FCF7F2` (warm white) instead of pure white
2. **Navy Blue Brand**: Deep navy `#1A265A` as primary brand color
3. **Red Accents**: `#C0414C` for attention/warning elements
4. **Rich Variations**: 9 shades of the primary color for depth
5. **Complete Neutral Scale**: 12 neutral colors for text/UI elements
6. **Light Mode Optimized**: No dark mode secondary colors defined

This is a sophisticated, professional theme with warm undertones and excellent contrast ratios! 🎨
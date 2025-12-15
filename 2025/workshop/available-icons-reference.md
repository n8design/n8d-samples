# SharePoint Top Actions - Available Icons Reference

Based on the Fluent UI Icon library (@fluentui/font-icons-mdl2), here are the available icon names you can use in your Top Actions:

## 🏢 **SharePoint & Microsoft Logo Icons:**
- `SharepointAppIcon16` - SharePoint app icon (16px)
- `SharepointLogoInverse` - SharePoint logo (inverse color)
- `OfficeLogo` - Microsoft Office logo
- `OneDriveLogo` - OneDrive logo
- `PowerBILogo` - Power BI logo
- `OutlookLogoInverse` - Outlook logo (inverse)
- `ExcelLogoInverse` - Excel logo (inverse)
- `WordLogoInverse` - Word logo (inverse)
- `PowerPointLogoInverse` - PowerPoint logo (inverse)

## ⚡ **Common Action Icons:**
- `Add` - Plus/Add icon
- `Remove` - Minus/Remove icon
- `Edit` - Edit/Pencil icon
- `Delete` - Delete/Trash icon
- `Save` - Save icon
- `SaveAs` - Save As icon
- `Cancel` - Cancel/X icon
- `Settings` - Settings/Gear icon
- `More` - More options (three dots)
- `Search` - Search/Magnifying glass
- `Filter` - Filter icon
- `Sort` - Sort icon
- `Home` - Home icon

## ➕➖ **Plus/Minus & Math Icons:**
- `Add` - Standard plus/add icon
- `Remove` - Standard minus/remove icon
- `CirclePlus` - Plus icon in circle
- `CircleAddition` - Addition symbol in circle
- `CircleAdditionSolid` - Solid addition symbol in circle
- `CalculatorAddition` - Calculator plus symbol
- `CalculatorSubtract` - Calculator minus symbol
- `BoxAdditionSolid` - Plus in solid box
- `BoxSubtractSolid` - Minus in solid box

## 🔤 **Font & Text Size Icons:**
- `Font` - Font icon
- `FontSize` - Font size icon
- `FontIncrease` - Increase font size (A+)
- `FontDecrease` - Decrease font size (A-)
- `FontColor` - Font color icon
- `FontColorA` - Font color with A
- `FontColorSwatch` - Font color swatch
- `TextBox` - Text box icon
- `TextField` - Text field icon

## 🔍 **Zoom Icons:**
- `ZoomIn` - Zoom in (magnifying glass with +)
- `ZoomOut` - Zoom out (magnifying glass with -)
- `Zoom` - Standard zoom icon
- `ZoomToFit` - Zoom to fit icon

## 🧭 **Navigation Icons:**
- `ChevronDown` - Down arrow
- `ChevronUp` - Up arrow
- `ChevronLeft` - Left arrow
- `ChevronRight` - Right arrow
- `Back` - Back arrow
- `Forward` - Forward arrow

## 👥 **User & Content Icons:**
- `People` - People/Users icon
- `Person` - Single person icon
- `Group` - Group icon
- `Calendar` - Calendar icon
- `CalendarDay` - Calendar day view
- `CalendarWeek` - Calendar week view
- `Document` - Document icon
- `Page` - Page icon
- `PageSolid` - Solid page icon

## 📱 **App & System Icons:**
- `AppIconDefault` - Default app icon
- `AllApps` - All apps icon
- `WebAppBuilderModule` - Web app builder module
- `Favicon` - Favicon icon
- `WindowsLogo` - Windows logo

## 🔧 **Common Usage Examples:**

```typescript
// Add/Plus action
{
  targetProperty: 'add',
  type: TopActionsFieldType.Button,
  title: 'Add Item',
  properties: {
    text: 'Add',
    icon: 'Add'  // ✅ Standard plus icon
  }
}

// Remove/Minus action
{
  targetProperty: 'remove',
  type: TopActionsFieldType.Button,
  title: 'Remove Item',
  properties: {
    text: 'Remove',
    icon: 'Remove'  // ✅ Standard minus icon
  }
}

// Increase Font Size
{
  targetProperty: 'increaseFontSize',
  type: TopActionsFieldType.Button,
  title: 'Increase Font Size',
  properties: {
    text: 'A+',
    icon: 'FontIncrease'  // ✅ Font size increase icon
  }
}

// Decrease Font Size
{
  targetProperty: 'decreaseFontSize',
  type: TopActionsFieldType.Button,
  title: 'Decrease Font Size',
  properties: {
    text: 'A-',
    icon: 'FontDecrease'  // ✅ Font size decrease icon
  }
}

// Zoom In
{
  targetProperty: 'zoomIn',
  type: TopActionsFieldType.Button,
  title: 'Zoom In',
  properties: {
    text: 'Zoom In',
    icon: 'ZoomIn'  // ✅ Magnifying glass with plus
  }
}

// Edit action
{
  targetProperty: 'edit',
  type: TopActionsFieldType.Button,
  title: 'Edit Content',
  properties: {
    text: 'Edit',
    icon: 'Edit'  // ✅ Available
  }
}

// SharePoint specific
{
  targetProperty: 'sharepoint',
  type: TopActionsFieldType.Button,
  title: 'SharePoint Action',
  properties: {
    text: 'SharePoint',
    icon: 'SharepointAppIcon16'  // ✅ Available
  }
}
```

## ❌ **Note about "SharePointLogo":**
The icon name `SharePointLogo` (with capital P) does **NOT** exist in the Fluent UI icon set. 
Use `SharepointAppIcon16` or `SharepointLogoInverse` instead.

## 📚 **Full Icon Reference:**
For a complete list of all 1800+ available icons, check:
`node_modules/@fluentui/font-icons-mdl2/lib/IconNames.d.ts`
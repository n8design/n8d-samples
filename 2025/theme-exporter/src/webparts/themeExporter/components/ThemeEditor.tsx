import * as React from 'react';
import * as monaco from 'monaco-editor';
import { IThemeEditorProps } from './IThemeEditorProps';
import { BrandCenterService, IThemeDataInput, IThemeData } from '../../../services/BrandCenterService';
import HOOButton, { HOOButtonType } from '@n8d/htwoo-react/HOOButton';
import HOOText from '@n8d/htwoo-react/HOOText';
// Using global classes from ThemeExporter.module.scss

// Configure Monaco Editor for SharePoint Framework - disable workers to avoid issues
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).MonacoEnvironment = {
  getWorker: (): Worker => {
    // Return a dummy worker that does nothing to avoid worker loading issues
    const workerScript = 'self.onmessage = function() {};';
    const blob = new Blob([workerScript], { type: 'application/javascript' });
    return new Worker(URL.createObjectURL(blob));
  }
};

type ColorHarmony = 'complementary' | 'analogous' | 'triadic' | 'tetradic' | 'monochromatic' | 'split-complementary';

interface ISecondaryColor {
  themePrimary: string;
  backgroundColor: string;
  neutralPrimary: string;
}

interface ISecondaryColors {
  light: ISecondaryColor[];
  dark: ISecondaryColor[];
}

interface IThemeEditorState {
  primaryColor: string;
  neutralColor: string;
  themeName: string;
  themeJson: string;
  isGenerating: boolean;
  isSaving: boolean;
  isUpdating: boolean;
  isPreviewing: boolean;
  isApplying: boolean;
  harmony: string;
  isEditMode: boolean;
  editingThemeId?: number;
  error?: string;
  success?: string;
  selectedHarmony: ColorHarmony;
  autoRecommendNeutral: boolean;
}

export default class ThemeEditor extends React.Component<IThemeEditorProps, IThemeEditorState> {
  private brandCenterService: BrandCenterService;
  private editorContainer: React.RefObject<HTMLDivElement>;
  private monacoEditor: monaco.editor.IStandaloneCodeEditor | null = null;
  private isUpdatingFromColorPicker = false; // Flag to prevent recursive updates

  constructor(props: IThemeEditorProps) {
    super(props);

    this.state = {
      themeName: this.props.editingTheme?.name || '',
      themeJson: this.props.editingTheme?.themeJson || this.getDefaultThemeJson(),
      primaryColor: '#0078d4',
      neutralColor: '#323130',
      selectedHarmony: 'complementary', // Default to complementary
      autoRecommendNeutral: true, // Default to true for better UX
      isGenerating: false,
      isSaving: false,
      isPreviewing: false,
      isApplying: false,
      isUpdating: false,
      harmony: 'complementary',
      isEditMode: !!this.props.editingTheme,
      editingThemeId: this.props.editingTheme?.id,
      error: undefined,
      success: undefined
    };

    this.brandCenterService = new BrandCenterService(this.props.context);
    this.editorContainer = React.createRef();
  }

  private getDefaultThemeJson(): string {
    const defaultTheme = {
      name: "My Custom Theme",
      isInverted: false,
      palette: {
        themeDarker: "#004578",
        themeDark: "#005a9e",
        themeDarkAlt: "#106ebe",
        themePrimary: "#0078d4",
        themeSecondary: "#2b88d8",
        themeTertiary: "#71afe5",
        themeLight: "#c7e0f4",
        themeLighter: "#deecf9",
        themeLighterAlt: "#eff6fc",
        black: "#000000",
        neutralDark: "#201f1e",
        neutralPrimary: "#323130",
        neutralPrimaryAlt: "#3b3a39",
        neutralSecondary: "#605e5c",
        neutralTertiary: "#a19f9d",
        neutralTertiaryAlt: "#c8c6c4",
        neutralLight: "#edebe9",
        neutralLighter: "#f3f2f1",
        neutralLighterAlt: "#faf9f8",
        white: "#ffffff",
        neutralQuaternaryAlt: "#e1dfdd",
        neutralQuaternary: "#d0d0d0",
        backgroundColor: "#ffffff"
      },
      displayMode: "light",
      secondaryColors: {
        light: [{
          themePrimary: "#ffffff",
          backgroundColor: "#0078d4",
          neutralPrimary: "#323130"
        }],
        dark: []
      }
    };
    return JSON.stringify(defaultTheme, null, 2);
  }

  /**
   * Generate secondary colors based on current theme colors
   * @param primaryColor - Current primary color
   * @param neutralColor - Current neutral color  
   */
  private generateSecondaryColors(primaryColor: string, neutralColor: string): ISecondaryColors {
    return {
      light: [{
        themePrimary: "#ffffff",
        backgroundColor: primaryColor,
        neutralPrimary: neutralColor
      }],
      dark: []
    };
  }

  public componentDidMount(): void {
    this.initializeMonacoEditor().catch(console.error);
  }

  public componentWillUnmount(): void {
    if (this.monacoEditor) {
      this.monacoEditor.dispose();
    }
  }

  private initializeMonacoEditor = async (): Promise<void> => {
    if (!this.editorContainer.current) return;

    // Configure Monaco Editor
    monaco.editor.defineTheme('sharepoint-theme', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#323130',
      }
    });

    // Disable JSON diagnostics and validation to prevent worker issues
    monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
      validate: false,
      allowComments: false,
      schemas: [],
      enableSchemaRequest: false
    });

    // Create the editor
    this.monacoEditor = monaco.editor.create(this.editorContainer.current, {
      value: this.state.themeJson,
      language: 'json',
      theme: 'sharepoint-theme',
      automaticLayout: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      folding: true,
      lineNumbers: 'on',
      tabSize: 2,
      insertSpaces: true,
      fontSize: 14,
      readOnly: false,
      lineHeight: 22,
      padding: { top: 10, bottom: 10 }
    });

    // Set minimum height to show at least 20 lines
    const minHeight = 20 * 22 + 20; // 20 lines * line height + padding
    if (this.editorContainer.current) {
      this.editorContainer.current.style.minHeight = `${minHeight}px`;
      this.editorContainer.current.style.height = `${minHeight}px`;
    }

    // Listen for content changes
    this.monacoEditor.onDidChangeModelContent(() => {
      if (this.monacoEditor && !this.isUpdatingFromColorPicker) {
        const value = this.monacoEditor.getValue();
        this.setState({ themeJson: value });
        
        // Try to sync theme name and primary color from JSON
        try {
          const parsedJson = JSON.parse(value);
          
          if (parsedJson.name && parsedJson.name !== this.state.themeName) {
            this.setState({ themeName: parsedJson.name });
          }
          
          if (parsedJson.palette?.themePrimary && parsedJson.palette.themePrimary !== this.state.primaryColor) {
            this.setState({ primaryColor: parsedJson.palette.themePrimary });
          }
          
          if (parsedJson.palette?.neutralPrimary && parsedJson.palette.neutralPrimary !== this.state.neutralColor) {
            this.setState({ neutralColor: parsedJson.palette.neutralPrimary });
          }
        } catch {
          // Invalid JSON, ignore
        }
      }
    });
  };

  private handleThemeNameChange = (value: string): void => {
    this.setState({ themeName: value });
    
    // Update the name in the Monaco editor JSON
    if (this.monacoEditor) {
      try {
        const currentJson = this.monacoEditor.getValue();
        const parsedJson = JSON.parse(currentJson);
        parsedJson.name = value;
        const updatedJson = JSON.stringify(parsedJson, null, 2);
        
        // Update editor content without triggering onChange
        const currentPosition = this.monacoEditor.getPosition();
        this.monacoEditor.setValue(updatedJson);
        if (currentPosition) {
          this.monacoEditor.setPosition(currentPosition);
        }
        
        // Update state
        this.setState({ themeJson: updatedJson });
      } catch (error) {
        // If JSON is invalid, just update state
        console.warn('Could not update JSON name field:', error);
      }
    }
  };

  /**
   * Converts hex color to HSL
   */
  private hexToHsl(hex: string): { h: number; s: number; l: number } {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  /**
   * Converts HSL to hex
   */
  private hslToHex(h: number, s: number, l: number): string {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r: number, g: number, b: number;

    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    const toHex = (c: number): string => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  /**
   * Generate theme color variations based on primary color
   */
  private generateThemeColors(primaryColor: string): Record<string, string> {
    const hsl = this.hexToHsl(primaryColor);
    
    console.log('🎨 GENERATE THEME COLORS - Input primary:', primaryColor);
    
    const colors = {
      themeDarker: this.hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 30, 5)),
      themeDark: this.hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 20, 10)),
      themeDarkAlt: this.hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 10, 15)),
      themePrimary: primaryColor, // Preserve exact input color
      themeSecondary: this.hslToHex(hsl.h, Math.max(hsl.s - 10, 10), Math.min(hsl.l + 5, 95)),
      themeTertiary: this.hslToHex(hsl.h, Math.max(hsl.s - 25, 5), Math.min(hsl.l + 15, 95)),
      themeLight: this.hslToHex(hsl.h, Math.max(hsl.s - 35, 5), Math.min(hsl.l + 35, 95)),
      themeLighter: this.hslToHex(hsl.h, Math.max(hsl.s - 45, 5), Math.min(hsl.l + 50, 95)),
      themeLighterAlt: this.hslToHex(hsl.h, Math.max(hsl.s - 50, 5), Math.min(hsl.l + 70, 98))
    };
    
    console.log('🎨 GENERATE THEME COLORS - Output themePrimary:', colors.themePrimary);
    return colors;
  }

  /**
   * Color harmony algorithms based on color theory
   */
  private getColorHarmony(primaryColor: string, harmony: ColorHarmony): string[] {
    const hsl = this.hexToHsl(primaryColor);
    const colors: string[] = [];
    
    switch (harmony) {
      case 'complementary':
        // 180 degrees opposite
        colors.push(this.hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l));
        break;
        
      case 'analogous':
        // ±30 degrees on color wheel
        colors.push(this.hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l));
        colors.push(this.hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l));
        break;
        
      case 'triadic':
        // 120 degrees apart (equilateral triangle)
        colors.push(this.hslToHex((hsl.h + 120) % 360, hsl.s, hsl.l));
        colors.push(this.hslToHex((hsl.h + 240) % 360, hsl.s, hsl.l));
        break;
        
      case 'tetradic':
        // Rectangle: complementary + analogous (90 degrees)
        colors.push(this.hslToHex((hsl.h + 90) % 360, hsl.s, hsl.l));
        colors.push(this.hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l));
        colors.push(this.hslToHex((hsl.h + 270) % 360, hsl.s, hsl.l));
        break;
        
      case 'split-complementary': {
        // Base + two colors adjacent to complement
        const complement = (hsl.h + 180) % 360;
        colors.push(this.hslToHex((complement - 30 + 360) % 360, hsl.s, hsl.l));
        colors.push(this.hslToHex((complement + 30) % 360, hsl.s, hsl.l));
        break;
      }
        
      case 'monochromatic':
        // Same hue, different saturation/lightness
        colors.push(this.hslToHex(hsl.h, Math.max(hsl.s - 30, 10), Math.min(hsl.l + 20, 90)));
        colors.push(this.hslToHex(hsl.h, Math.max(hsl.s - 20, 15), Math.max(hsl.l - 20, 15)));
        break;
        
      default:
        colors.push(this.hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l));
    }
    
    return colors;
  }

  /**
   * Generates neutral color based on selected harmony and primary color
   */
  private generateNeutralFromHarmony(primaryColor: string, harmony: ColorHarmony): string {
    const hsl = this.hexToHsl(primaryColor);
    const harmonyColors = this.getColorHarmony(primaryColor, harmony);
    
    let neutralHue = hsl.h;
    let neutralSat = 8; // Low saturation for neutrals
    let neutralLight = 20; // Good contrast for text
    
    switch (harmony) {
      case 'complementary':
        // Use complement but highly desaturated
        neutralHue = (hsl.h + 180) % 360;
        neutralSat = Math.min(15, hsl.s * 0.2);
        break;
        
      case 'analogous': {
        // Use adjacent color for warm/cool bias
        const adjacentHsl = this.hexToHsl(harmonyColors[0]);
        neutralHue = adjacentHsl.h;
        neutralSat = Math.min(12, hsl.s * 0.15);
        break;
      }
        
      case 'triadic': {
        // Use one of the triadic colors as base
        const triadicHsl = this.hexToHsl(harmonyColors[0]);
        neutralHue = triadicHsl.h;
        neutralSat = Math.min(10, hsl.s * 0.12);
        break;
      }
        
      case 'tetradic': {
        // Use the square's secondary color
        const tetradicHsl = this.hexToHsl(harmonyColors[1]); // complementary
        neutralHue = tetradicHsl.h;
        neutralSat = Math.min(12, hsl.s * 0.15);
        break;
      }
        
      case 'split-complementary': {
        // Average of the split complement colors
        const split1 = this.hexToHsl(harmonyColors[0]);
        const split2 = this.hexToHsl(harmonyColors[1]);
        neutralHue = (split1.h + split2.h) / 2;
        neutralSat = Math.min(10, hsl.s * 0.12);
        break;
      }
        
      case 'monochromatic':
        // Same hue but very desaturated
        neutralHue = hsl.h;
        neutralSat = Math.min(6, hsl.s * 0.08);
        break;
    }
    
    // Adjust lightness for contrast
    if (hsl.l > 70) {
      neutralLight = 18; // Darker neutral for light primaries
    } else if (hsl.l < 30) {
      neutralLight = 25; // Lighter neutral for dark primaries
    }
    
    return this.hslToHex(neutralHue, neutralSat, neutralLight);
  }

  /**
   * Generate neutral color variations using color harmony principles
   */
  private generateNeutralColorsFromHarmony(primaryColor: string, harmony: ColorHarmony): Record<string, string> {
    // IMPORTANT: Use the actual selected neutral color as the base, not the primary color!
    const neutralHsl = this.hexToHsl(this.state.neutralColor);
    
    // Note: harmony and primaryColor are passed but we prioritize the user's actual neutral color selection
    // The harmony concept applies more to automatic suggestion, not overriding manual selection
    console.log('🖌️ HARMONY NEUTRAL - Primary:', primaryColor, 'but using selected neutral:', this.state.neutralColor);
    
    // Generate neutral colors based on the selected neutral color (not primary!)
    console.log('🖌️ HARMONY NEUTRAL GENERATION - Using selected neutral:', this.state.neutralColor);
    
    return {
      black: this.hslToHex(neutralHsl.h, Math.min(neutralHsl.s + 5, 15), Math.max(neutralHsl.l - 15, 0)), // Very dark
      neutralDark: this.hslToHex(neutralHsl.h, Math.min(neutralHsl.s + 3, 12), Math.max(neutralHsl.l - 8, 5)), // Dark text
      neutralPrimary: this.state.neutralColor, // PRESERVE EXACT SELECTED NEUTRAL COLOR!
      neutralPrimaryAlt: this.hslToHex(neutralHsl.h, Math.max(neutralHsl.s - 2, 2), Math.min(neutralHsl.l + 8, 40)), // Alt primary
      neutralSecondary: this.hslToHex(neutralHsl.h, Math.max(neutralHsl.s - 5, 2), Math.min(neutralHsl.l + 20, 55)), // Secondary text
      neutralTertiary: this.hslToHex(neutralHsl.h, Math.max(neutralHsl.s - 8, 2), Math.min(neutralHsl.l + 45, 75)), // Tertiary text
      neutralTertiaryAlt: this.hslToHex(neutralHsl.h, Math.max(neutralHsl.s - 10, 2), Math.min(neutralHsl.l + 55, 82)), // Borders
      neutralQuaternary: this.hslToHex(neutralHsl.h, Math.max(neutralHsl.s - 12, 1), Math.min(neutralHsl.l + 65, 87)), // Light borders
      neutralQuaternaryAlt: this.hslToHex(neutralHsl.h, Math.max(neutralHsl.s - 12, 1), Math.min(neutralHsl.l + 70, 90)), // Subtle borders
      neutralLight: this.hslToHex(neutralHsl.h, Math.max(neutralHsl.s - 15, 1), Math.min(neutralHsl.l + 75, 94)), // Light backgrounds
      neutralLighter: this.hslToHex(neutralHsl.h, Math.max(neutralHsl.s - 18, 1), Math.min(neutralHsl.l + 82, 97)), // Lighter backgrounds
      neutralLighterAlt: this.hslToHex(neutralHsl.h, Math.max(neutralHsl.s - 20, 1), Math.min(neutralHsl.l + 88, 99)), // Lightest backgrounds
      white: '#ffffff' // Always pure white
    };
  }

  /**
   * Generate neutral color variations based on neutral primary color (fallback method)
   */
  private generateNeutralColors(neutralColor: string): Record<string, string> {
    const hsl = this.hexToHsl(neutralColor);
    
    console.log('🖌️ GENERATE NEUTRAL COLORS - Input neutral:', neutralColor);
    
    const colors = {
      black: this.hslToHex(hsl.h, Math.min(hsl.s + 5, 15), Math.max(hsl.l - 15, 0)), // Very dark
      neutralDark: this.hslToHex(hsl.h, Math.min(hsl.s + 3, 12), Math.max(hsl.l - 8, 5)), // Dark text
      neutralPrimary: neutralColor, // Preserve exact input color
      neutralPrimaryAlt: this.hslToHex(hsl.h, Math.max(hsl.s - 2, 2), Math.min(hsl.l + 8, 40)), // Alt primary
      neutralSecondary: this.hslToHex(hsl.h, Math.max(hsl.s - 5, 2), Math.min(hsl.l + 20, 55)), // Secondary text
      neutralTertiary: this.hslToHex(hsl.h, Math.max(hsl.s - 8, 2), Math.min(hsl.l + 45, 75)), // Tertiary text
      neutralTertiaryAlt: this.hslToHex(hsl.h, Math.max(hsl.s - 10, 2), Math.min(hsl.l + 55, 82)), // Borders
      neutralQuaternary: this.hslToHex(hsl.h, Math.max(hsl.s - 12, 1), Math.min(hsl.l + 65, 87)), // Light borders
      neutralQuaternaryAlt: this.hslToHex(hsl.h, Math.max(hsl.s - 12, 1), Math.min(hsl.l + 70, 90)), // Subtle borders
      neutralLight: this.hslToHex(hsl.h, Math.max(hsl.s - 15, 1), Math.min(hsl.l + 75, 94)), // Light backgrounds
      neutralLighter: this.hslToHex(hsl.h, Math.max(hsl.s - 18, 1), Math.min(hsl.l + 82, 97)), // Lighter backgrounds
      neutralLighterAlt: this.hslToHex(hsl.h, Math.max(hsl.s - 20, 1), Math.min(hsl.l + 88, 99)), // Lightest backgrounds
      white: '#ffffff' // Always pure white
    };
    
    console.log('🖌️ GENERATE NEUTRAL COLORS - Output neutralPrimary:', colors.neutralPrimary);
    return colors;
  }

  private handlePrimaryColorChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const color = event.target.value;
    
    console.log('🎨 PRIMARY COLOR CHANGE - Input:', color);
    
    // Auto-recommend neutral color if enabled
    let newNeutralColor = this.state.neutralColor;
    if (this.state.autoRecommendNeutral) {
      newNeutralColor = this.generateNeutralFromHarmony(color, this.state.selectedHarmony);
      console.log('🎨 PRIMARY COLOR CHANGE - Auto-generated neutral:', newNeutralColor);
    }
    
    this.setState({ 
      primaryColor: color,
      neutralColor: newNeutralColor 
    });
    
    // Update all theme colors in the Monaco editor JSON
    if (this.monacoEditor) {
      try {
        const currentJson = this.monacoEditor.getValue();
        const parsedJson = JSON.parse(currentJson);
        
        // Generate all theme color variations
        const themeColors = this.generateThemeColors(color);
        console.log('🎨 PRIMARY COLOR CHANGE - Generated theme colors:', themeColors);
        
        // Generate neutral color variations using harmony if auto-recommend is enabled
        let neutralColors = {};
        if (this.state.autoRecommendNeutral) {
          neutralColors = this.generateNeutralColorsFromHarmony(color, this.state.selectedHarmony);
          console.log('🎨 PRIMARY COLOR CHANGE - Generated neutral colors:', neutralColors);
        }
        
        // Update all colors
        if (parsedJson.palette) {
          Object.assign(parsedJson.palette, themeColors);
          if (this.state.autoRecommendNeutral) {
            Object.assign(parsedJson.palette, neutralColors);
          }
        }
        
        // 🎨 UPDATE SECONDARY COLORS with new primary color  
        const neutralColorsWithType = neutralColors as { neutralPrimary?: string };
        const neutralColorForSecondary = this.state.autoRecommendNeutral && neutralColorsWithType.neutralPrimary 
          ? neutralColorsWithType.neutralPrimary 
          : this.state.neutralColor;
        parsedJson.secondaryColors = this.generateSecondaryColors(color, neutralColorForSecondary);
        console.log('🎨 PRIMARY COLOR CHANGE - Updated secondaryColors:', parsedJson.secondaryColors);
        
        const updatedJson = JSON.stringify(parsedJson, null, 2);
        
        console.log('🎨 PRIMARY COLOR CHANGE - Final JSON palette:', parsedJson.palette);
        
        // Update editor content without triggering onChange
        this.isUpdatingFromColorPicker = true;
        const currentPosition = this.monacoEditor.getPosition();
        this.monacoEditor.setValue(updatedJson);
        if (currentPosition) {
          this.monacoEditor.setPosition(currentPosition);
        }
        this.isUpdatingFromColorPicker = false;
        
        // Update state
        this.setState({ themeJson: updatedJson });
      } catch (error) {
        // If JSON is invalid, just update state
        console.warn('Could not update JSON theme colors:', error);
      }
    }
  };

  private handleNeutralColorChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const color = event.target.value;
    console.log('🖌️ NEUTRAL COLOR CHANGE - Input:', color);
    
    this.setState({ neutralColor: color });
    
    // Update all neutral colors in the Monaco editor JSON
    if (this.monacoEditor) {
      try {
        const currentJson = this.monacoEditor.getValue();
        const parsedJson = JSON.parse(currentJson);
        
        // Generate neutral color variations - ALWAYS use the manually selected color
        // The autoRecommendNeutral flag should only apply to automatic generation, 
        // not override manual user selection
        const neutralColors = this.generateNeutralColors(color);
        console.log('🖌️ NEUTRAL COLOR CHANGE - Manual-generated neutrals:', neutralColors);
        
        // Update all neutral colors
        if (parsedJson.palette) {
          Object.assign(parsedJson.palette, neutralColors);
        }
        
        // 🎨 UPDATE SECONDARY COLORS with new neutral color
        parsedJson.secondaryColors = this.generateSecondaryColors(this.state.primaryColor, color);
        console.log('🖌️ NEUTRAL COLOR CHANGE - Updated secondaryColors:', parsedJson.secondaryColors);
        
        const updatedJson = JSON.stringify(parsedJson, null, 2);
        
        console.log('🖌️ NEUTRAL COLOR CHANGE - Final JSON palette:', parsedJson.palette);
        
        // Update editor content without triggering onChange
        this.isUpdatingFromColorPicker = true;
        const currentPosition = this.monacoEditor.getPosition();
        this.monacoEditor.setValue(updatedJson);
        if (currentPosition) {
          this.monacoEditor.setPosition(currentPosition);
        }
        this.isUpdatingFromColorPicker = false;
        
        // Update state
        this.setState({ themeJson: updatedJson });
      } catch (error) {
        // If JSON is invalid, just update state
        console.warn('Could not update JSON neutral colors:', error);
      }
    }
  };

  private recommendNeutralFromPrimary = (): void => {
    // Apply harmony-based neutral colors directly to JSON
    if (this.monacoEditor) {
      try {
        const currentJson = this.monacoEditor.getValue();
        const parsedJson = JSON.parse(currentJson);
        
        // Generate neutral colors using harmony
        const neutralColors = this.generateNeutralColorsFromHarmony(this.state.primaryColor, this.state.selectedHarmony);
        
        // Update all neutral colors
        if (parsedJson.palette) {
          Object.assign(parsedJson.palette, neutralColors);
        }
        
        const updatedJson = JSON.stringify(parsedJson, null, 2);
        
        // Update editor content
        const currentPosition = this.monacoEditor.getPosition();
        this.monacoEditor.setValue(updatedJson);
        if (currentPosition) {
          this.monacoEditor.setPosition(currentPosition);
        }
        
        // Update state with the primary neutral color for the picker
        this.setState({ 
          neutralColor: neutralColors.neutralPrimary,
          themeJson: updatedJson 
        });
      } catch (error) {
        console.warn('Could not apply harmony neutrals:', error);
      }
    }
  };

  private getHarmonyDescription(harmony: ColorHarmony): string {
    switch (harmony) {
      case 'complementary':
        return 'Colors opposite on the color wheel - high contrast, vibrant';
      case 'analogous':
        return 'Colors next to each other - harmonious, serene';
      case 'triadic':
        return 'Three colors evenly spaced - vibrant yet balanced';
      case 'tetradic':
        return 'Four colors forming a rectangle - rich, diverse palette';
      case 'split-complementary':
        return 'Base color plus two adjacent to complement - vibrant with less tension';
      case 'monochromatic':
        return 'Variations of a single hue - elegant, cohesive';
      default:
        return '';
    }
  }

  private resetEditor = (): void => {
    this.setState({ 
      themeName: '',
      primaryColor: '#0078d4',
      neutralColor: '#323130',
      error: undefined,
      success: undefined 
    });
    
    // Reset editor content
    if (this.monacoEditor) {
      this.monacoEditor.setValue(this.getDefaultThemeJson());
    }
  };

  private previewTheme = async (): Promise<void> => {
    this.setState({
      isPreviewing: true,
      error: undefined,
      success: undefined
    });

    try {
      // Validate JSON
      let parsedJson;
      try {
        parsedJson = JSON.parse(this.state.themeJson);
      } catch {
        throw new Error('Invalid JSON format in theme definition');
      }

      // Update the name in the JSON for preview
      parsedJson.name = this.state.themeName || 'Preview Theme';

      // Preview the theme on the current site
      await this.brandCenterService.previewTheme(JSON.stringify(parsedJson));
      
      this.setState({
        isPreviewing: false,
        success: 'Theme preview applied to current site! Refresh the page to see changes.'
      });

    } catch (error) {
      this.setState({
        error: `Failed to preview theme: ${error instanceof Error ? error.message : 'Unknown error'}`,
        isPreviewing: false
      });
    }
  };

  private applyThemeToSite = async (): Promise<void> => {
    this.setState({
      isApplying: true,
      error: undefined,
      success: undefined
    });

    try {
      // Validate JSON
      let parsedJson;
      try {
        parsedJson = JSON.parse(this.state.themeJson);
      } catch {
        throw new Error('Invalid JSON format in theme definition');
      }

      // Update the name in the JSON
      parsedJson.name = this.state.themeName || 'Applied Theme';

      // Apply the theme permanently to the current site
      await this.brandCenterService.applyThemeToSite(JSON.stringify(parsedJson), parsedJson.name);
      
      this.setState({
        isApplying: false,
        success: `Theme "${parsedJson.name}" applied permanently to this site!`
      });

    } catch (error) {
      this.setState({
        error: `Failed to apply theme: ${error instanceof Error ? error.message : 'Unknown error'}`,
        isApplying: false
      });
    }
  };

  private resetToNewTheme = (): void => {
    this.setState({
      themeName: '',
      themeJson: this.getDefaultThemeJson(),
      primaryColor: '#0078d4',
      neutralColor: '#323130',
      selectedHarmony: 'complementary',
      autoRecommendNeutral: true,
      isEditMode: false,
      editingThemeId: undefined,
      error: undefined,
      success: undefined
    });

    // Reset Monaco editor
    if (this.monacoEditor) {
      this.monacoEditor.setValue(this.getDefaultThemeJson());
    }
  };

  private saveTheme = async (): Promise<void> => {
    if (!this.state.themeName.trim()) {
      this.setState({ error: 'Theme name is required' });
      return;
    }

    const isUpdate = this.state.isEditMode && this.state.editingThemeId;
    
    this.setState({
      isSaving: !isUpdate,
      isUpdating: !!isUpdate,
      error: undefined,
      success: undefined 
    });

    try {
      // Validate JSON
      let parsedJson;
      try {
        parsedJson = JSON.parse(this.state.themeJson);
      } catch {
        throw new Error('Invalid JSON format in theme definition');
      }

      // Debug logging - check colors before save
      console.log('🔍 SAVE DEBUG - UI State Colors:', {
        primaryColorFromState: this.state.primaryColor,
        neutralColorFromState: this.state.neutralColor
      });
      
      console.log('🔍 SAVE DEBUG - JSON Palette Colors:', {
        themePrimaryFromJson: parsedJson.palette?.themePrimary,
        neutralPrimaryFromJson: parsedJson.palette?.neutralPrimary
      });

      // Update the name in the JSON
      parsedJson.name = this.state.themeName;
      
      // 🎨 UPDATE SECONDARY COLORS with current theme colors
      console.log('🔥 Updating secondaryColors with current theme colors...');
      parsedJson.secondaryColors = this.generateSecondaryColors(this.state.primaryColor, this.state.neutralColor);
      
      console.log('🔥 Generated secondaryColors:', parsedJson.secondaryColors);

      if (isUpdate) {
        // Update existing theme
        const themeData: IThemeData = {
          id: this.state.editingThemeId!,
          name: this.state.themeName,
          themeJson: JSON.stringify(parsedJson),
          isThemesV2: true,
          isVisible: true,
          source: 1 // Custom theme
        };

        await this.brandCenterService.updateTenantTheme(themeData);
        
        // 🔥 APPLY THE THEME to update ThemeProvider and CSS variables
        console.log('🎨 Applying updated theme to refresh CSS variables...');
        await this.brandCenterService.previewTheme(JSON.stringify(parsedJson));
        
        // 🎯 ALSO apply theme directly to web part to override ThemeProvider
        if (this.props.webPartInstance) {
          this.props.webPartInstance.applyCustomTheme(parsedJson);
        }
        
        this.setState({
          isUpdating: false,
          isPreviewing: false,
          isApplying: false,
          success: `Theme "${this.state.themeName}" updated and applied successfully!`
        });

      } else {
        // Create new theme
        const themeDataInput: IThemeDataInput = {
          name: this.state.themeName,
          themeJson: JSON.stringify(parsedJson),
          isVisible: true
        };

        const createdTheme = await this.brandCenterService.addTenantTheme(themeDataInput);
        
        // 🔥 APPLY THE NEW THEME to update ThemeProvider and CSS variables
        console.log('🎨 Applying new theme to refresh CSS variables...');
        await this.brandCenterService.previewTheme(JSON.stringify(parsedJson));
        
        // 🎯 ALSO apply theme directly to web part to override ThemeProvider
        if (this.props.webPartInstance) {
          this.props.webPartInstance.applyCustomTheme(parsedJson);
        }
        
        // After successful creation, switch to edit mode for the newly created theme
        this.setState({
          isSaving: false,
          isPreviewing: false,
          isApplying: false,
          success: `Theme "${this.state.themeName}" created and applied successfully!`,
          isEditMode: true,
          editingThemeId: createdTheme?.id
        });

        // Notify parent component
        if (this.props.onThemeCreated && createdTheme?.id) {
          this.props.onThemeCreated(createdTheme.id.toString());
        }
      }

    } catch (error) {
      this.setState({
        error: `Failed to ${isUpdate ? 'update' : 'create'} theme: ${error instanceof Error ? error.message : 'Unknown error'}`,
        isSaving: false,
        isUpdating: false
      });
    }
  };

  public render(): React.ReactElement<IThemeEditorProps> {
    const { themeName, primaryColor, neutralColor, selectedHarmony, autoRecommendNeutral, isSaving, isPreviewing, isApplying, error, success } = this.state;

    return (
      <div className="theme-creator">
        <h3>Advanced Theme Editor</h3>
        
        {/* Theme Name Input */}
        <div>
          <label>Theme Name:</label>
          <HOOText
            value={themeName}
            onChange={(e) => this.handleThemeNameChange(e.target.value)}
            inputElementAttributes={{ placeholder: "Enter theme name..." }}
          />
        </div>

        {/* Primary Color Picker */}
        <div>
          <label>Primary Color:</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="color"
              value={primaryColor}
              onChange={this.handlePrimaryColorChange}
              style={{ width: '40px', height: '32px', border: 'none', borderRadius: '4px' }}
            />
            <span>{primaryColor}</span>
          </div>
        </div>

        {/* Color Harmony Selection */}
        <div>
          <label>Color Harmony:</label>
          <select
            value={selectedHarmony}
            onChange={(e) => this.setState({ selectedHarmony: e.target.value as ColorHarmony })}
            style={{
              padding: '6px 12px',
              border: '1px solid #d1d1d1',
              borderRadius: '4px',
              fontSize: '14px',
              backgroundColor: 'white',
              width: '100%'
            }}
          >
            <option value="complementary">Complementary (Opposite)</option>
            <option value="analogous">Analogous (Adjacent)</option>
            <option value="triadic">Triadic (120° Triangle)</option>
            <option value="tetradic">Tetradic (Square)</option>
            <option value="split-complementary">Split-Complementary</option>
            <option value="monochromatic">Monochromatic (Same Hue)</option>
          </select>
          <div style={{ fontSize: '12px', color: '#605e5c', marginTop: '4px' }}>
            {this.getHarmonyDescription(selectedHarmony)}
          </div>
          
          {/* Color Harmony Preview */}
          <div style={{ marginTop: '8px' }}>
            <div style={{ fontSize: '12px', color: '#323130', marginBottom: '4px' }}>Harmony Colors:</div>
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              {/* Primary color */}
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  backgroundColor: primaryColor,
                  border: '2px solid #323130',
                  borderRadius: '3px'
                }}
                title={`Primary: ${primaryColor}`}
              />
              {/* Harmony colors */}
              {this.getColorHarmony(primaryColor, selectedHarmony).map((color, index) => (
                <div
                  key={index}
                  style={{
                    width: '20px',
                    height: '20px',
                    backgroundColor: color,
                    border: '1px solid #d1d1d1',
                    borderRadius: '3px'
                  }}
                  title={`Harmony ${index + 1}: ${color}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Neutral Color Picker */}
        <div>
          <label>Neutral Color:</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="color"
              value={neutralColor}
              onChange={this.handleNeutralColorChange}
              style={{ width: '40px', height: '32px', border: 'none', borderRadius: '4px' }}
            />
            <span>{neutralColor}</span>
            <HOOButton
              type={HOOButtonType.Standard}
              label={`Apply ${selectedHarmony.charAt(0).toUpperCase() + selectedHarmony.slice(1)} Neutrals`}
              onClick={this.recommendNeutralFromPrimary}
            />
          </div>
          
          {/* Neutral Colors Preview */}
          <div style={{ marginTop: '8px' }}>
            <div style={{ fontSize: '12px', color: '#323130', marginBottom: '4px' }}>
              {selectedHarmony.charAt(0).toUpperCase() + selectedHarmony.slice(1)} Neutral Preview:
            </div>
            <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
              {(() => {
                const previewNeutrals = this.generateNeutralColorsFromHarmony(primaryColor, selectedHarmony);
                return [
                  previewNeutrals.neutralDark,
                  previewNeutrals.neutralPrimary, 
                  previewNeutrals.neutralSecondary,
                  previewNeutrals.neutralTertiary,
                  previewNeutrals.neutralQuaternary,
                  previewNeutrals.neutralLight
                ].map((color, index) => (
                  <div
                    key={index}
                    style={{
                      width: '16px',
                      height: '16px',
                      backgroundColor: color,
                      border: '1px solid #d1d1d1',
                      borderRadius: '2px'
                    }}
                    title={`${Object.keys(previewNeutrals)[index + 1]}: ${color}`}
                  />
                ));
              })()}
            </div>
          </div>
          
          {/* Auto-recommendation checkbox */}
          <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <input
              type="checkbox"
              id="autoRecommendNeutral"
              checked={autoRecommendNeutral}
              onChange={(e) => this.setState({ autoRecommendNeutral: e.target.checked })}
            />
            <label htmlFor="autoRecommendNeutral" style={{ fontSize: '13px', color: '#605e5c' }}>
              Auto-recommend neutral colors using {selectedHarmony} harmony
            </label>
          </div>
          <div style={{ fontSize: '11px', color: '#797775', marginTop: '4px', fontStyle: 'italic' }}>
            All 13 neutral colors (neutralPrimary, neutralSecondary, etc.) will be generated using {selectedHarmony} harmony for professional cohesion.
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {/* Preview and Apply buttons only show after theme is saved */}
          {this.state.isEditMode && (
            <>
              <HOOButton
                type={HOOButtonType.Standard}
                label={isPreviewing ? "Previewing..." : "Preview Theme"}
                disabled={isPreviewing || isSaving || this.state.isUpdating || isApplying}
                onClick={this.previewTheme}
              />
              <HOOButton
                type={HOOButtonType.Standard}
                label={isApplying ? "Applying..." : "Apply to Site"}
                disabled={isApplying || isSaving || this.state.isUpdating || isPreviewing}
                onClick={this.applyThemeToSite}
              />
            </>
          )}
          <HOOButton
            type={HOOButtonType.Primary}
            label={
              isSaving ? "Saving..." : 
              this.state.isUpdating ? "Updating..." : 
              this.state.isEditMode ? "Update Theme" : "Save Theme"
            }
            disabled={isSaving || this.state.isUpdating || isPreviewing || isApplying || !themeName.trim()}
            onClick={this.saveTheme}
          />
          {/* New Theme button only shows in edit mode */}
          {this.state.isEditMode && (
            <HOOButton
              type={HOOButtonType.Standard}
              label="New Theme"
              disabled={isSaving || this.state.isUpdating || isPreviewing || isApplying}
              onClick={this.resetToNewTheme}
            />
          )}
        </div>
        <div style={{ fontSize: '11px', color: '#605e5c', marginTop: '4px' }}>
          {this.state.isEditMode ? (
            <>
              <strong>Preview:</strong> Test theme on current site • <strong>Apply:</strong> Confirm theme on current site • <strong>Update:</strong> Updates the saved theme • <strong>New Theme:</strong> Start creating a new theme
            </>
          ) : (
            <>
              <strong>Save Theme:</strong> Saves to tenant theme gallery (Preview and Apply buttons will appear after saving)
            </>
          )}
        </div>

        {/* Status Messages */}
        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {success && (
          <div className="success-message">
            {success}
          </div>
        )}

        {/* Monaco Editor Container */}
        <div ref={this.editorContainer} />
      </div>
    );
  }
}
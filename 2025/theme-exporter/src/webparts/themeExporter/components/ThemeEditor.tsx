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

interface IThemeEditorState {
  themeName: string;
  themeJson: string;
  primaryColor: string;
  neutralColor: string;
  selectedHarmony: ColorHarmony;
  autoRecommendNeutral: boolean;
  isSaving: boolean;
  isPreviewing: boolean;
  isApplying: boolean;
  isUpdating: boolean;
  isEditMode: boolean;
  editingThemeId?: number;
  error: string | undefined;
  success: string | undefined;
}

export default class ThemeEditor extends React.Component<IThemeEditorProps, IThemeEditorState> {
  private brandCenterService: BrandCenterService;
  private editorContainer: React.RefObject<HTMLDivElement>;
  private monacoEditor: monaco.editor.IStandaloneCodeEditor | null = null;

  constructor(props: IThemeEditorProps) {
    super(props);

    this.state = {
      themeName: this.props.editingTheme?.name || '',
      themeJson: this.props.editingTheme?.themeJson || this.getDefaultThemeJson(),
      primaryColor: '#0078d4',
      neutralColor: '#323130',
      selectedHarmony: 'complementary', // Default to complementary
      autoRecommendNeutral: true, // Default to true for better UX
      isSaving: false,
      isPreviewing: false,
      isApplying: false,
      isUpdating: false,
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
          backgroundColor: "#0078d4"
        }],
        dark: []
      }
    };
    return JSON.stringify(defaultTheme, null, 2);
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
      if (this.monacoEditor) {
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
    
    return {
      themeDarker: this.hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 30, 5)),
      themeDark: this.hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 20, 10)),
      themeDarkAlt: this.hslToHex(hsl.h, hsl.s, Math.max(hsl.l - 10, 15)),
      themePrimary: primaryColor,
      themeSecondary: this.hslToHex(hsl.h, Math.max(hsl.s - 10, 10), Math.min(hsl.l + 5, 95)),
      themeTertiary: this.hslToHex(hsl.h, Math.max(hsl.s - 25, 5), Math.min(hsl.l + 15, 95)),
      themeLight: this.hslToHex(hsl.h, Math.max(hsl.s - 35, 5), Math.min(hsl.l + 35, 95)),
      themeLighter: this.hslToHex(hsl.h, Math.max(hsl.s - 45, 5), Math.min(hsl.l + 50, 95)),
      themeLighterAlt: this.hslToHex(hsl.h, Math.max(hsl.s - 50, 5), Math.min(hsl.l + 70, 98))
    };
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
    const baseHsl = this.hexToHsl(primaryColor);
    
    // Get base hues from harmony for different neutral variations
    let baseHues: number[] = [];
    
    switch (harmony) {
      case 'complementary': {
        // Use primary and complement for warm/cool neutrals
        baseHues = [baseHsl.h, (baseHsl.h + 180) % 360];
        break;
      }
      case 'analogous': {
        // Use the three analogous colors
        baseHues = [
          baseHsl.h,
          (baseHsl.h + 30) % 360,
          (baseHsl.h - 30 + 360) % 360
        ];
        break;
      }
      case 'triadic': {
        // Use all three triadic colors
        baseHues = [
          baseHsl.h,
          (baseHsl.h + 120) % 360,
          (baseHsl.h + 240) % 360
        ];
        break;
      }
      case 'tetradic': {
        // Use all four tetradic colors
        baseHues = [
          baseHsl.h,
          (baseHsl.h + 90) % 360,
          (baseHsl.h + 180) % 360,
          (baseHsl.h + 270) % 360
        ];
        break;
      }
      case 'split-complementary': {
        // Use primary and split complement colors
        const complement = (baseHsl.h + 180) % 360;
        baseHues = [
          baseHsl.h,
          (complement - 30 + 360) % 360,
          (complement + 30) % 360
        ];
        break;
      }
      case 'monochromatic': {
        // Use only the base hue
        baseHues = [baseHsl.h];
        break;
      }
    }
    
    // Generate neutral colors using the harmony hues
    const getHueForLevel = (level: number): number => {
      return baseHues[level % baseHues.length];
    };
    
    return {
      black: this.hslToHex(getHueForLevel(0), 10, 5), // Very dark with primary hue
      neutralDark: this.hslToHex(getHueForLevel(0), 8, 12), // Dark text with primary hue
      neutralPrimary: this.hslToHex(getHueForLevel(0), 6, 20), // Primary neutral text
      neutralPrimaryAlt: this.hslToHex(getHueForLevel(1), 5, 30), // Alt primary with harmony hue
      neutralSecondary: this.hslToHex(getHueForLevel(1), 4, 45), // Secondary with harmony hue
      neutralTertiary: this.hslToHex(getHueForLevel(2), 3, 60), // Tertiary with different harmony hue
      neutralTertiaryAlt: this.hslToHex(getHueForLevel(2), 2, 72), // Borders with harmony variation
      neutralQuaternary: this.hslToHex(getHueForLevel(3), 2, 82), // Light borders
      neutralQuaternaryAlt: this.hslToHex(getHueForLevel(0), 1, 87), // Subtle borders
      neutralLight: this.hslToHex(getHueForLevel(1), 1, 92), // Light backgrounds
      neutralLighter: this.hslToHex(getHueForLevel(2), 1, 96), // Lighter backgrounds
      neutralLighterAlt: this.hslToHex(getHueForLevel(0), 1, 98), // Lightest backgrounds
      white: '#ffffff' // Always pure white
    };
  }

  /**
   * Generate neutral color variations based on neutral primary color (fallback method)
   */
  private generateNeutralColors(neutralColor: string): Record<string, string> {
    const hsl = this.hexToHsl(neutralColor);
    
    return {
      black: this.hslToHex(hsl.h, Math.min(hsl.s + 5, 15), Math.max(hsl.l - 15, 0)), // Very dark
      neutralDark: this.hslToHex(hsl.h, Math.min(hsl.s + 3, 12), Math.max(hsl.l - 8, 5)), // Dark text
      neutralPrimary: neutralColor, // Primary neutral (text)
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
  }

  private handlePrimaryColorChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const color = event.target.value;
    
    // Auto-recommend neutral color if enabled
    let newNeutralColor = this.state.neutralColor;
    if (this.state.autoRecommendNeutral) {
      newNeutralColor = this.generateNeutralFromHarmony(color, this.state.selectedHarmony);
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
        
        // Generate neutral color variations using harmony if auto-recommend is enabled
        let neutralColors = {};
        if (this.state.autoRecommendNeutral) {
          neutralColors = this.generateNeutralColorsFromHarmony(color, this.state.selectedHarmony);
        }
        
        // Update all colors
        if (parsedJson.palette) {
          Object.assign(parsedJson.palette, themeColors);
          if (this.state.autoRecommendNeutral) {
            Object.assign(parsedJson.palette, neutralColors);
          }
        }
        
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
        console.warn('Could not update JSON theme colors:', error);
      }
    }
  };

  private handleNeutralColorChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const color = event.target.value;
    this.setState({ neutralColor: color });
    
    // Update all neutral colors in the Monaco editor JSON
    if (this.monacoEditor) {
      try {
        const currentJson = this.monacoEditor.getValue();
        const parsedJson = JSON.parse(currentJson);
        
        // Generate neutral color variations - use harmony if auto-recommend is on
        let neutralColors;
        if (this.state.autoRecommendNeutral) {
          // Use harmony-based generation with the manually set neutral as base
          neutralColors = this.generateNeutralColorsFromHarmony(this.state.primaryColor, this.state.selectedHarmony);
        } else {
          // Use traditional single-color neutral generation
          neutralColors = this.generateNeutralColors(color);
        }
        
        // Update all neutral colors
        if (parsedJson.palette) {
          Object.assign(parsedJson.palette, neutralColors);
        }
        
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

      // Update the name in the JSON
      parsedJson.name = this.state.themeName;

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
        
        this.setState({
          isUpdating: false,
          isPreviewing: false,
          isApplying: false,
          success: `Theme "${this.state.themeName}" updated successfully!`
        });

      } else {
        // Create new theme
        const themeDataInput: IThemeDataInput = {
          name: this.state.themeName,
          themeJson: JSON.stringify(parsedJson),
          isVisible: true
        };

        const createdTheme = await this.brandCenterService.addTenantTheme(themeDataInput);
        
        // After successful creation, switch to edit mode for the newly created theme
        this.setState({
          isSaving: false,
          isPreviewing: false,
          isApplying: false,
          success: `Theme "${this.state.themeName}" created successfully! You can now preview and apply it.`,
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
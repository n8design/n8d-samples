import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { ThemeProvider, IReadonlyTheme } from '@microsoft/sp-component-base';

interface IThemeDebuggerProps {
  context: WebPartContext;
}

interface IThemeDebuggerState {
  currentTheme: IReadonlyTheme | undefined;
  pageContextTheme: unknown;
  domElementStyles: CSSStyleDeclaration | undefined;
}

export class ThemeDebugger extends React.Component<IThemeDebuggerProps, IThemeDebuggerState> {
  private themeProvider: ThemeProvider;

  constructor(props: IThemeDebuggerProps) {
    super(props);

    this.state = {
      currentTheme: undefined,
      pageContextTheme: undefined,
      domElementStyles: undefined
    };

    // Get the theme provider
    this.themeProvider = this.props.context.serviceScope.consume(ThemeProvider.serviceKey);
  }

  public componentDidMount(): void {
    // Get current theme from ThemeProvider
    const currentTheme = this.themeProvider.tryGetTheme();
    
    // Get theme from page context
    const pageContextTheme = (this.props.context.pageContext as unknown as { legacyPageContext?: { theme?: unknown } }).legacyPageContext?.theme;
    
    // Get computed styles from document.body or a themed element
    const domElementStyles = window.getComputedStyle(document.body);

    this.setState({
      currentTheme,
      pageContextTheme,
      domElementStyles
    });

    console.log('🎨 Theme Provider initialized', { currentTheme, pageContextTheme });
  }

  private renderThemeObject(theme: unknown, title: string): React.ReactElement {
    if (!theme) {
      return <div><strong>{title}:</strong> Not available</div>;
    }

    return (
      <div style={{ marginBottom: '20px' }}>
        <strong>{title}:</strong>
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '10px', 
          fontSize: '12px', 
          overflow: 'auto',
          maxHeight: '300px',
          border: '1px solid #ddd'
        }}>
          {JSON.stringify(theme, null, 2)}
        </pre>
      </div>
    );
  }

  private renderCSSVariables(): React.ReactElement {
    const { domElementStyles } = this.state;
    if (!domElementStyles) {
      return <div><strong>CSS Variables:</strong> Not available</div>;
    }

    // Extract CSS custom properties (variables)
    const cssVars: { [key: string]: string } = {};
    
    // Get all CSS custom properties from computed styles
    for (let i = 0; i < domElementStyles.length; i++) {
      const property = domElementStyles[i];
      if (property.startsWith('--theme') || property.startsWith('--neutral') || property.startsWith('--black')) {
        cssVars[property] = domElementStyles.getPropertyValue(property);
      }
    }

    return (
      <div style={{ marginBottom: '20px' }}>
        <strong>CSS Variables (from computed styles):</strong>
        <pre style={{ 
          background: '#f5f5f5', 
          padding: '10px', 
          fontSize: '12px', 
          overflow: 'auto',
          maxHeight: '300px',
          border: '1px solid #ddd'
        }}>
          {Object.keys(cssVars).length > 0 ? 
            Object.entries(cssVars).map(([key, value]) => `${key}: ${value}`).join('\n') :
            'No theme-related CSS variables found'
          }
        </pre>
      </div>
    );
  }

  private extractThemeColors(theme: IReadonlyTheme): {
    palette?: unknown;
    semanticColors?: unknown;
    effects?: unknown;
    fonts?: unknown;
    spacing?: unknown;
    isInverted?: boolean;
  } {
    if (!theme) return {};

    return {
      palette: theme.palette,
      semanticColors: theme.semanticColors,
      effects: theme.effects,
      fonts: theme.fonts,
      spacing: theme.spacing,
      isInverted: theme.isInverted
    };
  }

  public render(): React.ReactElement<IThemeDebuggerProps> {
    const { currentTheme, pageContextTheme } = this.state;
    
    // Extract detailed theme information
    const themeColors = currentTheme ? this.extractThemeColors(currentTheme) : null;

    return (
      <div style={{ padding: '20px', fontFamily: 'monospace' }}>
        <h2>🎨 SPFx Theme Debugger</h2>
        
        <div style={{ marginBottom: '30px' }}>
          <h3>Theme Sources Available:</h3>
          <ul>
            <li><strong>ThemeProvider.tryGetTheme():</strong> {currentTheme ? '✅ Available' : '❌ Not available'}</li>
            <li><strong>PageContext.legacyPageContext.theme:</strong> {pageContextTheme ? '✅ Available' : '❌ Not available'}</li>
            <li><strong>CSS Variables:</strong> ✅ Available</li>
          </ul>
        </div>

        {/* Current Theme from ThemeProvider */}
        {themeColors && (
          <>
            <h3>📋 Theme Object Structure</h3>
            {this.renderThemeObject(themeColors.palette, 'Palette Colors')}
            {this.renderThemeObject(themeColors.semanticColors, 'Semantic Colors')}
            {this.renderThemeObject(themeColors.effects, 'Effects')}
            {this.renderThemeObject(themeColors.fonts, 'Fonts')}
            {this.renderThemeObject(themeColors.spacing, 'Spacing')}
            <div><strong>Is Inverted:</strong> {themeColors.isInverted ? 'Yes' : 'No'}</div>
          </>
        )}

        {/* Page Context Theme */}
        {pageContextTheme && (
          <>
            <h3>🌐 Page Context Theme</h3>
            {this.renderThemeObject(pageContextTheme, 'Legacy Page Context Theme')}
          </>
        )}

        {/* CSS Variables */}
        <h3>🎛️ Runtime CSS Variables</h3>
        {this.renderCSSVariables()}

        {/* Full Current Theme */}
        <h3>🔍 Complete Current Theme Object</h3>
        {this.renderThemeObject(currentTheme, 'Full ThemeProvider Theme')}
      </div>
    );
  }
}
import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { BrandCenterService, IThemeDataInput } from '../../../services/BrandCenterService';
import HOOButton, { HOOButtonType } from '@n8d/htwoo-react/HOOButton';
// Using global classes from ThemeExporter.module.scss

export interface IThemeCreatorProps {
  context: WebPartContext;
}

interface IThemeCreatorState {
  isCreating: boolean;
  isCreated: boolean;
  error: string | undefined;
  createdThemeId: number | undefined;
}

export default class ThemeCreator extends React.Component<IThemeCreatorProps, IThemeCreatorState> {
  private brandCenterService: BrandCenterService;

  constructor(props: IThemeCreatorProps) {
    super(props);

    this.state = {
      isCreating: false,
      isCreated: false,
      error: undefined,
      createdThemeId: undefined
    };

    this.brandCenterService = new BrandCenterService(this.props.context);
  }

  private createPinkTextTheme = async (): Promise<void> => {
    this.setState({ 
      isCreating: true, 
      error: undefined, 
      isCreated: false,
      createdThemeId: undefined 
    });

    try {
      // Define the Pink Text Only theme
      const pinkTextTheme: IThemeDataInput = {
        name: "Super Super Pink",
        themeJson: JSON.stringify({
          name: "Super Super Pink",
          isInverted: false,
          palette: {
            themeDarker: "#ff1eb5",        // ← Pink for darkest theme elements
            themeDark: "#ff1eb5",          // ← Pink for dark theme elements
            themeDarkAlt: "#ff1eb5",       // ← Pink for dark alt theme elements
            themePrimary: "#ff1eb5",       // ← Pink for primary theme color
            themeSecondary: "#ff1eb5",     // ← Pink for secondary theme color
            themeTertiary: "#ff69c2",      // ← Lighter pink for tertiary
            themeLight: "#ffb3e0",         // ← Very light pink
            themeLighter: "#ffcceb",       // ← Ultra light pink
            themeLighterAlt: "#ffe6f5",    // ← Palest pink
            black: "#ff1eb5",              // ← Pink for high contrast text
            neutralDark: "#ff1eb5",        // ← Pink for primary body text
            neutralPrimary: "#ff1eb5",     // ← Pink for UI text
            neutralPrimaryAlt: "#e619a3",  // ← Darker pink for alt text
            neutralSecondary: "#ff1eb5",   // ← Pink for secondary text
            neutralTertiary: "#ff69c2",    // ← Lighter pink for tertiary text
            neutralTertiaryAlt: "#ffb3e0", // ← Light pink for tertiary alt
            neutralLight: "#edebe9",
            neutralLighter: "#f3f2f1",
            neutralLighterAlt: "#faf9f8",
            white: "#ffffff",
            neutralQuaternaryAlt: "#e1dfdd",
            neutralQuaternary: "#d0d0d0",
            backgroundColor: "#ffffff"
          },
          semanticColors: {
            bodyText: "#ff1eb5",           // ← Target body text specifically
            bodySubtext: "#ff1eb5",        // ← Target body subtext
            actionLink: "#ff1eb5",         // ← Target action links
            link: "#ff1eb5",               // ← Target regular links
            linkHovered: "#e619a3"         // ← Darker pink for hover
          },
          displayMode: "light",
          secondaryColors: {
            light: [{
              themePrimary: "#ffffff",
              backgroundColor: "#999999"
            }],
            dark: []
          }
        }),
        isVisible: true
      };

      // Create the theme using the service
      const createdTheme = await this.brandCenterService.addTenantTheme(pinkTextTheme);
      
      if (createdTheme) {
        this.setState({ 
          isCreating: false,
          isCreated: true,
          createdThemeId: createdTheme.id
        });
      } else {
        throw new Error('Theme creation returned no result');
      }

    } catch (error) {
      this.setState({
        error: `Failed to create theme: ${error instanceof Error ? error.message : 'Unknown error'}`,
        isCreating: false,
        isCreated: false
      });
    }
  };

  public render(): React.ReactElement<IThemeCreatorProps> {
    const { isCreating, isCreated, error, createdThemeId } = this.state;

    return (
      <div className="theme-creator">
        <h3>Theme Creator & Tester</h3>
        <p>Create a test theme with pink text to verify SharePoint theming integration.</p>
        
        <div className="button-container">
          <HOOButton
            type={HOOButtonType.Primary}
            disabled={isCreating || isCreated}
            onClick={this.createPinkTextTheme}
          >
            {isCreating ? 'Creating Theme...' : 'Create Pink Text Theme'}
          </HOOButton>
        </div>

        {/* Status Messages */}
        {isCreating && (
          <div className="status-message">
            🔄 Creating &ldquo;Pink Text Only Theme&rdquo;...
          </div>
        )}

        {isCreated && createdThemeId && (
          <div className="success-message">
            ✅ Theme created successfully!<br />
            🎨 Theme ID: {createdThemeId}<br />
            📝 Name: &ldquo;Pink Text Only Theme&rdquo;<br />
            💡 Apply this theme to see pink text in theme-aware components!
          </div>
        )}

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}

        {/* Instructions */}
        <div className="instructions">
          <h4>How to Test:</h4>
          <ol>
            <li>Click &ldquo;Create Pink Text Theme&rdquo; above</li>
            <li>Go to Site Settings → Change the look</li>
            <li>Apply the &ldquo;Pink Text Only Theme&rdquo;</li>
            <li>Return to this web part</li>
            <li>Text using theme tokens will be bright pink!</li>
          </ol>
        </div>
      </div>
    );
  }
}
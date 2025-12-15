import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { ThemeProvider } from '@microsoft/sp-component-base';
import { SPFxThemes, ISPFxThemes } from '@n8d/htwoo-react/SPFxThemes';

import * as strings from 'ThemeExporterWebPartStrings';
import ThemeExporter from './components/ThemeExporter';
import { IThemeExporterProps, IWebPartInstance } from './components/IThemeExporterProps';
import { ThemeCSSInjector, IThemeJson } from '../../utils/ThemeCSSInjector';



export interface IThemeExporterWebPartProps {
  // Add custom properties here as needed
}

export default class ThemeExporterWebPart extends BaseClientSideWebPart<IThemeExporterWebPartProps> implements IWebPartInstance {

  private _spfxThemes: ISPFxThemes = new SPFxThemes();
  private _themeCSSInjector: ThemeCSSInjector = ThemeCSSInjector.getInstance();

  public async onInit(): Promise<void> {
    // Consume the new ThemeProvider service
    const microsoftTeams = this.context.sdks?.microsoftTeams;
    const themeProvider = this.context.serviceScope.consume(ThemeProvider.serviceKey);
    this._spfxThemes.initThemeHandler(this.domElement, themeProvider, microsoftTeams);

    // If no ThemeProvider service, do not include property which will use page context
    this._spfxThemes.initThemeHandler(document.body);

    // 🎨 Listen for theme change events
    this.context.serviceScope.whenFinished(() => {
      themeProvider.themeChangedEvent.add(this, this._handleThemeChangedEvent);
    });
  }

  private _handleThemeChangedEvent(): void {
    console.log('🎨 Theme changed event received - refreshing web part');
    // Force re-render when theme changes
    this.render();
  }

  /**
   * Manually apply a theme to this web part (bypassing SharePoint ThemeProvider)
   * @param themeJson - Theme JSON object
   */
  public applyCustomTheme(themeJson: IThemeJson): void {
    console.log('🎨 Applying custom theme to web part:', themeJson);
    this._themeCSSInjector.injectThemeVariables(this.domElement, themeJson);
  }

  /**
   * Remove custom theme and revert to SharePoint theme
   */
  public removeCustomTheme(): void {
    console.log('🎨 Removing custom theme from web part');
    this._themeCSSInjector.removeThemeVariables(this.domElement);
  }

  public render(): void {
    const element: React.ReactElement<IThemeExporterProps> = React.createElement(
      ThemeExporter,
      {
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        context: this.context,
        webPartInstance: this
      }
    );

    ReactDom.render(element, this.domElement);

  }

  protected onDispose(): void {
    // Clean up theme change event listener
    const themeProvider = this.context.serviceScope.consume(ThemeProvider.serviceKey);
    themeProvider.themeChangedEvent.remove(this, this._handleThemeChangedEvent);
    
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                // Add property pane fields here as needed
              ]
            }
          ]
        }
      ]
    };
  }
}

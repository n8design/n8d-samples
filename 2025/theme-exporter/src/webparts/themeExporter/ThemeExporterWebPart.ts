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
import { IThemeExporterProps } from './components/IThemeExporterProps';



export interface IThemeExporterWebPartProps {
  // Add custom properties here as needed
}

export default class ThemeExporterWebPart extends BaseClientSideWebPart<IThemeExporterWebPartProps> {

  private _spfxThemes: ISPFxThemes = new SPFxThemes();

  public async onInit(): Promise<void> {
    // Consume the new ThemeProvider service
    const microsoftTeams = this.context.sdks?.microsoftTeams;
    const themeProvider = this.context.serviceScope.consume(ThemeProvider.serviceKey);
    this._spfxThemes.initThemeHandler(this.domElement, themeProvider, microsoftTeams);

    // If no ThemeProvider service, do not include property which will use page context
    this._spfxThemes.initThemeHandler(document.body);
  }

  public render(): void {
    const element: React.ReactElement<IThemeExporterProps> = React.createElement(
      ThemeExporter,
      {
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);

  }

  protected onDispose(): void {
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

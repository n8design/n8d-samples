import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IThemeJson } from '../../../utils/ThemeCSSInjector';

export interface IWebPartInstance {
  applyCustomTheme(themeJson: IThemeJson): void;
  removeCustomTheme(): void;
}

export interface IThemeExporterProps {
  hasTeamsContext: boolean;
  context: WebPartContext;
  webPartInstance?: IWebPartInstance;
}

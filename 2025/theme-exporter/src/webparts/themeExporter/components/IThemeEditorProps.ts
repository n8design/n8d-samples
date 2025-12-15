import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IThemeData } from '../../../services/BrandCenterService';
import { IWebPartInstance } from './IThemeExporterProps';

export interface IThemeEditorProps {
  context: WebPartContext;
  onThemeCreated?: (themeId: string) => void;
  editingTheme?: IThemeData; // Optional theme to edit/update
  webPartInstance?: IWebPartInstance; // Optional web part instance for direct theme application
}
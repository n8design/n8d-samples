import { WebPartContext } from '@microsoft/sp-webpart-base';
import { IThemeData } from '../../../services/BrandCenterService';

export interface IThemeEditorProps {
  context: WebPartContext;
  onThemeCreated?: (themeId: string) => void;
  editingTheme?: IThemeData; // Optional theme to edit/update
}
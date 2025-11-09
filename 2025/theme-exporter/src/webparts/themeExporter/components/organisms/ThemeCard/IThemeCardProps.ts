import { IThemeData } from '../../../../../services/BrandCenterService';
import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IThemeCardProps {
  themeData: IThemeData;
  themeName: string;
  context: WebPartContext;
  onThemeUpdated?: () => void;
  className?: string;
}
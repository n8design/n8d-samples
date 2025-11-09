import { WebPartContext } from '@microsoft/sp-webpart-base';

export interface IThemeCreatorProps {
  context: WebPartContext;
}

export interface IThemeCreatorState {
  isCreating: boolean;
  isCreated: boolean;
  error: string | undefined;
  createdThemeId: number | undefined;
}
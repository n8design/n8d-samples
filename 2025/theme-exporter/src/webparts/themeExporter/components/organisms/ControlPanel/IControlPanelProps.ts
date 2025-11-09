export interface IControlPanelProps {
  onGetSiteThemes: () => void;
  onGetTenantThemes: () => void;
  onClearResults: () => void;
  onToggleThemeEditor: () => void;
  loadingSiteThemes: boolean;
  loadingTenantThemes: boolean;
  showThemeEditor: boolean;
  className?: string;
}
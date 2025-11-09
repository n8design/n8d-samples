import * as React from 'react';
import { ButtonGroup } from '../../molecules';
import { IControlPanelProps } from './IControlPanelProps';

export const ControlPanel: React.FC<IControlPanelProps> = ({
  onGetSiteThemes,
  onGetTenantThemes,
  onClearResults,
  onToggleThemeEditor,
  loadingSiteThemes,
  loadingTenantThemes,
  showThemeEditor,
  className = ''
}) => {
  const buttons = [
    {
      key: 'getSiteThemes',
      label: 'Get Site Themes',
      variant: 'primary' as const,
      disabled: loadingSiteThemes,
      loading: loadingSiteThemes,
      onClick: onGetSiteThemes
    },
    {
      key: 'getTenantThemes',
      label: 'Get Tenant Themes',
      variant: 'primary' as const,
      disabled: loadingTenantThemes,
      loading: loadingTenantThemes,
      onClick: onGetTenantThemes
    },
    {
      key: 'clearResults',
      label: 'Clear Results',
      variant: 'secondary' as const,
      onClick: onClearResults
    },
    {
      key: 'toggleEditor',
      label: showThemeEditor ? 'Hide Editor' : 'Add Theme',
      variant: 'secondary' as const,
      onClick: onToggleThemeEditor
    }
  ];

  const panelClasses = [
    'atomic-control-panel',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={panelClasses}>
      <h2 className="title">SharePoint Theme Exporter</h2>
      <div className="button-container">
        <ButtonGroup buttons={buttons} spacing="md" />
      </div>
    </div>
  );
};

export default ControlPanel;
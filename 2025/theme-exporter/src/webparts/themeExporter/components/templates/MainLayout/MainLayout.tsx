import * as React from 'react';
import styles from '../../ThemeExporter.module.scss';

export interface IMainLayoutProps {
  title: string;
  controlPanel: React.ReactNode;
  themeEditor?: React.ReactNode;
  errorMessage?: React.ReactNode;
  siteThemes?: React.ReactNode;
  tenantThemes?: React.ReactNode;
  emptyState?: React.ReactNode;
  className?: string;
}

export const MainLayout: React.FC<IMainLayoutProps> = ({
  title,
  controlPanel,
  themeEditor,
  errorMessage,
  siteThemes,
  tenantThemes,
  emptyState,
  className = ''
}) => {
  const layoutClasses = [
    styles.themeExporter,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={layoutClasses}>
      <h1 className="title">{title}</h1>
      
      {/* Control Panel */}
      <div className="control-section">
        {controlPanel}
      </div>

      {/* Theme Editor */}
      {themeEditor && (
        <div className="editor-section">
          {themeEditor}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="message-section">
          {errorMessage}
        </div>
      )}

      {/* Content Area */}
      <div className="content-area">
        {siteThemes}
        {tenantThemes}
        {emptyState}
      </div>
    </div>
  );
};

export default MainLayout;
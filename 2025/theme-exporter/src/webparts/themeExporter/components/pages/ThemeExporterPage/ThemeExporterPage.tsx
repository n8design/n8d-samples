import * as React from 'react';
import { BrandCenterService, IThemeData } from '../../../../../services/BrandCenterService';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { MainLayout } from '../../templates';
import { ControlPanel, ThemeEditor, ThemeJsonEditor } from '../../organisms';
import { Message } from '../../atoms';

export interface IThemeExporterPageProps {
  context: WebPartContext;
}

interface IThemeExporterPageState {
  siteThemes: IThemeData[];
  tenantThemes: IThemeData[];
  loadingSiteThemes: boolean;
  loadingTenantThemes: boolean;
  error: string | undefined;
  showThemeEditor: boolean;
}

export class ThemeExporterPage extends React.Component<IThemeExporterPageProps, IThemeExporterPageState> {
  private brandCenterService: BrandCenterService;

  constructor(props: IThemeExporterPageProps) {
    super(props);

    this.state = {
      siteThemes: [],
      tenantThemes: [],
      loadingSiteThemes: false,
      loadingTenantThemes: false,
      error: undefined,
      showThemeEditor: false
    };

    this.brandCenterService = new BrandCenterService(this.props.context);
  }

  private getSiteThemes = async (): Promise<void> => {
    this.setState({ loadingSiteThemes: true, error: undefined });
    try {
      const response = await this.brandCenterService.getSiteThemes();
      this.setState({ 
        siteThemes: response.themeData,
        loadingSiteThemes: false 
      });
    } catch (error) {
      this.setState({ 
        error: `Error loading site themes: ${error instanceof Error ? error.message : 'Unknown error'}`,
        loadingSiteThemes: false 
      });
    }
  };

  private getTenantThemes = async (): Promise<void> => {
    this.setState({ loadingTenantThemes: true, error: undefined });
    try {
      const response = await this.brandCenterService.getTenantThemes();
      this.setState({ 
        tenantThemes: response.themeData,
        loadingTenantThemes: false 
      });
    } catch (error) {
      this.setState({ 
        error: `Error loading tenant themes: ${error instanceof Error ? error.message : 'Unknown error'}`,
        loadingTenantThemes: false 
      });
    }
  };

  private clearResults = (): void => {
    this.setState({
      siteThemes: [],
      tenantThemes: [],
      error: undefined
    });
  };

  private toggleThemeEditor = (): void => {
    this.setState({
      showThemeEditor: !this.state.showThemeEditor
    });
  };

  public render(): React.ReactElement<IThemeExporterPageProps> {
    const { siteThemes, tenantThemes, loadingSiteThemes, loadingTenantThemes, error, showThemeEditor } = this.state;

    const controlPanel = (
      <ControlPanel
        onGetSiteThemes={this.getSiteThemes}
        onGetTenantThemes={this.getTenantThemes}
        onClearResults={this.clearResults}
        onToggleThemeEditor={this.toggleThemeEditor}
        loadingSiteThemes={loadingSiteThemes}
        loadingTenantThemes={loadingTenantThemes}
        showThemeEditor={showThemeEditor}
      />
    );

    const themeEditor = showThemeEditor && (
      <ThemeEditor 
        context={this.props.context}
        onThemeCreated={(themeId: string) => {
          console.log('Theme created with ID:', themeId);
          this.toggleThemeEditor();
          if (tenantThemes.length > 0) {
            this.getTenantThemes().catch(console.error);
          }
          if (siteThemes.length > 0) {
            this.getSiteThemes().catch(console.error);
          }
        }}
      />
    );

    const errorMessage = error && (
      <Message message={error} type="error" />
    );

    const siteThemesSection = siteThemes.length > 0 && (
      <div>
        <h3>Site Themes ({siteThemes.length})</h3>
        <div className="theme-grid">
          {siteThemes.map((theme, index) => (
            <ThemeJsonEditor 
              key={`site-${theme.id}-${theme.name}`}
              themeData={theme} 
              themeName={theme.name} 
              context={this.props.context}
              onThemeUpdated={() => this.getSiteThemes().catch(console.error)}
            />
          ))}
        </div>
      </div>
    );

    const tenantThemesSection = tenantThemes.length > 0 && (
      <div>
        <h3>Tenant Themes ({tenantThemes.length})</h3>
        <div className="theme-grid">
          {tenantThemes.map((theme, index) => (
            <ThemeJsonEditor 
              key={`tenant-${theme.id}-${theme.name}`}
              themeData={theme} 
              themeName={theme.name} 
              context={this.props.context}
              onThemeUpdated={() => this.getTenantThemes().catch(console.error)}
            />
          ))}
        </div>
      </div>
    );

    const emptyState = !loadingSiteThemes && !loadingTenantThemes && siteThemes.length === 0 && tenantThemes.length === 0 && !error && (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
        Click &quot;Get Site Themes&quot; or &quot;Get Tenant Themes&quot; to retrieve and display theme data.
      </div>
    );

    return (
      <MainLayout
        title="SharePoint Theme Management"
        controlPanel={controlPanel}
        themeEditor={themeEditor}
        errorMessage={errorMessage}
        siteThemes={siteThemesSection}
        tenantThemes={tenantThemesSection}
        emptyState={emptyState}
      />
    );
  }
}

export default ThemeExporterPage;
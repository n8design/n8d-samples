import * as React from 'react';
import type { IThemeExporterProps } from './IThemeExporterProps';
import { BrandCenterService, IThemeData } from '../../../services/BrandCenterService';
import { ThemeJsonEditor } from './ThemeJsonEditor';
import ThemeEditor from './ThemeEditor';
import HOOButton, { HOOButtonType } from '@n8d/htwoo-react/HOOButton';
import styles from './ThemeExporter.module.scss';

interface IThemeExporterState {
  siteThemes: IThemeData[];
  tenantThemes: IThemeData[];
  loadingSiteThemes: boolean;
  loadingTenantThemes: boolean;
  error: string | undefined;
  showThemeEditor: boolean;
}

export default class ThemeExporter extends React.Component<IThemeExporterProps, IThemeExporterState> {
  private brandCenterService: BrandCenterService;

  constructor(props: IThemeExporterProps) {
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

  public render(): React.ReactElement<IThemeExporterProps> {
    const { siteThemes, tenantThemes, loadingSiteThemes, loadingTenantThemes, error } = this.state;

    return (
            <div className={styles.themeExporter}>
        <h2>SharePoint Theme Exporter</h2>
        
        {/* Button Container */}
        <div className={styles.buttonContainer}>
          <HOOButton
            type={HOOButtonType.Primary}
            label="Get Site Themes"
            disabled={loadingSiteThemes}
            onClick={() => this.getSiteThemes().catch(console.error)}
          />
          
          <HOOButton
            type={HOOButtonType.Primary}
            label="Get Tenant Themes"
            disabled={loadingTenantThemes}
            onClick={() => this.getTenantThemes().catch(console.error)}
          />

          <HOOButton
            type={HOOButtonType.Primary}
            label="Clear Results"
            onClick={() => this.clearResults()}
          />

          <HOOButton
            type={HOOButtonType.Standard}
            label={this.state.showThemeEditor ? "Hide Editor" : "Add Theme"}
            onClick={() => this.toggleThemeEditor()}
          />
        </div>

        {/* Advanced Theme Editor */}
        {this.state.showThemeEditor && (
          <ThemeEditor 
            context={this.props.context}
            onThemeCreated={(themeId) => {
              console.log('Theme created with ID:', themeId);
              // Refresh theme lists and close editor
              this.toggleThemeEditor();
              if (this.state.tenantThemes.length > 0) {
                this.getTenantThemes().catch(console.error);
              }
              if (this.state.siteThemes.length > 0) {
                this.getSiteThemes().catch(console.error);
              }
            }}
          />
        )}

        {/* Error Display */}
        {error && (
          <div>
            {error}
          </div>
        )}

        {/* Site Themes Results */}
        {siteThemes.length > 0 && (
          <div>
            <h3>Site Themes ({siteThemes.length})</h3>
            <div className={styles.themeGrid}>
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
        )}

        {/* Tenant Themes Results */}
        {tenantThemes.length > 0 && (
          <div>
            <h3>Tenant Themes ({tenantThemes.length})</h3>
            <div className={styles.themeGrid}>
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
        )}        {/* No Results Message */}
        {!loadingSiteThemes && !loadingTenantThemes && siteThemes.length === 0 && tenantThemes.length === 0 && !error && (
          <div>
            Click &quot;Get Site Themes&quot; or &quot;Get Tenant Themes&quot; to retrieve and display theme data.
          </div>
        )}
      </div>
    );
  }
}

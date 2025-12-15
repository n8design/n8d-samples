import * as React from 'react';
import type { IThemeExporterProps } from './IThemeExporterProps';
import ThemeExporterPage from './pages/ThemeExporterPage';
import { ThemeDebugger } from './molecules/ThemeDebugger';
import HOOButton, { HOOButtonType } from '@n8d/htwoo-react/HOOButton';

interface IThemeExporterState {
  showDebugger: boolean;
}

/**
 * Refactored ThemeExporter using Atomic Design principles
 * This component now acts as a simple wrapper that delegates to the ThemeExporterPage
 */
export default class ThemeExporter extends React.Component<IThemeExporterProps, IThemeExporterState> {
  
  constructor(props: IThemeExporterProps) {
    super(props);
    this.state = {
      showDebugger: false
    };
  }

  private toggleDebugger = (): void => {
    this.setState({ showDebugger: !this.state.showDebugger });
  };

  public render(): React.ReactElement<IThemeExporterProps> {
    return (
      <div>
        {/* Debug Toggle Button */}
        <div style={{ marginBottom: '10px', textAlign: 'right' }}>
          <HOOButton 
            type={HOOButtonType.Standard}
            onClick={this.toggleDebugger}
            label={this.state.showDebugger ? '🔍 Hide Theme Debugger' : '🔍 Show Theme Debugger'}
          />
        </div>

        {/* Theme Debugger - Only show when toggled */}
        {this.state.showDebugger && (
          <>
            <ThemeDebugger context={this.props.context} />
            <hr style={{ margin: '20px 0' }} />
          </>
        )}

        {/* Main Theme Exporter Page */}
        <ThemeExporterPage 
          context={this.props.context} 
          webPartInstance={this.props.webPartInstance}
        />
      </div>
    );
  }
}

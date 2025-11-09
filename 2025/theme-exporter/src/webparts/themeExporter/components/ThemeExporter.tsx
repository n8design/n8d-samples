import * as React from 'react';
import type { IThemeExporterProps } from './IThemeExporterProps';
import ThemeExporterPage from './pages/ThemeExporterPage';

/**
 * Refactored ThemeExporter using Atomic Design principles
 * This component now acts as a simple wrapper that delegates to the ThemeExporterPage
 */
export default class ThemeExporter extends React.Component<IThemeExporterProps> {
  public render(): React.ReactElement<IThemeExporterProps> {
    return (
      <ThemeExporterPage context={this.props.context} />
    );
  }
}

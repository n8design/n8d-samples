import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './ScssPipelineProbeWebPart.module.scss';
import plain from './Probe.scss';
import importForms from './ImportForms.module.scss';
// .global.scss exports no class map - side-effect import only (typing is `export {}`).
import './Probe.global.scss';

export interface IScssPipelineProbeWebPartProps {}

// Section 1 evidence: what the heft pipeline actually does to class names
// and which Sass import forms compile. The runtime column is read live from
// the bundle, so it reflects whatever SPFx version this was built with.
const IMPORT_FORMS: [string, boolean][] = [
  ['@use \'~@scope/pkg/file\' (line start)', true],
  ['@import \'~@scope/pkg/file\' (line start)', true],
  ['@use \'pkg:@scope/pkg/file\'', true],
  ['meta.load-css(\'pkg:@scope/pkg/file\')', true],
  ['@use \'@scope/pkg/file\' (bare, no tilde)', false],
  ['@use \'node_modules/@scope/pkg/file\'', false],
  ['meta.load-css(\'~@scope/pkg/file\')', false],
  ['.x { @import \'~@scope/pkg/file\'; } (nested)', false]
];

export default class ScssPipelineProbeWebPart extends BaseClientSideWebPart<IScssPipelineProbeWebPartProps> {

  public render(): void {
    const hashed = (value: string | undefined): string =>
      value === undefined
        ? `<span class="${styles.fail}">undefined</span>`
        : /_[0-9a-f]{8}$/.test(value)
          ? `<span class="${styles.ok}">hashed</span>`
          : 'not hashed';

    const rows: [string, string, string | undefined][] = [
      ['X.module.scss', 'card', styles.card],
      ['X.scss (plain)', 'plainClass', plain.plainClass],
      ['X.module.scss (tilde @use)', 'tildeImport', importForms.tildeImport],
      ['X.module.scss (pkg: @use)', 'pkgImport', importForms.pkgImport]
    ];

    this.domElement.innerHTML = `
      <section class="${styles.scssPipelineProbe}">
        <h3>Class names at runtime</h3>
        <table>
          <thead><tr><th>File</th><th>Key</th><th>Runtime value</th><th>Result</th></tr></thead>
          <tbody>
            ${rows.map(([file, key, value]) => `
              <tr><td>${file}</td><td><code>${key}</code></td>
              <td><code>${escape(String(value))}</code></td><td>${hashed(value)}</td></tr>`).join('')}
            <tr><td>X.global.scss</td><td><code>n8d-probe-global</code></td>
              <td><code>n8d-probe-global</code></td><td>global by design</td></tr>
          </tbody>
        </table>
        <p class="${plain.plainClass}">This paragraph uses the plain .scss class.</p>
        <p class="n8d-probe-global">This paragraph uses the .global.scss class.</p>

        <h3>Sass package-import forms (build-verified on SPFx 1.23.2 / heft-sass-plugin 1.4.1)</h3>
        <table>
          <thead><tr><th>Form</th><th>Compiles</th></tr></thead>
          <tbody>
            ${IMPORT_FORMS.map(([form, ok]) => `
              <tr><td><code>${escape(form)}</code></td>
              <td class="${ok ? styles.ok : styles.fail}">${ok ? 'yes' : 'no'}</td></tr>`).join('')}
          </tbody>
        </table>
      </section>`;
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}

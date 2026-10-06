import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  ThemeProvider,
  type ThemeChangedEventArgs,
  type IReadonlyTheme
} from '@microsoft/sp-component-base';

import styles from './ThemeBackgroundWebPart.module.scss';
import { applyThemeSlots } from '../../common/ThemeService';

export interface IThemeBackgroundWebPartProps {}

const SHOWN_SLOTS = ['bodyBackground', 'bodyText', 'bodySubtext', 'link', 'themePrimary', 'themeLighter', 'bodyDivider'];

// Section 5: section background variants.
// Ported from n8d-samples/2025/brandcenter/src/webparts/brandColors/BrandColorsWebPart.ts.
// Change the section background (Section > Background) and the web part repaints
// because the theme is re-mapped onto custom properties on the root.
export default class ThemeBackgroundWebPart extends BaseClientSideWebPart<IThemeBackgroundWebPartProps> {

  private _themeProvider: ThemeProvider | undefined;
  private _theme: IReadonlyTheme | undefined;

  protected onInit(): Promise<void> {
    this._themeProvider = this.context.serviceScope.consume(ThemeProvider.serviceKey);
    this._theme = this._themeProvider.tryGetTheme();
    this._themeProvider.themeChangedEvent.add(this, this._handleThemeChangedEvent);
    return super.onInit();
  }

  public render(): void {
    const slots = applyThemeSlots(this.domElement, this._theme);

    this.domElement.innerHTML = `
      <section class="${styles.themeBackground}">
        <h3>Section theme variant</h3>
        <p>isInverted: <strong>${this._theme?.isInverted ? 'true (dark section)' : 'false'}</strong>
          - ${Object.keys(slots).length} slots mapped onto this web part's root</p>
        <ul class="${styles.slots}">
          ${SHOWN_SLOTS.map(slot => `
            <li><span class="${styles.chip}" style="background-color:var(--${slot})"></span>
              <code>--${slot}</code> <code>${slots[slot] || 'missing'}</code></li>`).join('')}
        </ul>
        <div class="${styles.translucent}">
          <code>rgb(from var(--bodyBackground) r g b / 60%)</code> - relative colour syntax,
          no colour maths in TypeScript.
        </div>
      </section>`;
  }

  private _handleThemeChangedEvent(args: ThemeChangedEventArgs): void {
    this._theme = args.theme;
    this.render();
  }

  protected onDispose(): void {
    this._themeProvider?.themeChangedEvent.remove(this, this._handleThemeChangedEvent);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}

import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import type { IReadonlyTheme } from '@microsoft/sp-component-base';

import styles from './PropertyAnimationWebPart.module.scss';
import { applyThemeSlots } from '../../common/ThemeService';

export interface IPropertyAnimationWebPartProps {}

export default class PropertyAnimationWebPart extends BaseClientSideWebPart<IPropertyAnimationWebPartProps> {

  public render(): void {
    const supported = typeof CSS !== 'undefined' && 'registerProperty' in CSS;

    this.domElement.innerHTML = `
      <section class="${styles.propertyAnimation}">
        <div class="${styles.panels}">
          <div class="${styles.panel}">
            <h4>1. Animate a theme value</h4>
            <div class="${styles.box} ${styles.registered}"></div>
            <p>Registered <code>&lt;color&gt;</code>: interpolates.</p>
            <div class="${styles.box} ${styles.unregistered}"></div>
            <p>Unregistered: snaps.</p>
            <button type="button" class="${styles.button}" data-toggle>Toggle theme state</button>
          </div>

          <div class="${styles.panel}">
            <h4>2. inherits: false as a barrier</h4>
            <div class="${styles.barrierParent}">
              <div class="${styles.box} ${styles.sealed}"></div>
              <p>inherits: false - ignores the red set above it, uses its own initial value.</p>
              <div class="${styles.box} ${styles.open}"></div>
              <p>inherits: true - picks up the red from the ancestor.</p>
            </div>
          </div>

          <div class="${styles.panel}">
            <h4>3. initial-value for a missing slot</h4>
            <div class="${styles.box} ${styles.safe}"></div>
            <p>Registered: missing theme slot falls back to initial-value.</p>
            <div class="${styles.box} ${styles.unsafe}"></div>
            <p>Unregistered: missing theme slot leaves no colour at all.</p>
          </div>

          <div class="${styles.panel}">
            <h4>4. Support</h4>
            <p>CSS.registerProperty available: <strong>${supported ? 'yes' : 'no'}</strong></p>
            <p>Without support every demo above still renders; transitions snap and
              inherits/initial-value are ignored - so always pair with var() fallbacks
              that are acceptable on their own.</p>
          </div>
        </div>
      </section>`;

    const section = this.domElement.firstElementChild as HTMLElement;
    (this.domElement.querySelector('[data-toggle]') as HTMLButtonElement)
      .addEventListener('click', () => section.classList.toggle(styles.active));
  }

  protected onThemeChanged(currentTheme: IReadonlyTheme | undefined): void {
    applyThemeSlots(this.domElement, currentTheme);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}

import { Version } from '@microsoft/sp-core-library';
import { type IPropertyPaneConfiguration, PropertyPaneToggle } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import { renderCollisionDemo, type ICollisionClasses } from '../../common/collisionDemo';

export interface ITokenCollisionAWebPartProps {
  prefixed: boolean;
}

// Only the stylesheet for the selected mode is loaded, so the colliding
// rules never reach the page in "prefixed" mode.
export default class TokenCollisionAWebPart extends BaseClientSideWebPart<ITokenCollisionAWebPartProps> {

  private _classes: ICollisionClasses | undefined;

  protected onInit(): Promise<void> {
    return this._loadSheet();
  }

  protected onPropertyPaneFieldChanged(): void {
    this._loadSheet().then(() => this.render(), () => undefined);
  }

  private async _loadSheet(): Promise<void> {
    const sheet = this.properties.prefixed
      ? await import(/* webpackChunkName: 'collision-a-prefixed' */ './Prefixed.module.scss')
      : await import(/* webpackChunkName: 'collision-a-collide' */ './Collide.module.scss');
    this._classes = sheet.default;
  }

  public render(): void {
    if (!this._classes) {
      return;
    }
    renderCollisionDemo(this.domElement, this._classes, {
      label: 'Web part A',
      intended: '#c50f1f',
      token: this.properties.prefixed ? '--n8d-a-accent' : '--card-accent',
      prefixed: !!this.properties.prefixed
    });
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [{
        groups: [{
          groupName: 'Collision demo',
          groupFields: [
            PropertyPaneToggle('prefixed', {
              label: 'Use prefixed tokens (--n8d-a-*)',
              onText: 'Prefixed',
              offText: 'Shared names'
            })
          ]
        }]
      }]
    };
  }
}

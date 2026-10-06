import { Version } from '@microsoft/sp-core-library';
import { type IPropertyPaneConfiguration, PropertyPaneToggle } from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import { renderCollisionDemo, type ICollisionClasses } from '../../common/collisionDemo';

export interface ITokenCollisionBWebPartProps {
  prefixed: boolean;
}

// Only the stylesheet for the selected mode is loaded, so the colliding
// rules never reach the page in "prefixed" mode.
export default class TokenCollisionBWebPart extends BaseClientSideWebPart<ITokenCollisionBWebPartProps> {

  private _classes: ICollisionClasses | undefined;

  protected onInit(): Promise<void> {
    return this._loadSheet();
  }

  protected onPropertyPaneFieldChanged(): void {
    this._loadSheet().then(() => this.render(), () => undefined);
  }

  private async _loadSheet(): Promise<void> {
    const sheet = this.properties.prefixed
      ? await import(/* webpackChunkName: 'collision-b-prefixed' */ './Prefixed.module.scss')
      : await import(/* webpackChunkName: 'collision-b-collide' */ './Collide.module.scss');
    this._classes = sheet.default;
  }

  public render(): void {
    if (!this._classes) {
      return;
    }
    renderCollisionDemo(this.domElement, this._classes, {
      label: 'Web part B',
      intended: '#0f6cbd',
      token: this.properties.prefixed ? '--n8d-b-accent' : '--card-accent',
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
              label: 'Use prefixed tokens (--n8d-b-*)',
              onText: 'Prefixed',
              offText: 'Shared names'
            })
          ]
        }]
      }]
    };
  }
}

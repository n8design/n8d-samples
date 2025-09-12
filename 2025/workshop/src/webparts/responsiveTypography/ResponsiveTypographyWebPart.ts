import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import styles from './ResponsiveTypographyWebPart.module.scss';

export interface IResponsiveTypographyWebPartProps {
}

export default class ResponsiveTypographyWebPart extends BaseClientSideWebPart<IResponsiveTypographyWebPartProps> {
  public render(): void {
    this.domElement.innerHTML = `<div class="${ styles.responsiveTypography }">BRANSON MO</div>`;
  }

  protected onInit(): Promise<void> {
    return super.onInit();
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}

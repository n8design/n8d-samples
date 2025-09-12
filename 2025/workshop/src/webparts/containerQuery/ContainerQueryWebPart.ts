import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import styles from './ContainerQueryWebPart.module.scss';

export interface IContainerQueryWebPartProps {
}

export default class ContainerQueryWebPart extends BaseClientSideWebPart<IContainerQueryWebPartProps> {
  public render(): void {
    this.domElement.classList.add(styles.outerContainer);
    this.domElement.innerHTML = `<div class="${ styles.containerQuery }">&nbsp;</div>`;
    
  }

  protected onInit(): Promise<void> {
    return super.onInit();
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}

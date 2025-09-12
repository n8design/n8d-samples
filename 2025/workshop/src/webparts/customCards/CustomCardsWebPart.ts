import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import styles from './CustomCardsWebPart.module.scss';

import BaseCard from '../../common/molecules/baseCard';

export interface ICustomCardsWebPartProps {
}

export default class CustomCardsWebPart extends BaseClientSideWebPart<ICustomCardsWebPartProps> {
  public render(): void {
    this.domElement.classList.add(styles.customCards);

    console.debug('BASECARD', BaseCard());
    this.domElement.appendChild(BaseCard());
  }

  protected onInit(): Promise<void> {
    return super.onInit();
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}

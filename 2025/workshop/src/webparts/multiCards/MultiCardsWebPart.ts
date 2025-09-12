import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import styles from './MultiCardsWebPart.module.scss';
import BaseCard from '../../common/molecules/baseCard';

export interface IMultiCardsWebPartProps {
}

export default class MultiCardsWebPart extends BaseClientSideWebPart<IMultiCardsWebPartProps> {
  public render(): void {
    this.domElement.classList.add(styles.multiCards);

    console.debug('BASECARD', BaseCard());
    this.domElement.appendChild(BaseCard());
    this.domElement.appendChild(BaseCard());
    this.domElement.appendChild(BaseCard());
    
  }

  protected onInit(): Promise<void> {
    return super.onInit();
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}

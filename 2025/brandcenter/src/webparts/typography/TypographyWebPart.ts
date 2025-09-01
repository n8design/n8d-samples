import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import { FontShowCase } from './components/FontShowCase';

import styles from './TypographyWebPart.module.scss';

export interface ITypographyWebPartProps {
}

export default class TypographyWebPart extends BaseClientSideWebPart<ITypographyWebPartProps> {
  public render(): void {
    this.domElement.classList.add(styles.typography);

    FontShowCase.showDefaultFontSlots(this.domElement);
    FontShowCase.showcaseAllGothamFonts(this.domElement);
    FontShowCase.showcaseAllCrimsonTextFonts(this.domElement);

  }

  protected onInit(): Promise<void> {
    return super.onInit();
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}



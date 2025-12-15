import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import styles from './SvgMagicWebPart.module.scss';
import { SvgMagic } from './components/svgMagic';

export interface ISvgMagicWebPartProps {
}

export default class SvgMagicWebPart extends BaseClientSideWebPart<ISvgMagicWebPartProps> {
  public async render(): Promise<void> {
    this.domElement.innerHTML = `<div class="${styles.svgMagic}">
    <svg width="0" height="0" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="myGradient" gradientTransform="rotate(45)">
          <stop offset="0%" stop-color="rgba(131, 58, 180, 1)" />
          <stop offset="50%" stop-color="rgba(253, 29, 29, 1)" />
          <stop offset="100%" stop-color="rgba(252, 176, 69, 1)" />
        </linearGradient>
      </defs>
    </svg></div>`;
    // this.domElement.firstChild?.appendChild(SvgMagic.getSVGRef('deer'));
    const svgDoc = await SvgMagic.getSvg('deer');
    this.domElement.firstChild?.appendChild(svgDoc);
    const logo = await SvgMagic.getSvg('n8d');
    this.domElement.firstChild?.appendChild(logo);
    const jumpingBars = await SvgMagic.getSvg('jumping-bars');
    this.domElement.firstChild?.appendChild(jumpingBars);
  }

  protected onInit(): Promise<void> {
    return super.onInit();
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}

import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import styles from './SlideShowWebPart.module.scss';

import Splide from '@splidejs/splide';

export interface ISlideShowWebPartProps {
}

export default class SlideShowWebPart extends BaseClientSideWebPart<ISlideShowWebPartProps> {
  public render(): void {
    this.domElement.innerHTML = `<div class="${styles.slideShow}">
    <section class="splide" aria-labelledby="carousel-heading">
  <h2 id="carousel-heading">Splide Basic HTML Example</h2>

  <div class="splide__track">
		<ul class="splide__list">
			<li class="splide__slide ${styles.slide}"><img src="https://picsum.photos/400/200?random=1"></li>
			<li class="splide__slide ${styles.slide}"><img src="https://picsum.photos/400/200?random=2"></li>
			<li class="splide__slide ${styles.slide}"><img src="https://picsum.photos/400/200?random=3"></li>
		</ul>
  </div>
</section>
    </div>`;
    // mount slide show
    new Splide('.splide'
    ).mount();
  }



  protected onInit(): Promise<void> {
    return super.onInit();
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
}

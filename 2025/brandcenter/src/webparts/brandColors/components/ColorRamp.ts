import styles from './ColorRamp.module.scss';
import * as ColorBaseSettings from './ColorBaseSettings';

const domParser = new DOMParser();



export class ColorRamp {

    constructor() {
        // Default constructor
    }

    public render(container: HTMLElement, paletteColors: { [key: string]: string }): void {
        console.debug('ColorRamp render() called with paletteColors:', ColorBaseSettings.neutralColorItems);
        console.debug('ColorRamp render() called with paletteColors:', ColorBaseSettings.themeColorItems);
        console.debug('styles:', styles);

        const innerContainer = container.appendChild(document.createElement('div'));
        innerContainer.className = styles.colorRamps;


        innerContainer.append(this.createSectionLabel('Neutral Colors'));

        ColorBaseSettings.neutralColorItems.forEach(item => {
            console.debug('Neutral Color Item:', this.createColorSwatch(item));
            this.createColorSwatch(item)
            innerContainer.appendChild(this.createColorSwatch(item));
        })

        innerContainer.append(this.createSectionLabel('Theme Colors'));

        ColorBaseSettings.themeColorItems.forEach(item => {
            console.debug('Theme Color Item:', this.createColorSwatch(item));
            this.createColorSwatch(item)
            innerContainer.appendChild(this.createColorSwatch(item));
        })

        // Add all the hTWOo color families
        innerContainer.append(this.createSectionLabel('Blue Colors'));
        ColorBaseSettings.blueColorItems.forEach(item => {
            innerContainer.appendChild(this.createColorSwatch(item));
        });

        innerContainer.append(this.createSectionLabel('Green Colors'));
        ColorBaseSettings.greenColorItems.forEach(item => {
            innerContainer.appendChild(this.createColorSwatch(item));
        });

        innerContainer.append(this.createSectionLabel('Red Colors'));
        ColorBaseSettings.redColorItems.forEach(item => {
            innerContainer.appendChild(this.createColorSwatch(item));
        });

        innerContainer.append(this.createSectionLabel('Orange Colors'));
        ColorBaseSettings.orangeColorItems.forEach(item => {
            innerContainer.appendChild(this.createColorSwatch(item));
        });

        innerContainer.append(this.createSectionLabel('Yellow Colors'));
        ColorBaseSettings.yellowColorItems.forEach(item => {
            innerContainer.appendChild(this.createColorSwatch(item));
        });

        innerContainer.append(this.createSectionLabel('Teal Colors'));
        ColorBaseSettings.tealColorItems.forEach(item => {
            innerContainer.appendChild(this.createColorSwatch(item));
        });

        innerContainer.append(this.createSectionLabel('Purple Colors'));
        ColorBaseSettings.purpleColorItems.forEach(item => {
            innerContainer.appendChild(this.createColorSwatch(item));
        });

        innerContainer.append(this.createSectionLabel('Magenta Colors'));
        ColorBaseSettings.magentaColorItems.forEach(item => {
            innerContainer.appendChild(this.createColorSwatch(item));
        });

        innerContainer.append(this.createSectionLabel('Button Colors'));
        ColorBaseSettings.buttonColorItems.forEach(item => {
            innerContainer.appendChild(this.createColorSwatch(item));
        });


    }

    private createColorSwatch(item: ColorBaseSettings.ColorItem): HTMLDivElement {

        return domParser.parseFromString(`
            <div class=${styles.colorRamp}>
                <div class=${styles.colorRampIndex}>
                ${item.designToken}
                </div>
                <div class="${styles.colorSwatch}" style="background-color: ${item.colorValue}">
                
                </div>
                <div>${item.msftName}</div>
            </div>
        `, 'text/html').body.firstChild as HTMLDivElement;

    }

    private createSectionLabel(label: string): HTMLHeadingElement {
        const sectionTitle = document.createElement('h2');
        sectionTitle.classList.add(styles.sectionTitle);
        sectionTitle.textContent = label;
        return sectionTitle;
    }
}

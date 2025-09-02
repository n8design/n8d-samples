import styles from './ColorRamp.module.scss';
import * as ColorBaseSettings from './ColorBaseSettings';

const domParser = new DOMParser();



export class ColorRamp {

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
            console.debug('Neutral Color Item:', this.createColorSwatch(item));
            this.createColorSwatch(item)
            innerContainer.appendChild(this.createColorSwatch(item));
        })


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
    //     // Clear container
    //     container.innerHTML = '';

    //     // Create main wrapper
    //     const wrapper = document.createElement('div');
    //     wrapper.className = styles.colorRamp;

    //     // Predefined neutral color items


    //     // Create theme colors section
    //     const themeSection = document.createElement('div');
    //     themeSection.className = styles.categorySection;

    //     // Create theme category title
    //     const themeTitle = document.createElement('h3');
    //     themeTitle.className = styles.categoryTitle;
    //     themeTitle.textContent = 'Theme Colors';
    //     themeSection.appendChild(themeTitle);

    //     // Create theme color grid (ul)
    //     const themeColorGrid = document.createElement('ul');
    //     themeColorGrid.className = styles.colorGrid;

    //     // Create color swatches for each theme item
    //     themeColorItems.forEach(item => {
    //       const swatch = this._createColorSwatch(item);
    //       themeColorGrid.appendChild(swatch);
    //     });

    //     themeSection.appendChild(themeColorGrid);

    //     // Add theme description
    //     const themeDescription = document.createElement('small');
    //     themeDescription.innerHTML = 'To add to these items, use Sass variables that start with <code>$color-brand-</code> in <code>./source/css/scss/abstracts/_variables.scss</code>';
    //     themeSection.appendChild(themeDescription);

    //     wrapper.appendChild(themeSection);

    //     // Create neutral colors category section
    //     const categorySection = document.createElement('div');
    //     categorySection.className = styles.categorySection;

    //     // Create category title
    //     const categoryTitle = document.createElement('h3');
    //     categoryTitle.className = styles.categoryTitle;
    //     categoryTitle.textContent = 'Neutral Colors';
    //     categorySection.appendChild(categoryTitle);

    //     // Create color grid (ul)
    //     const colorGrid = document.createElement('ul');
    //     colorGrid.className = styles.colorGrid;

    //     // Create color swatches for each neutral item
    //     neutralColorItems.forEach(item => {
    //       const swatch = this._createColorSwatch(item);
    //       colorGrid.appendChild(swatch);
    //     });

    //     categorySection.appendChild(colorGrid);

    //     // Add neutral description
    //     const description = document.createElement('small');
    //     description.innerHTML = 'To add to these items, use Sass variables that start with <code>$color-brand-</code> in <code>./source/css/scss/abstracts/_variables.scss</code>';
    //     categorySection.appendChild(description);

    //     wrapper.appendChild(categorySection);

    //     container.appendChild(wrapper);
    //     console.log('ColorRamp rendered successfully with theme and neutral colors');
    //   }

    //   private _createColorSwatch(item: ColorItem): HTMLLIElement {
    //     // Create list item
    //     const swatch = document.createElement('li');
    //     swatch.className = styles.colorSwatch;

    //     // Add debug logging for color values
    //     console.log(`Creating swatch for ${item.msftName}: ${item.colorValue}`);

    //     // Create the HTML structure exactly as specified:
    //     // <span class="sg-label"> with weight and RGB
    //     // <span class="sg-swatchbox"> with color
    //     // <span class="sg-label"> with SASS and Fluent info

    //     // 1. First label span - Weight number and color code
    //     const leftLabel = document.createElement('span');
    //     leftLabel.className = styles.sgLabel;

    //     // Weight number (big label)
    //     const weightElement = document.createElement('strong');
    //     weightElement.className = styles.sgLabelBig;
    //     weightElement.textContent = item.designToken;
    //     leftLabel.appendChild(weightElement);

    //     // Line break
    //     leftLabel.appendChild(document.createElement('br'));

    //     // Color code (we'll get this from computed style after rendering)
    //     const colorCodeElement = document.createElement('span');
    //     colorCodeElement.className = styles.sgColorCode;
    //     colorCodeElement.textContent = ''; // Will be populated after rendering
    //     leftLabel.appendChild(colorCodeElement);

    //     // Line break
    //     leftLabel.appendChild(document.createElement('br'));

    //     swatch.appendChild(leftLabel);

    //     // 2. Color swatch box
    //     const swatchBox = document.createElement('span');
    //     swatchBox.className = styles.sgSwatchbox;
    //     // Use the CSS variable directly
    //     swatchBox.style.background = item.colorValue;
    //     swatch.appendChild(swatchBox);

    //     // 3. Second label span - SASS and Fluent UI info
    //     const rightLabel = document.createElement('span');
    //     rightLabel.className = styles.sgLabelInfo;

    //     // SASS variable
    //     const sassElement = document.createElement('div');
    //     sassElement.className = styles.sassInfo;
    //     sassElement.innerHTML = `<strong>SASS:</strong>&nbsp;${item.SASSVariable}`;
    //     rightLabel.appendChild(sassElement);

    //     // Line break
    //     rightLabel.appendChild(document.createElement('br'));

    //     // Fluent UI info
    //     const fluentElement = document.createElement('div');
    //     fluentElement.className = styles.fluentInfo;
    //     fluentElement.innerHTML = `<em><strong>Fluent UI:</strong>&nbsp;${item.msftNameLong} / ${item.msftName}</em>`;
    //     rightLabel.appendChild(fluentElement);

    //     // Line break
    //     rightLabel.appendChild(document.createElement('br'));

    //     swatch.appendChild(rightLabel);

    //     // After the element is added to DOM, get the computed color value
    //     setTimeout(() => {
    //       const computedStyle = window.getComputedStyle(swatchBox);
    //       const backgroundColor = computedStyle.backgroundColor;
    //       if (backgroundColor) {
    //         const hexValue = this._rgbToHex(backgroundColor);
    //         const rgbDisplay = this._extractRgbValues(backgroundColor);
    //         colorCodeElement.textContent = `${rgbDisplay} / ${hexValue}`;
    //       }
    //     }, 0);

    //     return swatch;
    //   }

    //   private _rgbToHex(rgb: string): string {
    //     // Convert rgb(r, g, b) to hex
    //     const result = rgb.match(/\d+/g);
    //     if (result && result.length >= 3) {
    //       const r = parseInt(result[0], 10);
    //       const g = parseInt(result[1], 10);
    //       const b = parseInt(result[2], 10);
    //       return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    //     }
    //     return '#000000';
    //   }

    //   private _extractRgbValues(rgb: string): string {
    //     // Extract and format RGB values for display
    //     const result = rgb.match(/\d+/g);
    //     if (result && result.length >= 3) {
    //       return `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
    //     }
    //     return 'rgb(0, 0, 0)';
    //   }
}

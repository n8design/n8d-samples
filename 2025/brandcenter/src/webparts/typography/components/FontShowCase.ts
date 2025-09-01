// List of all Crimson Text font variants (outside the class)
const crimsonTextVariants = [
    { label: 'Regular', weight: 400, style: 'normal' },
    { label: 'Italic', weight: 400, style: 'italic' },
    { label: 'SemiBold', weight: 600, style: 'normal' },
    { label: 'SemiBold Italic', weight: 600, style: 'italic' },
    { label: 'Bold', weight: 700, style: 'normal' },
    { label: 'Bold Italic', weight: 700, style: 'italic' },
];

// List of all Gotham font variants (outside the class)
const gothamVariants = [
    { label: 'Thin', weight: 100, style: 'normal' },
    { label: 'Thin Italic', weight: 100, style: 'italic' },
    { label: 'XLight', weight: 200, style: 'normal' },
    { label: 'XLight Italic', weight: 200, style: 'italic' },
    { label: 'Light', weight: 300, style: 'normal' },
    { label: 'Light Italic', weight: 300, style: 'italic' },
    { label: 'Book', weight: 400, style: 'normal' },
    { label: 'Book Italic', weight: 400, style: 'italic' },
    { label: 'Medium', weight: 500, style: 'normal' },
    { label: 'Medium Italic', weight: 500, style: 'italic' },
    { label: 'Bold', weight: 700, style: 'normal' },
    { label: 'Bold Italic', weight: 700, style: 'italic' },
    { label: 'Black', weight: 900, style: 'normal' },
    { label: 'Black Italic', weight: 900, style: 'italic' },
    { label: 'Ultra', weight: 950, style: 'normal' },
    { label: 'Ultra Italic', weight: 950, style: 'italic' },
];

export class FontShowCase {

    private static _fontSlots: HTMLDivElement[] = [];
    private static _domParser = new DOMParser();

    static showDefaultFontSlots(domElement: HTMLElement): void {
        for (let index = 0; index <= 16; index++) {
            const parsed = this._domParser.parseFromString(`
                <div class="font-slots slot-${index * 100}">
                        Font Slot ${index}
                </div>
            `, "text/html").body.firstElementChild;

            let fontSlot: HTMLDivElement;

            if (parsed && parsed instanceof HTMLDivElement) {
                fontSlot = parsed;
            } else {
                fontSlot = document.createElement("div");
                fontSlot.className = `font-slots slot-${index}`;
                fontSlot.textContent = `Font Slot ${index}`;
            }
            this._fontSlots.push(fontSlot);
        }

        domElement.insertAdjacentHTML(
            "beforeend",
            this._fontSlots.map(slot => slot.outerHTML).join('')
        );
    }

    /**
     * Appends a showcase of all Gotham font variants to the given container.
     */
    static showcaseAllGothamFonts(container: HTMLElement): void {
        gothamVariants.forEach(variant => {
            const div = document.createElement('div');
            div.textContent = `Gotham ${variant.label}`;
            div.style.fontFamily = 'Gotham, Arial, sans-serif';
            div.style.fontWeight = variant.weight.toString();
            div.style.fontStyle = variant.style;
            div.style.margin = '0.5em 0';
            div.style.fontSize = '1.5em';
            container.appendChild(div);
        });
    }

    /**
 * Appends a showcase of all Crimson Text font variants to the given container.
 */
    static showcaseAllCrimsonTextFonts(container: HTMLElement): void {
        crimsonTextVariants.forEach(variant => {
            const div = document.createElement('div');
            div.textContent = `Crimson Text ${variant.label}`;
            div.style.fontFamily = 'Crimson Text, serif';
            div.style.fontWeight = variant.weight.toString();
            div.style.fontStyle = variant.style;
            div.style.margin = '0.5em 0';
            div.style.fontSize = '1.5em';
            container.appendChild(div);
        });
    }
}
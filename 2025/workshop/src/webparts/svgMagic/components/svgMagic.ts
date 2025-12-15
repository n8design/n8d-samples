const domParser = new DOMParser();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const assets = require('../assets/deer.svg');

export class SvgMagic {
    public static async getSvg(name: string): Promise<SVGSVGElement> {

        const fetchData = await fetch(assets);
        
        if (!fetchData.ok) {
            throw new Error(`Failed to fetch SVG: ${fetchData.status}`);
        }
        
        const svgContent = await fetchData.text();
        console.debug('SVG Content:', svgContent);

        const svg: Document = domParser.parseFromString(svgContent, 'image/svg+xml');
        const targetElement = svg.querySelector(`#${name}`) as SVGElement;
        
        if (!targetElement) {
            throw new Error(`SVG element with id "${name}" not found`);
        }
        
        // Create a new SVG element
        const newSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg') as SVGSVGElement;
        
        // Copy attributes from the target element or set defaults
        const viewBox = targetElement.getAttribute('viewBox') || "0 0 300 300";
        newSvg.setAttribute('viewBox', viewBox);
        
        // Simply copy the innerHTML - much faster than cloning nodes
        newSvg.innerHTML = targetElement.innerHTML;
        
        console.debug('Created SVG:', newSvg);
        
        return newSvg;
    }

}
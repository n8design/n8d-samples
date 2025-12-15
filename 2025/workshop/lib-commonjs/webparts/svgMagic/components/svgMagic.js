"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SvgMagic = void 0;
var tslib_1 = require("tslib");
var domParser = new DOMParser();
// eslint-disable-next-line @typescript-eslint/no-var-requires
var assets = require('../assets/deer.svg');
var SvgMagic = /** @class */ (function () {
    function SvgMagic() {
    }
    SvgMagic.getSvg = function (name) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var fetchData, svgContent, svg, targetElement, newSvg, viewBox;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(assets)];
                    case 1:
                        fetchData = _a.sent();
                        if (!fetchData.ok) {
                            throw new Error("Failed to fetch SVG: ".concat(fetchData.status));
                        }
                        return [4 /*yield*/, fetchData.text()];
                    case 2:
                        svgContent = _a.sent();
                        console.debug('SVG Content:', svgContent);
                        svg = domParser.parseFromString(svgContent, 'image/svg+xml');
                        targetElement = svg.querySelector("#".concat(name));
                        if (!targetElement) {
                            throw new Error("SVG element with id \"".concat(name, "\" not found"));
                        }
                        newSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                        viewBox = targetElement.getAttribute('viewBox') || "0 0 300 300";
                        newSvg.setAttribute('viewBox', viewBox);
                        // Simply copy the innerHTML - much faster than cloning nodes
                        newSvg.innerHTML = targetElement.innerHTML;
                        console.debug('Created SVG:', newSvg);
                        return [2 /*return*/, newSvg];
                }
            });
        });
    };
    return SvgMagic;
}());
exports.SvgMagic = SvgMagic;
//# sourceMappingURL=svgMagic.js.map
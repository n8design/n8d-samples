"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorRamp = void 0;
var tslib_1 = require("tslib");
var ColorRamp_module_scss_1 = tslib_1.__importDefault(require("./ColorRamp.module.scss"));
var ColorBaseSettings = tslib_1.__importStar(require("./ColorBaseSettings"));
var domParser = new DOMParser();
var ColorRamp = /** @class */ (function () {
    function ColorRamp() {
        // Default constructor
    }
    ColorRamp.prototype.render = function (container, paletteColors) {
        var _this = this;
        console.debug('ColorRamp render() called with paletteColors:', ColorBaseSettings.neutralColorItems);
        console.debug('ColorRamp render() called with paletteColors:', ColorBaseSettings.themeColorItems);
        console.debug('styles:', ColorRamp_module_scss_1.default);
        var innerContainer = container.appendChild(document.createElement('div'));
        innerContainer.className = ColorRamp_module_scss_1.default.colorRamps;
        innerContainer.append(this.createSectionLabel('Neutral Colors'));
        ColorBaseSettings.neutralColorItems.forEach(function (item) {
            console.debug('Neutral Color Item:', _this.createColorSwatch(item));
            _this.createColorSwatch(item);
            innerContainer.appendChild(_this.createColorSwatch(item));
        });
        innerContainer.append(this.createSectionLabel('Theme Colors'));
        ColorBaseSettings.themeColorItems.forEach(function (item) {
            console.debug('Theme Color Item:', _this.createColorSwatch(item));
            _this.createColorSwatch(item);
            innerContainer.appendChild(_this.createColorSwatch(item));
        });
        // Add all the hTWOo color families
        innerContainer.append(this.createSectionLabel('Blue Colors'));
        ColorBaseSettings.blueColorItems.forEach(function (item) {
            innerContainer.appendChild(_this.createColorSwatch(item));
        });
        innerContainer.append(this.createSectionLabel('Green Colors'));
        ColorBaseSettings.greenColorItems.forEach(function (item) {
            innerContainer.appendChild(_this.createColorSwatch(item));
        });
        innerContainer.append(this.createSectionLabel('Red Colors'));
        ColorBaseSettings.redColorItems.forEach(function (item) {
            innerContainer.appendChild(_this.createColorSwatch(item));
        });
        innerContainer.append(this.createSectionLabel('Orange Colors'));
        ColorBaseSettings.orangeColorItems.forEach(function (item) {
            innerContainer.appendChild(_this.createColorSwatch(item));
        });
        innerContainer.append(this.createSectionLabel('Yellow Colors'));
        ColorBaseSettings.yellowColorItems.forEach(function (item) {
            innerContainer.appendChild(_this.createColorSwatch(item));
        });
        innerContainer.append(this.createSectionLabel('Teal Colors'));
        ColorBaseSettings.tealColorItems.forEach(function (item) {
            innerContainer.appendChild(_this.createColorSwatch(item));
        });
        innerContainer.append(this.createSectionLabel('Purple Colors'));
        ColorBaseSettings.purpleColorItems.forEach(function (item) {
            innerContainer.appendChild(_this.createColorSwatch(item));
        });
        innerContainer.append(this.createSectionLabel('Magenta Colors'));
        ColorBaseSettings.magentaColorItems.forEach(function (item) {
            innerContainer.appendChild(_this.createColorSwatch(item));
        });
        innerContainer.append(this.createSectionLabel('Button Colors'));
        ColorBaseSettings.buttonColorItems.forEach(function (item) {
            innerContainer.appendChild(_this.createColorSwatch(item));
        });
    };
    ColorRamp.prototype.createColorSwatch = function (item) {
        return domParser.parseFromString("\n            <div class=".concat(ColorRamp_module_scss_1.default.colorRamp, ">\n                <div class=").concat(ColorRamp_module_scss_1.default.colorRampIndex, ">\n                ").concat(item.designToken, "\n                </div>\n                <div class=\"").concat(ColorRamp_module_scss_1.default.colorSwatch, "\" style=\"background-color: ").concat(item.colorValue, "\">\n                \n                </div>\n                <div>").concat(item.msftName, "</div>\n            </div>\n        "), 'text/html').body.firstChild;
    };
    ColorRamp.prototype.createSectionLabel = function (label) {
        var sectionTitle = document.createElement('h2');
        sectionTitle.classList.add(ColorRamp_module_scss_1.default.sectionTitle);
        sectionTitle.textContent = label;
        return sectionTitle;
    };
    return ColorRamp;
}());
exports.ColorRamp = ColorRamp;
//# sourceMappingURL=ColorRamp.js.map
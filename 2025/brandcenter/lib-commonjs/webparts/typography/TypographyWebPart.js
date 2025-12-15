"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var FontShowCase_1 = require("./components/FontShowCase");
var TypographyWebPart_module_scss_1 = tslib_1.__importDefault(require("./TypographyWebPart.module.scss"));
var TypographyWebPart = /** @class */ (function (_super) {
    tslib_1.__extends(TypographyWebPart, _super);
    function TypographyWebPart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    TypographyWebPart.prototype.render = function () {
        this.domElement.classList.add(TypographyWebPart_module_scss_1.default.typography);
        FontShowCase_1.FontShowCase.showDefaultFontSlots(this.domElement);
        FontShowCase_1.FontShowCase.showcaseAllGothamFonts(this.domElement);
        FontShowCase_1.FontShowCase.showcaseAllCrimsonTextFonts(this.domElement);
    };
    TypographyWebPart.prototype.onInit = function () {
        return _super.prototype.onInit.call(this);
    };
    Object.defineProperty(TypographyWebPart.prototype, "dataVersion", {
        get: function () {
            return sp_core_library_1.Version.parse('1.0');
        },
        enumerable: false,
        configurable: true
    });
    return TypographyWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = TypographyWebPart;
//# sourceMappingURL=TypographyWebPart.js.map
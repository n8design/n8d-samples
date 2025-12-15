"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var SvgMagicWebPart_module_scss_1 = tslib_1.__importDefault(require("./SvgMagicWebPart.module.scss"));
var svgMagic_1 = require("./components/svgMagic");
var SvgMagicWebPart = /** @class */ (function (_super) {
    tslib_1.__extends(SvgMagicWebPart, _super);
    function SvgMagicWebPart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SvgMagicWebPart.prototype.render = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var svgDoc, logo, jumpingBars;
            var _a, _b, _c;
            return tslib_1.__generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        this.domElement.innerHTML = "<div class=\"".concat(SvgMagicWebPart_module_scss_1.default.svgMagic, "\">\n    <svg width=\"0\" height=\"0\" xmlns=\"http://www.w3.org/2000/svg\">\n      <defs>\n        <linearGradient id=\"myGradient\" gradientTransform=\"rotate(45)\">\n          <stop offset=\"0%\" stop-color=\"rgba(131, 58, 180, 1)\" />\n          <stop offset=\"50%\" stop-color=\"rgba(253, 29, 29, 1)\" />\n          <stop offset=\"100%\" stop-color=\"rgba(252, 176, 69, 1)\" />\n        </linearGradient>\n      </defs>\n    </svg></div>");
                        return [4 /*yield*/, svgMagic_1.SvgMagic.getSvg('deer')];
                    case 1:
                        svgDoc = _d.sent();
                        (_a = this.domElement.firstChild) === null || _a === void 0 ? void 0 : _a.appendChild(svgDoc);
                        return [4 /*yield*/, svgMagic_1.SvgMagic.getSvg('n8d')];
                    case 2:
                        logo = _d.sent();
                        (_b = this.domElement.firstChild) === null || _b === void 0 ? void 0 : _b.appendChild(logo);
                        return [4 /*yield*/, svgMagic_1.SvgMagic.getSvg('jumping-bars')];
                    case 3:
                        jumpingBars = _d.sent();
                        (_c = this.domElement.firstChild) === null || _c === void 0 ? void 0 : _c.appendChild(jumpingBars);
                        return [2 /*return*/];
                }
            });
        });
    };
    SvgMagicWebPart.prototype.onInit = function () {
        return _super.prototype.onInit.call(this);
    };
    Object.defineProperty(SvgMagicWebPart.prototype, "dataVersion", {
        get: function () {
            return sp_core_library_1.Version.parse('1.0');
        },
        enumerable: false,
        configurable: true
    });
    return SvgMagicWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = SvgMagicWebPart;
//# sourceMappingURL=SvgMagicWebPart.js.map
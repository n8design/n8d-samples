"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var CustomCardsWebPart_module_scss_1 = tslib_1.__importDefault(require("./CustomCardsWebPart.module.scss"));
var baseCard_1 = tslib_1.__importDefault(require("../../common/molecules/baseCard"));
var CustomCardsWebPart = /** @class */ (function (_super) {
    tslib_1.__extends(CustomCardsWebPart, _super);
    function CustomCardsWebPart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CustomCardsWebPart.prototype.render = function () {
        this.domElement.classList.add(CustomCardsWebPart_module_scss_1.default.customCards);
        console.debug('BASECARD', (0, baseCard_1.default)());
        this.domElement.appendChild((0, baseCard_1.default)());
    };
    CustomCardsWebPart.prototype.onInit = function () {
        return _super.prototype.onInit.call(this);
    };
    Object.defineProperty(CustomCardsWebPart.prototype, "dataVersion", {
        get: function () {
            return sp_core_library_1.Version.parse('1.0');
        },
        enumerable: false,
        configurable: true
    });
    return CustomCardsWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = CustomCardsWebPart;
//# sourceMappingURL=CustomCardsWebPart.js.map
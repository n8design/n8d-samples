"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var MultiCardsWebPart_module_scss_1 = tslib_1.__importDefault(require("./MultiCardsWebPart.module.scss"));
var baseCard_1 = tslib_1.__importDefault(require("../../common/molecules/baseCard"));
var MultiCardsWebPart = /** @class */ (function (_super) {
    tslib_1.__extends(MultiCardsWebPart, _super);
    function MultiCardsWebPart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MultiCardsWebPart.prototype.render = function () {
        this.domElement.classList.add(MultiCardsWebPart_module_scss_1.default.multiCards);
        console.debug('BASECARD', (0, baseCard_1.default)());
        this.domElement.appendChild((0, baseCard_1.default)());
        this.domElement.appendChild((0, baseCard_1.default)());
        this.domElement.appendChild((0, baseCard_1.default)());
    };
    MultiCardsWebPart.prototype.onInit = function () {
        return _super.prototype.onInit.call(this);
    };
    Object.defineProperty(MultiCardsWebPart.prototype, "dataVersion", {
        get: function () {
            return sp_core_library_1.Version.parse('1.0');
        },
        enumerable: false,
        configurable: true
    });
    return MultiCardsWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = MultiCardsWebPart;
//# sourceMappingURL=MultiCardsWebPart.js.map
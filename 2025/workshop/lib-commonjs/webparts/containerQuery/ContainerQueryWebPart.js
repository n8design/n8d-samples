"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var ContainerQueryWebPart_module_scss_1 = tslib_1.__importDefault(require("./ContainerQueryWebPart.module.scss"));
var ContainerQueryWebPart = /** @class */ (function (_super) {
    tslib_1.__extends(ContainerQueryWebPart, _super);
    function ContainerQueryWebPart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ContainerQueryWebPart.prototype.render = function () {
        this.domElement.classList.add(ContainerQueryWebPart_module_scss_1.default.outerContainer);
        this.domElement.innerHTML = "<div class=\"".concat(ContainerQueryWebPart_module_scss_1.default.containerQuery, "\">&nbsp;</div>");
    };
    ContainerQueryWebPart.prototype.onInit = function () {
        return _super.prototype.onInit.call(this);
    };
    Object.defineProperty(ContainerQueryWebPart.prototype, "dataVersion", {
        get: function () {
            return sp_core_library_1.Version.parse('1.0');
        },
        enumerable: false,
        configurable: true
    });
    return ContainerQueryWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = ContainerQueryWebPart;
//# sourceMappingURL=ContainerQueryWebPart.js.map
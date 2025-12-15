"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var SlideShowWebPart_module_scss_1 = tslib_1.__importDefault(require("./SlideShowWebPart.module.scss"));
var splide_1 = tslib_1.__importDefault(require("@splidejs/splide"));
var SlideShowWebPart = /** @class */ (function (_super) {
    tslib_1.__extends(SlideShowWebPart, _super);
    function SlideShowWebPart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SlideShowWebPart.prototype.render = function () {
        this.domElement.innerHTML = "<div class=\"".concat(SlideShowWebPart_module_scss_1.default.slideShow, "\">\n    <section class=\"splide\" aria-labelledby=\"carousel-heading\">\n  <h2 id=\"carousel-heading\">Splide Basic HTML Example</h2>\n\n  <div class=\"splide__track\">\n\t\t<ul class=\"splide__list\">\n\t\t\t<li class=\"splide__slide ").concat(SlideShowWebPart_module_scss_1.default.slide, "\"><img src=\"https://picsum.photos/400/200?random=1\"></li>\n\t\t\t<li class=\"splide__slide ").concat(SlideShowWebPart_module_scss_1.default.slide, "\"><img src=\"https://picsum.photos/400/200?random=2\"></li>\n\t\t\t<li class=\"splide__slide ").concat(SlideShowWebPart_module_scss_1.default.slide, "\"><img src=\"https://picsum.photos/400/200?random=3\"></li>\n\t\t</ul>\n  </div>\n</section>\n    </div>");
        // mount slide show
        new splide_1.default('.splide').mount();
    };
    SlideShowWebPart.prototype.onInit = function () {
        return _super.prototype.onInit.call(this);
    };
    Object.defineProperty(SlideShowWebPart.prototype, "dataVersion", {
        get: function () {
            return sp_core_library_1.Version.parse('1.0');
        },
        enumerable: false,
        configurable: true
    });
    return SlideShowWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = SlideShowWebPart;
//# sourceMappingURL=SlideShowWebPart.js.map
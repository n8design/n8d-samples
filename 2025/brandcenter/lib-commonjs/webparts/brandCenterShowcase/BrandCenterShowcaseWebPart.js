"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var sp_component_base_1 = require("@microsoft/sp-component-base");
var ThemeService_1 = require("../../services/ThemeService");
var BrandCenterShowcaseWebPart_module_scss_1 = tslib_1.__importDefault(require("./BrandCenterShowcaseWebPart.module.scss"));
var BrandCenterShowcaseWebPart = /** @class */ (function (_super) {
    tslib_1.__extends(BrandCenterShowcaseWebPart, _super);
    function BrandCenterShowcaseWebPart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BrandCenterShowcaseWebPart.prototype.render = function () {
        console.log('BrandCenterShowcaseWebPart render() called');
        console.log('Current theme variant:', this._themeVariant);
        // Always refresh theme to get latest values (no caching)
        if (this._themeService && this._themeVariant) {
            this._themeService.refreshTheme();
            // Re-register CSS variables scoped to this web part instance using our theme variant
            this._themeService.registerCSSVariables(this.domElement, this._themeVariant);
        }
        this.domElement.innerHTML = "<div class=\"".concat(BrandCenterShowcaseWebPart_module_scss_1.default.brandCenterShowcase, "\">\n    <div class=\"").concat(BrandCenterShowcaseWebPart_module_scss_1.default.gradient, "\"></div>\n    <div class=\"").concat(BrandCenterShowcaseWebPart_module_scss_1.default.semiTransparent, "\">Hello world</div>\n    </div>");
    };
    BrandCenterShowcaseWebPart.prototype.onInit = function () {
        var _this = this;
        this.domElement.classList.add(BrandCenterShowcaseWebPart_module_scss_1.default.brandCenterShowcase);
        console.log('BrandCenterShowcaseWebPart onInit() called');
        try {
            // Consume the new ThemeProvider service
            this._themeProvider = this.context.serviceScope.consume(sp_component_base_1.ThemeProvider.serviceKey);
            // If it exists, get the theme variant
            this._themeVariant = this._themeProvider.tryGetTheme();
            console.debug("V2::::", this._themeProvider.tryGetThemeV2());
            // Initialize the theme service
            this._themeService = this.context.serviceScope.consume(ThemeService_1.ThemeService.serviceKey);
            this._themeService.initialize(this.context.serviceScope);
            // Register CSS variables scoped to this web part instance with our theme variant
            if (this._themeVariant) {
                this._themeService.registerCSSVariables(this.domElement, this._themeVariant);
            }
            // Debug output using theme variant context
            console.debug('Theme variant:', this._themeVariant);
            console.debug('Theme colors available:', this._themeService.getThemeColors(this._themeVariant));
            console.debug('Palette colors:', this._themeService.getPaletteColors(this._themeVariant));
            console.debug('Semantic colors:', this._themeService.getSemanticColors(this._themeVariant));
        }
        catch (error) {
            console.error('Error initializing theme services:', error);
        }
        this._themeProvider.themeChangedEvent.add(this, this._handleThemeChangedEvent);
        return _super.prototype.onInit.call(this).then(function () {
            console.log('onInit completed, calling render()');
            // Re-render after theme services are initialized
            _this.render();
        });
    };
    BrandCenterShowcaseWebPart.prototype._handleThemeChangedEvent = function (args) {
        this._themeVariant = args.theme;
        this.render(); // Re-render the web part to apply new theme
    };
    Object.defineProperty(BrandCenterShowcaseWebPart.prototype, "dataVersion", {
        get: function () {
            return sp_core_library_1.Version.parse('1.0');
        },
        enumerable: false,
        configurable: true
    });
    return BrandCenterShowcaseWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = BrandCenterShowcaseWebPart;
//# sourceMappingURL=BrandCenterShowcaseWebPart.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var sp_component_base_1 = require("@microsoft/sp-component-base");
var ThemeService_1 = require("../../services/ThemeService");
var ColorRamp_1 = require("./components/ColorRamp");
var BrandColorsWebPart_module_scss_1 = tslib_1.__importDefault(require("./BrandColorsWebPart.module.scss"));
var BrandColorsWebPart = /** @class */ (function (_super) {
    tslib_1.__extends(BrandColorsWebPart, _super);
    function BrandColorsWebPart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BrandColorsWebPart.prototype.render = function () {
        var _a, _b, _c;
        console.log('BrandColorsWebPart render() called');
        console.log('Current theme variant:', this._themeVariant);
        // Always refresh theme to get latest values (no caching)
        if (this._themeService && this._themeVariant) {
            this._themeService.refreshTheme();
            // Re-register CSS variables scoped to this web part instance using our theme variant
            this._themeService.registerCSSVariables(this.domElement, this._themeVariant);
        }
        // Get palette colors using our theme variant context
        var paletteColors = this._themeService && this._themeVariant ?
            this._themeService.getPaletteColors(this._themeVariant) :
            (((_a = this._themeVariant) === null || _a === void 0 ? void 0 : _a.palette) || {});
        console.debug('Palette colors for ColorRamp:', paletteColors);
        console.debug('Theme Primary from palette:', paletteColors.themePrimary);
        console.debug('Theme Primary from variant:', (_c = (_b = this._themeVariant) === null || _b === void 0 ? void 0 : _b.palette) === null || _c === void 0 ? void 0 : _c.themePrimary);
        // Clear the container
        this.domElement.innerHTML = '';
        // Create and render the color ramp (now includes all hTWOo colors)
        var colorRamp = new ColorRamp_1.ColorRamp();
        colorRamp.render(this.domElement, paletteColors);
    };
    BrandColorsWebPart.prototype.onInit = function () {
        var _this = this;
        this.domElement.classList.add(BrandColorsWebPart_module_scss_1.default.brandColors);
        console.log('BrandColorsWebPart onInit() called');
        try {
            // Consume the new ThemeProvider service
            this._themeProvider = this.context.serviceScope.consume(sp_component_base_1.ThemeProvider.serviceKey);
            // If it exists, get the theme variant
            this._themeVariant = this._themeProvider.tryGetTheme();
            // Register a handler to be notified if the theme variant changes
            this._themeProvider.themeChangedEvent.add(this, this._handleThemeChangedEvent);
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
        return _super.prototype.onInit.call(this).then(function () {
            console.log('onInit completed, calling render()');
            // Re-render after theme services are initialized
            _this.render();
        });
    };
    /**
     * Update the current theme variant reference and re-render.
     *
     * @param args The new theme
     */
    BrandColorsWebPart.prototype._handleThemeChangedEvent = function (args) {
        console.log('Theme changed event received:', args.theme);
        this._themeVariant = args.theme;
        this.render();
    };
    BrandColorsWebPart.prototype.onDispose = function () {
        // Clean up theme change event handler
        if (this._themeProvider) {
            this._themeProvider.themeChangedEvent.remove(this, this._handleThemeChangedEvent);
        }
    };
    Object.defineProperty(BrandColorsWebPart.prototype, "dataVersion", {
        get: function () {
            return sp_core_library_1.Version.parse('1.0');
        },
        enumerable: false,
        configurable: true
    });
    return BrandColorsWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = BrandColorsWebPart;
//# sourceMappingURL=BrandColorsWebPart.js.map
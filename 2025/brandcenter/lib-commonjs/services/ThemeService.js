"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThemeService = void 0;
var sp_core_library_1 = require("@microsoft/sp-core-library");
var sp_component_base_1 = require("@microsoft/sp-component-base");
var ThemeService = /** @class */ (function () {
    function ThemeService() {
        this._isInitialized = false;
    }
    ThemeService.prototype.initialize = function (serviceScope) {
        if (this._isInitialized) {
            return;
        }
        // Consume the ThemeProvider service
        this._themeProvider = serviceScope.consume(sp_component_base_1.ThemeProvider.serviceKey);
        console.debug('ThemeService initialized');
        this._isInitialized = true;
    };
    ThemeService.prototype.registerCSSVariables = function (element, themeVariant) {
        if (!this._isInitialized) {
            throw new Error('ThemeService must be initialized before registering CSS variables');
        }
        // Get all theme colors using provided theme variant
        var allColors = this.getThemeColors(themeVariant);
        // Apply only to specific element - no global :root scope
        this._applyElementCSSVariables(element, allColors);
    };
    ThemeService.prototype.refreshTheme = function () {
        if (!this._isInitialized) {
            throw new Error('ThemeService must be initialized before refreshing theme');
        }
        console.debug('Refreshing theme - note: CSS variables are scoped to web part instances only, not global :root');
        // Note: refreshTheme only logs the refresh action
        // CSS variables will be applied when registerCSSVariables is called with specific elements
    };
    ThemeService.prototype.getThemeColors = function (themeVariant) {
        var colors = {};
        // Use provided theme variant or try to get fresh one
        var currentThemeVariant = themeVariant || (this._themeProvider ? this._themeProvider.tryGetTheme() : undefined);
        // Try to get colors from theme variant first
        if (currentThemeVariant) {
            console.debug('Using theme variant for colors:', currentThemeVariant);
            // Add semantic colors
            var semanticColors = this.getSemanticColors(currentThemeVariant);
            var semanticKeys = Object.keys(semanticColors);
            for (var i = 0; i < semanticKeys.length; i++) {
                var key = semanticKeys[i];
                colors[key] = semanticColors[key];
            }
            // Add palette colors
            var paletteColors = this.getPaletteColors(currentThemeVariant);
            var paletteKeys = Object.keys(paletteColors);
            for (var i = 0; i < paletteKeys.length; i++) {
                var key = paletteKeys[i];
                colors[key] = paletteColors[key];
            }
        }
        else if (window.__themeState__ && window.__themeState__.theme) {
            // Fallback to global theme state
            console.debug("THEME STATE USED as fallback");
            var themeKeys = Object.keys(window.__themeState__.theme);
            for (var i = 0; i < themeKeys.length; i++) {
                var key = themeKeys[i];
                colors[key] = window.__themeState__.theme[key];
            }
        }
        return colors;
    };
    ThemeService.prototype.getPaletteColors = function (themeVariant) {
        // Use provided theme variant or try to get fresh one
        var currentThemeVariant = themeVariant || (this._themeProvider ? this._themeProvider.tryGetTheme() : undefined);
        if (currentThemeVariant && currentThemeVariant.palette) {
            return currentThemeVariant.palette;
        }
        return {};
    };
    ThemeService.prototype.getSemanticColors = function (themeVariant) {
        // Use provided theme variant or try to get fresh one
        var currentThemeVariant = themeVariant || (this._themeProvider ? this._themeProvider.tryGetTheme() : undefined);
        if (currentThemeVariant && currentThemeVariant.semanticColors) {
            return currentThemeVariant.semanticColors;
        }
        return {};
    };
    ThemeService.prototype._applyElementCSSVariables = function (element, colors) {
        var colorKeys = Object.keys(colors);
        for (var i = 0; i < colorKeys.length; i++) {
            var key = colorKeys[i];
            var value = colors[key];
            if (value) {
                element.style.setProperty("--".concat(key), value);
            }
        }
        console.debug('Element CSS variables applied to:', element.tagName, Object.keys(colors).length, 'properties');
    };
    ThemeService.serviceKey = sp_core_library_1.ServiceKey.create('BrandCenter:ThemeService', ThemeService);
    return ThemeService;
}());
exports.ThemeService = ThemeService;
//# sourceMappingURL=ThemeService.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var ResponsiveTypographyWebPart_module_scss_1 = tslib_1.__importDefault(require("./ResponsiveTypographyWebPart.module.scss"));
// Import sp-top-actions types and enums
var sp_top_actions_1 = require("@microsoft/sp-top-actions");
var ResponsiveTypographyWebPart = /** @class */ (function (_super) {
    tslib_1.__extends(ResponsiveTypographyWebPart, _super);
    function ResponsiveTypographyWebPart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._fontBaseUrl = null;
        _this._fontBaseUrlCdn = null;
        return _this;
    }
    ResponsiveTypographyWebPart.prototype.getTopActionsConfiguration = function () {
        var _this = this;
        return {
            topActions: [
                {
                    targetProperty: 'IncreaseFont',
                    type: sp_top_actions_1.TopActionsFieldType.Button,
                    title: 'Button',
                    properties: {
                        ariaLabel: 'Increase font size',
                        icon: 'FontIncrease'
                    }
                },
                {
                    targetProperty: 'DecreaseFont',
                    type: sp_top_actions_1.TopActionsFieldType.Button,
                    title: 'Button',
                    properties: {
                        ariaLabel: 'Decrease font size',
                        icon: 'FontDecrease'
                    }
                }
            ],
            onExecute: function (actionName, newValue) {
                var currentSize = _this.properties.fontSizeMultiplier || 1;
                var newSize = currentSize;
                switch (actionName) {
                    case 'IncreaseFont':
                        // Only increase if we're not already at the maximum
                        if (currentSize < 2.0) {
                            newSize = Math.round(Math.min(currentSize + 0.1, 2.0) * 10) / 10;
                        }
                        break;
                    case 'DecreaseFont':
                        // Only decrease if we're not already at the minimum
                        if (currentSize > 0.5) {
                            newSize = Math.round(Math.max(currentSize - 0.1, 0.5) * 10) / 10;
                        }
                        break;
                }
                // Only update if the value actually changed
                if (newSize !== currentSize) {
                    _this.properties.fontSizeMultiplier = newSize;
                    _this.domElement.style.setProperty('--font-size-multiplier', _this.properties.fontSizeMultiplier.toString());
                    console.debug('Top Action executed:', actionName, 'New multiplier:', _this.properties.fontSizeMultiplier);
                }
                else {
                    console.debug('Top Action ignored - already at limit:', actionName, 'Current:', currentSize);
                }
            }
        };
    };
    ResponsiveTypographyWebPart.prototype.render = function () {
        // Apply the saved font size multiplier, rounded to 1 decimal place
        var fontSizeMultiplier = Math.round((this.properties.fontSizeMultiplier || 1) * 10) / 10;
        this.domElement.style.setProperty('--font-size-multiplier', fontSizeMultiplier.toString());
        this.domElement.innerHTML = "<div class=\"".concat(ResponsiveTypographyWebPart_module_scss_1.default.responsiveTypography, "\">NEW YORK</div>");
    };
    ResponsiveTypographyWebPart.prototype._fetchCdnFontBaseUrl = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, data, cdnBaseUrl, fontBasePath, fontCDNUrl;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("".concat(this.context.pageContext.web.absoluteUrl, "/_api/SP.BrandCenter/Configuration?src=ResponsiveTypographyWebPart"), {
                            headers: {
                                'Accept': 'application/json;odata=nometadata'
                            }
                        })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok) {
                            throw new Error("HTTP error! status: ".concat(response.status));
                        }
                        return [4 /*yield*/, response.json()];
                    case 2:
                        data = _a.sent();
                        console.debug('Brand Center Configuration:', data);
                        cdnBaseUrl = this.context.pageContext.legacyPageContext.publicCdnBaseUrl;
                        fontBasePath = data.BrandFontLibraryUrl.DecodedUrl.replace("".concat(window.location.protocol, "//"), '');
                        fontCDNUrl = "".concat(cdnBaseUrl, "/").concat(fontBasePath);
                        console.debug('Font URL:', fontCDNUrl);
                        console.debug('Font URL:', data.BrandFontLibraryUrl.DecodedUrl);
                        // Set local Storage for base URL
                        localStorage.setItem('n8dFontBaseUrl', data.BrandFontLibraryUrl.DecodedUrl);
                        // Set local Storage for the CND URL
                        localStorage.setItem('n8dFontBaseUrlCDN', fontCDNUrl);
                        return [2 /*return*/, cdnBaseUrl];
                }
            });
        });
    };
    ResponsiveTypographyWebPart.prototype._renderFontDefinition = function () {
        var styleBlock = "\n  <style>\n      @font-face {\n    font-family: Gotham;\n    src: url(".concat(this._fontBaseUrlCdn + '/' + ResponsiveTypographyWebPart.FONTFILENAME, ") format(\"opentype\"),\n      url(").concat(this._fontBaseUrl + '/' + ResponsiveTypographyWebPart.FONTFILENAME, ") format(\"opentype\");\n    font-weight: 950;\n    font-style: normal;\n    font-display: swap;\n  }\n    </style>\n");
        this.domElement.innerHTML = styleBlock;
        this.domElement.classList.add(ResponsiveTypographyWebPart_module_scss_1.default.outerContainer);
    };
    ResponsiveTypographyWebPart.prototype.onInit = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var _a;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        this._fontBaseUrl = localStorage.getItem('n8dFontBaseUrl') || null;
                        this._fontBaseUrlCdn = localStorage.getItem('n8dFontBaseUrlCDN') || null;
                        if (!(!this._fontBaseUrlCdn && !this._fontBaseUrl)) return [3 /*break*/, 2];
                        console.debug('CDN Base URL from localStorage:', this._fontBaseUrlCdn);
                        _a = this;
                        return [4 /*yield*/, this._fetchCdnFontBaseUrl()];
                    case 1:
                        _a._fontBaseUrlCdn = _b.sent();
                        console.debug('CDN Base URL after fetch:', this._fontBaseUrlCdn);
                        console.debug('DOM Element:', this.domElement);
                        return [3 /*break*/, 3];
                    case 2:
                        console.debug('CDN Base URL from localStorage:', this._fontBaseUrlCdn);
                        console.debug('DOM Element:', this.domElement);
                        _b.label = 3;
                    case 3:
                        // init font loading
                        this._renderFontDefinition();
                        return [2 /*return*/, _super.prototype.onInit.call(this)];
                }
            });
        });
    };
    ResponsiveTypographyWebPart.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: {
                        description: 'Configure your responsive typography settings'
                    },
                    groups: [
                        {
                            groupName: 'Typography Settings',
                            groupFields: [
                                (0, sp_webpart_base_1.PropertyPaneSlider)('fontSizeMultiplier', {
                                    label: 'Font Size Multiplier',
                                    min: 0.5,
                                    max: 2.0,
                                    step: 0.1,
                                    showValue: true,
                                    value: this.properties.fontSizeMultiplier || 1
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    ResponsiveTypographyWebPart.prototype.onPropertyPaneFieldChanged = function (propertyPath, oldValue, newValue) {
        if (propertyPath === 'fontSizeMultiplier') {
            // Round to 1 decimal place
            var roundedValue = Math.round(newValue * 10) / 10;
            this.properties.fontSizeMultiplier = roundedValue;
            this.domElement.style.setProperty('--font-size-multiplier', roundedValue.toString());
        }
        _super.prototype.onPropertyPaneFieldChanged.call(this, propertyPath, oldValue, newValue);
    };
    Object.defineProperty(ResponsiveTypographyWebPart.prototype, "dataVersion", {
        get: function () {
            return sp_core_library_1.Version.parse('1.0');
        },
        enumerable: false,
        configurable: true
    });
    // Propertiy
    ResponsiveTypographyWebPart.FONTFILENAME = 'Gotham-Ultra.otf';
    return ResponsiveTypographyWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = ResponsiveTypographyWebPart;
//# sourceMappingURL=ResponsiveTypographyWebPart.js.map
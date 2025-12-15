"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var VariableFontsWebPart_module_scss_1 = tslib_1.__importDefault(require("./VariableFontsWebPart.module.scss"));
var VariableFontsWebPart = /** @class */ (function (_super) {
    tslib_1.__extends(VariableFontsWebPart, _super);
    function VariableFontsWebPart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._fontBaseUrl = null;
        _this._fontBaseUrlCdn = null;
        _this._currentWeight = 300;
        _this._currentOpticalSize = 12;
        _this._italicEnabled = false;
        _this._kerningEnabled = true;
        _this._discretionaryLigatures = false;
        _this._fractions = false;
        _this._tabularNumbers = false;
        _this._oldStyleNumbers = false;
        _this._caseSensitive = false;
        _this._stylisticSet1 = false;
        return _this;
    }
    // static readonly FONTFILENAME: string = 'Sono-VariableFont_MONO,wght.ttf';
    VariableFontsWebPart.prototype.render = function () {
        this.domElement.innerHTML += "\n      <div class=\"".concat(VariableFontsWebPart_module_scss_1.default.variableFonts, "\">\n        <div class=\"").concat(VariableFontsWebPart_module_scss_1.default.fontDisplay, "\">\n          ALL UPPERCASE<br>\n          Variable Typography Demo<br>\n          Aa Bb Cc Dd Ee Ff Gg<br>\n          1234567890 1/2 3/4<br>\n          HEADLINES & fine print<br>\n          office coffee staff\n        </div>\n        <div class=\"").concat(VariableFontsWebPart_module_scss_1.default.controls, "\">\n          <div class=\"").concat(VariableFontsWebPart_module_scss_1.default.controlGroup, "\">\n            <label for=\"fontWeightSlider\" class=\"").concat(VariableFontsWebPart_module_scss_1.default.sliderLabel, "\">\n              Font Weight: <span id=\"fontWeightValue\">").concat(this._currentWeight, "</span>\n            </label>\n            <input \n              type=\"range\" \n              id=\"fontWeightSlider\" \n              class=\"").concat(VariableFontsWebPart_module_scss_1.default.slider, "\"\n              min=\"300\" \n              max=\"700\" \n              step=\"1\" \n              value=\"").concat(this._currentWeight, "\"\n            />\n          </div>\n          \n          <div class=\"").concat(VariableFontsWebPart_module_scss_1.default.controlGroup, "\">\n            <label for=\"opticalSizeSlider\" class=\"").concat(VariableFontsWebPart_module_scss_1.default.sliderLabel, "\">\n              Optical Size: <span id=\"opticalSizeValue\">").concat(this._currentOpticalSize, "</span>pt\n            </label>\n            <input \n              type=\"range\" \n              id=\"opticalSizeSlider\" \n              class=\"").concat(VariableFontsWebPart_module_scss_1.default.slider, "\"\n              min=\"5\" \n              max=\"36\" \n              step=\"1\" \n              value=\"").concat(this._currentOpticalSize, "\"\n            />\n          </div>\n          \n          <div class=\"").concat(VariableFontsWebPart_module_scss_1.default.controlGroup, "\">\n            <label class=\"").concat(VariableFontsWebPart_module_scss_1.default.checkboxLabel, "\">\n              <input \n                type=\"checkbox\" \n                id=\"italicCheckbox\" \n                class=\"").concat(VariableFontsWebPart_module_scss_1.default.checkbox, "\"\n                ").concat(this._italicEnabled ? 'checked' : '', "\n              />\n              <span class=\"").concat(VariableFontsWebPart_module_scss_1.default.checkboxText, "\">Italic</span>\n            </label>\n          </div>\n          \n          <div class=\"").concat(VariableFontsWebPart_module_scss_1.default.controlGroup, "\">\n            <h3 class=\"").concat(VariableFontsWebPart_module_scss_1.default.sectionTitle, "\">OpenType Features</h3>\n            \n            <label class=\"").concat(VariableFontsWebPart_module_scss_1.default.checkboxLabel, "\">\n              <input \n                type=\"checkbox\" \n                id=\"kerningCheckbox\" \n                class=\"").concat(VariableFontsWebPart_module_scss_1.default.checkbox, "\"\n                ").concat(this._kerningEnabled ? 'checked' : '', "\n              />\n              <span class=\"").concat(VariableFontsWebPart_module_scss_1.default.checkboxText, "\">Kerning (kern)</span>\n            </label>\n            \n            <label class=\"").concat(VariableFontsWebPart_module_scss_1.default.checkboxLabel, "\">\n              <input \n                type=\"checkbox\" \n                id=\"discretionaryLigaturesCheckbox\" \n                class=\"").concat(VariableFontsWebPart_module_scss_1.default.checkbox, "\"\n                ").concat(this._discretionaryLigatures ? 'checked' : '', "\n              />\n              <span class=\"").concat(VariableFontsWebPart_module_scss_1.default.checkboxText, "\">Discretionary Ligatures (dlig)</span>\n            </label>\n            \n            <label class=\"").concat(VariableFontsWebPart_module_scss_1.default.checkboxLabel, "\">\n              <input \n                type=\"checkbox\" \n                id=\"fractionsCheckbox\" \n                class=\"").concat(VariableFontsWebPart_module_scss_1.default.checkbox, "\"\n                ").concat(this._fractions ? 'checked' : '', "\n              />\n              <span class=\"").concat(VariableFontsWebPart_module_scss_1.default.checkboxText, "\">Fractions (frac)</span>\n            </label>\n            \n            <label class=\"").concat(VariableFontsWebPart_module_scss_1.default.checkboxLabel, "\">\n              <input \n                type=\"checkbox\" \n                id=\"tabularNumbersCheckbox\" \n                class=\"").concat(VariableFontsWebPart_module_scss_1.default.checkbox, "\"\n                ").concat(this._tabularNumbers ? 'checked' : '', "\n              />\n              <span class=\"").concat(VariableFontsWebPart_module_scss_1.default.checkboxText, "\">Tabular Numbers (tnum)</span>\n            </label>\n            \n            <label class=\"").concat(VariableFontsWebPart_module_scss_1.default.checkboxLabel, "\">\n              <input \n                type=\"checkbox\" \n                id=\"oldStyleNumbersCheckbox\" \n                class=\"").concat(VariableFontsWebPart_module_scss_1.default.checkbox, "\"\n                ").concat(this._oldStyleNumbers ? 'checked' : '', "\n              />\n              <span class=\"").concat(VariableFontsWebPart_module_scss_1.default.checkboxText, "\">Old Style Numbers (onum)</span>\n            </label>\n            \n            <label class=\"").concat(VariableFontsWebPart_module_scss_1.default.checkboxLabel, "\">\n              <input \n                type=\"checkbox\" \n                id=\"caseSensitiveCheckbox\" \n                class=\"").concat(VariableFontsWebPart_module_scss_1.default.checkbox, "\"\n                ").concat(this._caseSensitive ? 'checked' : '', "\n              />\n              <span class=\"").concat(VariableFontsWebPart_module_scss_1.default.checkboxText, "\">Case Sensitive (case)</span>\n            </label>\n            \n            <label class=\"").concat(VariableFontsWebPart_module_scss_1.default.checkboxLabel, "\">\n              <input \n                type=\"checkbox\" \n                id=\"stylisticSet1Checkbox\" \n                class=\"").concat(VariableFontsWebPart_module_scss_1.default.checkbox, "\"\n                ").concat(this._stylisticSet1 ? 'checked' : '', "\n              />\n              <span class=\"").concat(VariableFontsWebPart_module_scss_1.default.checkboxText, "\">Stylistic Set 1 (ss01)</span>\n            </label>\n          </div>\n        </div>\n      </div>\n    ");
        // Set initial CSS custom properties
        this.domElement.style.setProperty('--font-weight', this._currentWeight.toString());
        this.domElement.style.setProperty('--optical-size', this._currentOpticalSize.toString());
        this.domElement.style.setProperty('--kerning', this._kerningEnabled ? '1' : '0');
        this.domElement.style.setProperty('--discretionary-ligatures', this._discretionaryLigatures ? '1' : '0');
        this.domElement.style.setProperty('--fractions', this._fractions ? '1' : '0');
        this.domElement.style.setProperty('--tabular-numbers', this._tabularNumbers ? '1' : '0');
        this.domElement.style.setProperty('--old-style-numbers', this._oldStyleNumbers ? '1' : '0');
        this.domElement.style.setProperty('--case-sensitive', this._caseSensitive ? '1' : '0');
        this.domElement.style.setProperty('--stylistic-set-1', this._stylisticSet1 ? '1' : '0');
        // Additional feature settings with defaults
        this.domElement.style.setProperty('--discretionary-ligatures', '0');
        this.domElement.style.setProperty('--fractions', '0');
        this.domElement.style.setProperty('--tabular-numbers', '0');
        this.domElement.style.setProperty('--old-style-numbers', '0');
        this.domElement.style.setProperty('--case-sensitive', '0');
        this.domElement.style.setProperty('--stylistic-set-1', '0');
        // Debug: Check what font axes are actually supported
        this._debugFontSupport();
        // Add event listeners
        this._attachSliderEvents();
    };
    VariableFontsWebPart.prototype._debugFontSupport = function () {
        // This will help us understand what the font actually supports
        var fontDisplay = this.domElement.querySelector(".".concat(VariableFontsWebPart_module_scss_1.default.fontDisplay));
        if (fontDisplay) {
            var computedStyle = window.getComputedStyle(fontDisplay);
            console.debug('Font family resolved to:', computedStyle.fontFamily);
            console.debug('Font variation settings:', computedStyle.fontVariationSettings || 'Not supported');
            console.debug('Font feature settings:', computedStyle.fontFeatureSettings || 'Not supported');
        }
    };
    VariableFontsWebPart.prototype._attachSliderEvents = function () {
        var _this = this;
        // Font Weight Slider
        var weightSlider = this.domElement.querySelector('#fontWeightSlider');
        var weightValueDisplay = this.domElement.querySelector('#fontWeightValue');
        if (weightSlider && weightValueDisplay) {
            weightSlider.addEventListener('input', function (event) {
                var target = event.target;
                var newWeight = parseInt(target.value, 10);
                // Update current weight
                _this._currentWeight = newWeight;
                // Update CSS custom property
                _this.domElement.style.setProperty('--font-weight', newWeight.toString());
                // Update display value
                weightValueDisplay.textContent = newWeight.toString();
                console.debug('Font weight updated via slider to:', newWeight);
            });
        }
        // Optical Size Slider
        var opticalSlider = this.domElement.querySelector('#opticalSizeSlider');
        var opticalValueDisplay = this.domElement.querySelector('#opticalSizeValue');
        if (opticalSlider && opticalValueDisplay) {
            opticalSlider.addEventListener('input', function (event) {
                var target = event.target;
                var newOpticalSize = parseInt(target.value, 10);
                // Update current optical size
                _this._currentOpticalSize = newOpticalSize;
                // Update CSS custom property
                _this.domElement.style.setProperty('--optical-size', newOpticalSize.toString());
                // Update display value
                opticalValueDisplay.textContent = newOpticalSize.toString();
                console.debug('Optical size updated via slider to:', newOpticalSize);
            });
        }
        // Italic Checkbox
        var italicCheckbox = this.domElement.querySelector('#italicCheckbox');
        if (italicCheckbox) {
            italicCheckbox.addEventListener('change', function (event) {
                var target = event.target;
                var italicEnabled = target.checked;
                // Update current italic state
                _this._italicEnabled = italicEnabled;
                // Toggle CSS class on font display element
                var fontDisplay = _this.domElement.querySelector(".".concat(VariableFontsWebPart_module_scss_1.default.fontDisplay));
                if (fontDisplay) {
                    if (italicEnabled) {
                        fontDisplay.classList.add(VariableFontsWebPart_module_scss_1.default.italic);
                    }
                    else {
                        fontDisplay.classList.remove(VariableFontsWebPart_module_scss_1.default.italic);
                    }
                }
                console.debug('Italic updated to:', italicEnabled);
            });
        }
        // Kerning Checkbox
        var kerningCheckbox = this.domElement.querySelector('#kerningCheckbox');
        if (kerningCheckbox) {
            kerningCheckbox.addEventListener('change', function (event) {
                var target = event.target;
                var kerningEnabled = target.checked;
                // Update current kerning state
                _this._kerningEnabled = kerningEnabled;
                // Update CSS custom property
                _this.domElement.style.setProperty('--kerning', kerningEnabled ? '1' : '0');
                console.debug('Kerning updated via checkbox to:', kerningEnabled);
            });
        }
        // Discretionary Ligatures Checkbox
        var dligCheckbox = this.domElement.querySelector('#discretionaryLigaturesCheckbox');
        if (dligCheckbox) {
            dligCheckbox.addEventListener('change', function (event) {
                var target = event.target;
                _this._discretionaryLigatures = target.checked;
                _this.domElement.style.setProperty('--discretionary-ligatures', target.checked ? '1' : '0');
                console.debug('Discretionary ligatures updated to:', target.checked);
            });
        }
        // Fractions Checkbox
        var fracCheckbox = this.domElement.querySelector('#fractionsCheckbox');
        if (fracCheckbox) {
            fracCheckbox.addEventListener('change', function (event) {
                var target = event.target;
                _this._fractions = target.checked;
                _this.domElement.style.setProperty('--fractions', target.checked ? '1' : '0');
                console.debug('Fractions updated to:', target.checked);
            });
        }
        // Tabular Numbers Checkbox
        var tnumCheckbox = this.domElement.querySelector('#tabularNumbersCheckbox');
        if (tnumCheckbox) {
            tnumCheckbox.addEventListener('change', function (event) {
                var target = event.target;
                _this._tabularNumbers = target.checked;
                _this.domElement.style.setProperty('--tabular-numbers', target.checked ? '1' : '0');
                console.debug('Tabular numbers updated to:', target.checked);
            });
        }
        // Old Style Numbers Checkbox
        var onumCheckbox = this.domElement.querySelector('#oldStyleNumbersCheckbox');
        if (onumCheckbox) {
            onumCheckbox.addEventListener('change', function (event) {
                var target = event.target;
                _this._oldStyleNumbers = target.checked;
                _this.domElement.style.setProperty('--old-style-numbers', target.checked ? '1' : '0');
                console.debug('Old style numbers updated to:', target.checked);
            });
        }
        // Case Sensitive Checkbox
        var caseCheckbox = this.domElement.querySelector('#caseSensitiveCheckbox');
        if (caseCheckbox) {
            caseCheckbox.addEventListener('change', function (event) {
                var target = event.target;
                _this._caseSensitive = target.checked;
                _this.domElement.style.setProperty('--case-sensitive', target.checked ? '1' : '0');
                console.debug('Case sensitive updated to:', target.checked);
            });
        }
        // Stylistic Set 1 Checkbox
        var ss01Checkbox = this.domElement.querySelector('#stylisticSet1Checkbox');
        if (ss01Checkbox) {
            ss01Checkbox.addEventListener('change', function (event) {
                var target = event.target;
                _this._stylisticSet1 = target.checked;
                _this.domElement.style.setProperty('--stylistic-set-1', target.checked ? '1' : '0');
                console.debug('Stylistic set 1 updated to:', target.checked);
            });
        }
    };
    VariableFontsWebPart.prototype._fetchCdnFontBaseUrl = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var response, data, cdnBaseUrl, fontBasePath, fontCDNUrl;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("".concat(this.context.pageContext.web.absoluteUrl, "/_api/SP.BrandCenter/Configuration?src=VariableFontsWebPart"), {
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
    VariableFontsWebPart.prototype._renderFontDefinition = function () {
        var styleBlock = "\n  <style>\n      @font-face {\n        font-family: \"Segoe UI Variable\";\n        src: \n          \n             url(".concat(this._fontBaseUrlCdn + '/' + VariableFontsWebPart.FONTFILENAME, "),\n             url(").concat(this._fontBaseUrl + '/' + VariableFontsWebPart.FONTFILENAME, ");\n        font-weight: 300 700;\n        font-style: normal;\n        font-display: swap;\n        font-optical-sizing: auto;\n      }\n      @font-face {\n        font-family: \"Segoe UI Variable\";\n        src: \n          \n             url(").concat(this._fontBaseUrlCdn + '/' + VariableFontsWebPart.FONTFILENAME, "),\n             url(").concat(this._fontBaseUrl + '/' + VariableFontsWebPart.FONTFILENAME, ");\n        font-weight: 300 700;\n        font-style: italic;\n        font-display: swap;\n        font-optical-sizing: auto;\n      }\n    </style>\n");
        this.domElement.innerHTML += styleBlock;
    };
    VariableFontsWebPart.prototype.onInit = function () {
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
                        // Render font definitions after DOM content is set
                        this._renderFontDefinition();
                        return [2 /*return*/, _super.prototype.onInit.call(this)];
                }
            });
        });
    };
    Object.defineProperty(VariableFontsWebPart.prototype, "dataVersion", {
        get: function () {
            return sp_core_library_1.Version.parse('1.0');
        },
        enumerable: false,
        configurable: true
    });
    // Property
    VariableFontsWebPart.FONTFILENAME = 'SegoeUI-VF.ttf';
    return VariableFontsWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = VariableFontsWebPart;
//# sourceMappingURL=VariableFontsWebPart.js.map
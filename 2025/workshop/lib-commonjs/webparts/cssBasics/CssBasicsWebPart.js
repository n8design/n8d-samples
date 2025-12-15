"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var sp_core_library_1 = require("@microsoft/sp-core-library");
var sp_property_pane_1 = require("@microsoft/sp-property-pane");
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var sp_lodash_subset_1 = require("@microsoft/sp-lodash-subset");
var CssBasicsWebPart_module_scss_1 = tslib_1.__importDefault(require("./CssBasicsWebPart.module.scss"));
var strings = tslib_1.__importStar(require("CssBasicsWebPartStrings"));
var CssBasicsWebPart = /** @class */ (function (_super) {
    tslib_1.__extends(CssBasicsWebPart, _super);
    function CssBasicsWebPart() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._isDarkTheme = false;
        _this._environmentMessage = '';
        return _this;
    }
    CssBasicsWebPart.prototype.render = function () {
        this.domElement.innerHTML = "\n    <section class=\"".concat(CssBasicsWebPart_module_scss_1.default.cssBasics, " ").concat(!!this.context.sdks.microsoftTeams ? CssBasicsWebPart_module_scss_1.default.teams : '', "\">\n      <div class=\"").concat(CssBasicsWebPart_module_scss_1.default.welcome, "\">\n        <img alt=\"\" src=\"").concat(this._isDarkTheme ? require('./assets/welcome-dark.png') : require('./assets/welcome-light.png'), "\" class=\"").concat(CssBasicsWebPart_module_scss_1.default.welcomeImage, "\" />\n        <h2>Well done, ").concat((0, sp_lodash_subset_1.escape)(this.context.pageContext.user.displayName), "!</h2>\n        <div>").concat(this._environmentMessage, "</div>\n        <div>Web part property value: <strong>").concat((0, sp_lodash_subset_1.escape)(this.properties.description), "</strong></div>\n      </div>\n      <div>\n        <h3>Welcome to SharePoint Framework!</h3>\n        <p>\n        The SharePoint Framework (SPFx) is a extensibility model for Microsoft Viva, Microsoft Teams and SharePoint. It's the easiest way to extend Microsoft 365 with automatic Single Sign On, automatic hosting and industry standard tooling.\n        </p>\n        <h4>Learn more about SPFx development:</h4>\n          <ul class=\"").concat(CssBasicsWebPart_module_scss_1.default.links, "\">\n            <li><a href=\"https://aka.ms/spfx\" target=\"_blank\">SharePoint Framework Overview</a></li>\n            <li><a href=\"https://aka.ms/spfx-yeoman-graph\" target=\"_blank\">Use Microsoft Graph in your solution</a></li>\n            <li><a href=\"https://aka.ms/spfx-yeoman-teams\" target=\"_blank\">Build for Microsoft Teams using SharePoint Framework</a></li>\n            <li><a href=\"https://aka.ms/spfx-yeoman-viva\" target=\"_blank\">Build for Microsoft Viva Connections using SharePoint Framework</a></li>\n            <li><a href=\"https://aka.ms/spfx-yeoman-store\" target=\"_blank\">Publish SharePoint Framework applications to the marketplace</a></li>\n            <li><a href=\"https://aka.ms/spfx-yeoman-api\" target=\"_blank\">SharePoint Framework API reference</a></li>\n            <li><a href=\"https://aka.ms/m365pnp\" target=\"_blank\">Microsoft 365 Developer Community</a></li>\n          </ul>\n      </div>\n    </section>");
    };
    CssBasicsWebPart.prototype.onInit = function () {
        var _this = this;
        return this._getEnvironmentMessage().then(function (message) {
            _this._environmentMessage = message;
        });
    };
    CssBasicsWebPart.prototype._getEnvironmentMessage = function () {
        var _this = this;
        if (!!this.context.sdks.microsoftTeams) { // running in Teams, office.com or Outlook
            return this.context.sdks.microsoftTeams.teamsJs.app.getContext()
                .then(function (context) {
                var environmentMessage = '';
                switch (context.app.host.name) {
                    case 'Office': // running in Office
                        environmentMessage = _this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOffice : strings.AppOfficeEnvironment;
                        break;
                    case 'Outlook': // running in Outlook
                        environmentMessage = _this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentOutlook : strings.AppOutlookEnvironment;
                        break;
                    case 'Teams': // running in Teams
                    case 'TeamsModern':
                        environmentMessage = _this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentTeams : strings.AppTeamsTabEnvironment;
                        break;
                    default:
                        environmentMessage = strings.UnknownEnvironment;
                }
                return environmentMessage;
            });
        }
        return Promise.resolve(this.context.isServedFromLocalhost ? strings.AppLocalEnvironmentSharePoint : strings.AppSharePointEnvironment);
    };
    CssBasicsWebPart.prototype.onThemeChanged = function (currentTheme) {
        if (!currentTheme) {
            return;
        }
        this._isDarkTheme = !!currentTheme.isInverted;
        var semanticColors = currentTheme.semanticColors, palette = currentTheme.palette, effects = currentTheme.effects;
        console.debug('THEME', palette);
        console.debug('THEME', semanticColors);
        console.debug('THEME', effects);
        if (semanticColors) {
            this.domElement.style.setProperty('--bodyText', semanticColors.bodyText || null);
            this.domElement.style.setProperty('--link', semanticColors.link || null);
            this.domElement.style.setProperty('--linkHovered', semanticColors.linkHovered || null);
        }
    };
    Object.defineProperty(CssBasicsWebPart.prototype, "dataVersion", {
        get: function () {
            return sp_core_library_1.Version.parse('1.0');
        },
        enumerable: false,
        configurable: true
    });
    CssBasicsWebPart.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: {
                        description: strings.PropertyPaneDescription
                    },
                    groups: [
                        {
                            groupName: strings.BasicGroupName,
                            groupFields: [
                                (0, sp_property_pane_1.PropertyPaneTextField)('description', {
                                    label: strings.DescriptionFieldLabel
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    };
    return CssBasicsWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = CssBasicsWebPart;
//# sourceMappingURL=CssBasicsWebPart.js.map
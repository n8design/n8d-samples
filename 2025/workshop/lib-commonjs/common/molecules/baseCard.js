"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BaseCard;
var tslib_1 = require("tslib");
var index_1 = require("../atoms/index");
var molecules_module_scss_1 = tslib_1.__importDefault(require("./molecules.module.scss"));
function BaseCard() {
    var card = document.createElement('article');
    card.classList.add(molecules_module_scss_1.default.baseCard);
    card.appendChild((0, index_1.CardMedia)());
    card.appendChild((0, index_1.CardHeader)());
    card.appendChild((0, index_1.CardDescription)());
    return card;
}
//# sourceMappingURL=baseCard.js.map
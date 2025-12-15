"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CardHeader;
var tslib_1 = require("tslib");
var atoms_module_scss_1 = tslib_1.__importDefault(require("./atoms.module.scss"));
function CardHeader() {
    var header = document.createElement('h2');
    header.textContent = 'Card Header';
    header.classList.add(atoms_module_scss_1.default.cardHeader);
    return header;
}
//# sourceMappingURL=cardHeader.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CardDescription;
var tslib_1 = require("tslib");
var atoms_module_scss_1 = tslib_1.__importDefault(require("./atoms.module.scss"));
function CardDescription() {
    var description = document.createElement('p');
    description.textContent = 'lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
    description.classList.add(atoms_module_scss_1.default.cardDescription);
    return description;
}
//# sourceMappingURL=cardDescription.js.map
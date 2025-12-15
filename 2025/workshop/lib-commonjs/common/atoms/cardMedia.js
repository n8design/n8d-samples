"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CardMedia;
var tslib_1 = require("tslib");
var atoms_module_scss_1 = tslib_1.__importDefault(require("./atoms.module.scss"));
function CardMedia() {
    var figure = document.createElement('figure');
    figure.classList.add(atoms_module_scss_1.default.cardMedia);
    var img = document.createElement('img');
    img.src = 'https://picsum.photos/480/270?random=' + Math.floor(Math.random() * 1000);
    img.alt = 'Random Image';
    img.loading = 'lazy';
    figure.appendChild(img);
    return figure;
}
//# sourceMappingURL=cardMedia.js.map
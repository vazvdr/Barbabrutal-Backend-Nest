"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TelefoneUtils = /** @class */ (function () {
    function TelefoneUtils() {
    }
    TelefoneUtils.formatar = function (telefone) {
        if (!telefone)
            return '';
        var numeros = this.desformatar(telefone);
        return numeros.length <= 10
            ? this.substituirNumeros(numeros, '(xx) xxxx-xxxx')
            : this.substituirNumeros(numeros, '(xx) xxxxx-xxxx');
    };
    TelefoneUtils.desformatar = function (telefone) {
        if (!telefone)
            return '';
        return telefone.replace(/\D/g, '').slice(0, 11);
    };
    TelefoneUtils.substituirNumeros = function (telefone, ref) {
        var formatado = telefone
            .split('')
            .reduce(function (telefone, numero) {
            return telefone.replace('x', numero);
        }, ref)
            .replace(/x/g, '');
        if (telefone.length <= 2)
            formatado = formatado.replace(')', '').replace(' ', '');
        if (telefone.length <= 6)
            formatado = formatado.replace('-', '');
        return formatado;
    };
    return TelefoneUtils;
}());
exports.default = TelefoneUtils;

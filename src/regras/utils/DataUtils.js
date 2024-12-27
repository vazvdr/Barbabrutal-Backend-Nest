"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DataUtils = /** @class */ (function () {
    function DataUtils() {
    }
    DataUtils.hoje = function () {
        var hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        return hoje;
    };
    // new Date(), '09:45'
    DataUtils.aplicarHorario = function (data, horario) {
        var novaData = new Date(data);
        var partes = horario.split(':');
        novaData.setHours(parseInt(partes[0]), parseInt(partes[1]));
        return novaData;
    };
    DataUtils.formatarData = function (data) {
        return data.toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };
    DataUtils.formatarDataEHora = function (data) {
        return data.toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        });
    };
    return DataUtils;
}());
exports.default = DataUtils;

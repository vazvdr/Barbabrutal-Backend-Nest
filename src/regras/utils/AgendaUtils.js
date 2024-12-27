"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AgendaUtils = /** @class */ (function () {
    function AgendaUtils() {
    }
    AgendaUtils.horariosDoDia = function () {
        return {
            manha: this.gerarHorarios([8, 9, 10, 11]),
            tarde: this.gerarHorarios([14, 15, 16, 17]),
            noite: this.gerarHorarios([18, 19, 20, 21]),
        };
    };
    AgendaUtils.duracaoTotal = function (servicos) {
        var duracao = servicos.reduce(function (acc, atual) {
            return (acc += atual.qtdeSlots * 15);
        }, 0);
        return "".concat(Math.trunc(duracao / 60), "h ").concat(duracao % 60, "m");
    };
    AgendaUtils.gerarHorarios = function (horas) {
        var _this = this;
        return horas.reduce(function (horarios, hora) {
            var todos = _this.minutos.map(function (minuto) {
                return "".concat(String(hora).padStart(2, '0'), ":").concat(String(minuto).padStart(2, '0'));
            });
            return horarios.concat(todos);
        }, []);
    };
    AgendaUtils.minutos = [0, 15, 30, 45];
    return AgendaUtils;
}());
exports.default = AgendaUtils;

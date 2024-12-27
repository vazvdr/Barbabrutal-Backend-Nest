const moment = require('moment-timezone');
const { TEMPO_SLOT } = require('../constants');

class ObterHorariosOcupados {
    constructor(repo) {
        this.repo = repo;
    }

    async executar(profissionalId, data) {
        const dataBrasilia = moment.tz(data, 'America/Sao_Paulo');

        const agendamentos = await this.repo.buscarPorProfissionalEData(profissionalId, dataBrasilia);

        const dados = agendamentos
            .map((agendamento) => {
                return {
                    data: moment.tz(agendamento.data, 'America/Sao_Paulo'),
                    slots: agendamento.servicos.reduce((total, s) => total + s.qtdeSlots, 0),
                };
            })
            .reduce((horariosOcupados, dados) => {
                const horario = dados.data;
                const slots = dados.slots;
                const horarios = Array.from({ length: slots }, (_, i) => {
                    return this.somarMinutos(horario, i * TEMPO_SLOT);
                });
                return [...horariosOcupados, ...horarios];
            }, [])
            .map((d) => d.format('HH:mm'));

        return dados; // Exemplo: [ '10:00', '10:15', '10:30', '10:45', '14:15' ]
    }

    somarMinutos(data, minutos) {
        return data.clone().add(minutos, 'minutes');
    }
}

module.exports = ObterHorariosOcupados;

import { TEMPO_SLOT } from '../constants';
import RepositorioAgendamento from './RepositorioAgendamento';

export default class ObterHorariosOcupados {
    constructor(private readonly repo: RepositorioAgendamento) {}

    async executar(profissionalId: number, data: Date): Promise<string[]> {
        const agendamentos = await this.repo.buscarPorProfissionalEData(profissionalId, data);

        const dados = agendamentos
            .map((agendamento) => {
                return {
                    data: this.ajustarParaFusoHorarioBrasilia(agendamento.data),
                    slots: agendamento.servicos.reduce((total, s) => total + s.qtdeSlots, 0),
                };
            })
            .reduce((horariosOcupados: Date[], dados: any) => {
                const horario = dados.data;
                const slots = dados.slots;
                const horarios = Array.from({ length: slots }, (_, i) =>
                    this.somarMinutos(horario, i * TEMPO_SLOT)
                );
                return [...horariosOcupados, ...horarios];
            }, [])
            .map((d) => d.toTimeString().slice(0, 5)); // Retorna no formato 'HH:mm'

        return dados; // Exemplo: [ '10:00', '10:15', '10:30', '10:45', '14:15' ]
    }

    private somarMinutos(data: Date, minutos: number): Date {
        return new Date(data.getTime() + minutos * 60000);
    }

    private ajustarParaFusoHorarioBrasilia(data: Date): Date {
        const dataUtc = new Date(data); // Assume que `data` está em UTC
        const offsetBrasilia = -3; // Fuso horário de Brasília em horas (UTC-3)
        return new Date(dataUtc.getTime() + offsetBrasilia * 60 * 60 * 1000); // Ajusta para Brasília
    }
}

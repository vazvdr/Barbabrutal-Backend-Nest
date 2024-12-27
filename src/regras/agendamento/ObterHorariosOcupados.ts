import { TEMPO_SLOT } from '../constants'
import RepositorioAgendamento from './RepositorioAgendamento'
import moment from 'moment-timezone'

export default class ObterHorariosOcupados {
    constructor(private readonly repo: RepositorioAgendamento) {}

    async executar(profissionalId: number, data: Date): Promise<string[]> {
        const dataBrasilia = moment(data).tz('America/Sao_Paulo', true).toDate()
        
        const agendamentos = await this.repo.buscarPorProfissionalEData(profissionalId, dataBrasilia)
        
        const dados = agendamentos
            .map((agendamento) => {
                const horarioBrasilia = moment(agendamento.data).tz('America/Sao_Paulo', true).toDate()
                
                return {
                    data: horarioBrasilia,
                    slots: agendamento.servicos.reduce((total, s) => total + s.qtdeSlots, 0),
                }
            })
            .reduce((horariosOcupados: Date[], dados: any) => {
                const horario = dados.data
                const slots = dados.slots
                const horarios = Array.from({ length: slots }, (_, i) =>
                    this.somarMinutos(horario, i * TEMPO_SLOT)
                )
                return [...horariosOcupados, ...horarios]
            }, [])

        const horariosFormatados = dados.map((d) => moment(d).tz('America/Sao_Paulo').format('HH:mm'))

        return horariosFormatados // Ex: [ '10:00', '10:15', '10:30', '10:45', '14:15' ]
    }

    private somarMinutos(data: Date, minutos: number): Date {
        return new Date(data.getTime() + minutos * 60000)
    }
}

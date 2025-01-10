import { Agendamento, ObterHorariosOcupados, Usuario } from '../regras';
import { AgendamentoRepository } from './agendamento.repository';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsuarioLogado } from '../usuario/usuario.decorator';

@Controller('agendamentos')
export class AgendamentoController {
  constructor(private readonly repo: AgendamentoRepository) {}

  @Post()
  criar(
    @Body() agendamento: Agendamento,
    @UsuarioLogado() usuarioLogado: Usuario,
  ) {
    if (agendamento.usuario.id !== usuarioLogado.id) {
      throw new HttpException('Usuário não autorizado', 401);
    }
    return this.repo.criar(agendamento);
  }

  @Get(':email')
  buscarPorEmail(@Param('email') email: string) {
    return this.repo.buscarPorEmail(email);
  }

  @Get('ocupacao/:profissional/:data')
  buscarOcupacaoPorProfissionalEData(
    @Param('profissional') profissional: string,
    @Param('data') dataParam: string,
  ) {
    const casoDeUso = new ObterHorariosOcupados(this.repo);
    return casoDeUso.executar(+profissional, new Date(dataParam));
  }

  @Get(':profissional/:data')
  buscarPorProfissionalEData(
    @Param('profissional') profissional: string,
    @Param('data') dataParam: string,
  ) {
    return this.repo.buscarPorProfissionalEData(
      +profissional,
      new Date(dataParam),
    );
  }

  @Get('cliente/:clienteId/:data')
  async buscarAgendamentosPorClienteEData(
    @Param('clienteId') clienteId: string,
    @Param('data') dataParam: string,
    @UsuarioLogado() usuarioLogado: Usuario,
  ) {
    if (usuarioLogado.id !== +clienteId) {
      throw new HttpException('Usuário não autorizado', 401);
    }

    const data = new Date(dataParam);
    if (isNaN(data.getTime())) {
      throw new HttpException('Data inválida', 400);
    }

    const agendamentos = await this.repo.buscarPorClienteEData(+clienteId, data);
    if (!agendamentos || agendamentos.length === 0) {
      throw new HttpException('Nenhum agendamento encontrado', 404);
    }

    return agendamentos;
  }

  @Put(':id')
  async alterar(
    @Param('id') id: string,
    @Body() agendamento: Agendamento,
    @UsuarioLogado() usuarioLogado: Usuario,
  ) {
    if (!usuarioLogado) {
      throw new HttpException('Usuário não autorizado', 401);
    }

    const agendamentoExistente = await this.repo.buscarPorClienteEData(
      usuarioLogado.id,
      new Date(agendamento.data),
    );

    if (!agendamentoExistente) {
      throw new HttpException('Agendamento não encontrado', 404);
    }

    if (agendamento.usuario.id !== usuarioLogado.id) {
      throw new HttpException('Usuário não autorizado', 401);
    }

    await this.repo.alterar(+id, agendamento);
  }

  @Delete(':id')
  async excluir(
    @Param('id') id: string,
    @UsuarioLogado() usuarioLogado: Usuario,
  ) {
    if (!usuarioLogado) {
      throw new HttpException('Usuário não autorizado', 401);
    }
    await this.repo.excluir(+id);
  }
}

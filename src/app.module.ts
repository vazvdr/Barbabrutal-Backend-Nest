import { Module } from '@nestjs/common';
import { DbModule } from './db/db.module';
import { ServicoModule } from './servico/servico.module';
import { AgendamentoModule } from './agendamento/agendamento.module';
import { UsuarioModule } from './usuario/usuario.module';
import { ProfissionalModule } from './profissional/profissional.module';
import { UsuarioController } from './usuario/usuario.controller';
import { UsuarioMiddleware } from './usuario/usuario.middleware';

@Module({
  imports: [DbModule, ServicoModule, AgendamentoModule, UsuarioModule, ProfissionalModule],
  controllers: [UsuarioController],
  providers: [],
})
export class AppModule {}

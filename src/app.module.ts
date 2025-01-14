import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UsuarioController } from './usuario/usuario.controller';
import { UsuarioMiddleware } from './usuario/usuario.middleware';
import { DbModule } from './db/db.module';
import { ServicoModule } from './servico/servico.module';
import { AgendamentoModule } from './agendamento/agendamento.module';
import { UsuarioModule } from './usuario/usuario.module';
import { ProfissionalModule } from './profissional/profissional.module';

@Module({
  imports: [DbModule, ServicoModule, AgendamentoModule, UsuarioModule, ProfissionalModule],
  controllers: [UsuarioController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UsuarioMiddleware)
      .forRoutes('usuario/alterar', 'usuario/excluir');
  }
}

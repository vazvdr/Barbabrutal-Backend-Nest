import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { UsuarioController } from './usuario.controller';
import { UsuarioMiddleware } from './usuario.middleware';
import { UsuarioRepository } from './usuario.repository';
import { BcryptProvider } from './bcrypt.provider';

@Module({
  controllers: [UsuarioController],
  providers: [UsuarioRepository, BcryptProvider],
})
export class UsuarioModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UsuarioMiddleware) // Aplica o middleware
      .forRoutes('usuario/alterar', 'usuario/excluir'); // Especifica rotas
  }
}

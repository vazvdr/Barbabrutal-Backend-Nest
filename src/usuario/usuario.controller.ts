import { UsuarioRepository } from './usuario.repository';
import { LoginUsuario, RegistrarUsuario, Usuario } from '../regras';
import { Body, Controller, Delete, HttpException, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { BcryptProvider } from './bcrypt.provider';
import * as jwt from 'jsonwebtoken';
import { UsuarioLogado } from './usuario.decorator';
import { UsuarioMiddleware } from './usuario.middleware';

@Controller('usuario')
@UseInterceptors(UsuarioMiddleware)
export class UsuarioController {
  constructor(
    private readonly repo: UsuarioRepository,
    private readonly cripto: BcryptProvider,
  ) { }

  @Post('login')
  async login(
    @Body() dados: { email: string; senha: string },
  ): Promise<string> {
    const casoDeUso = new LoginUsuario(this.repo, this.cripto);
    const usuario = await casoDeUso.executar(dados.email, dados.senha);
    const segredo = process.env.JWT_SECRET!;
    return jwt.sign(usuario, segredo, { expiresIn: '15d' });
  }

  @Post('registrar')
  async registrar(@Body() usuario: Usuario): Promise<void> {
    const casoDeUso = new RegistrarUsuario(this.repo, this.cripto);
    await casoDeUso.executar(usuario);
  }

  @Put('alterar')
  async alterar(
    @Body() dados: { email: string; senha: string; telefone: string },
    @UsuarioLogado() usuarioLogado: Usuario,
  ): Promise<void> {
    console.log('Dados recebidos:', dados);
    console.log('Usuário logado:', usuarioLogado);

    if (!dados) {
      throw new HttpException('Corpo da requisição está vazio', 400);
    }

    if (usuarioLogado.email !== dados.email) {
      throw new HttpException('Não autorizado para alterar os dados usuário', 403);
    }

    await this.repo.alterar(usuarioLogado.id, dados.email, dados.senha, dados.telefone);
  }

  @Delete('excluir')
  async excluir(@UsuarioLogado() usuarioLogado: Usuario): Promise<void> {
    await this.repo.excluir(usuarioLogado.id);
  }
}

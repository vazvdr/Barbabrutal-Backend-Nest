import { UsuarioRepository } from './usuario.repository';
import { LoginUsuario, RegistrarUsuario, Usuario } from '../regras';
import { Body, Controller, Delete, HttpException, Post, Put, UseInterceptors } from '@nestjs/common';
import { BcryptProvider } from './bcrypt.provider';
import * as jwt from 'jsonwebtoken';
import { UsuarioLogado } from './usuario.decorator';
import { UsuarioMiddleware } from './usuario.middleware';

@Controller('usuario')
@UseInterceptors(UsuarioMiddleware)
export class UsuarioController {
  usuarioRepository: any;
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

  @Post('alterar')
  async alterar(
    @Body() dados: { email: string; senha: string; telefone: string },
    @UsuarioLogado() usuarioLogado: Usuario,
  ): Promise<void> {
    console.log('Dados recebidos:', dados);
    console.log('Usuário logado:', usuarioLogado);
  
    if (!dados) {
      throw new HttpException('Corpo da requisição está vazio', 400);
    }
  
    if (!usuarioLogado) {
      throw new HttpException('Usuário não autenticado', 401);
    }
  
    // Usando o método buscarPorId do repositório
    const usuarioDoBanco = await this.repo.buscarPorId(usuarioLogado.id);
  
    if (!usuarioDoBanco) {
      throw new HttpException('Usuário não encontrado no banco de dados', 404);
    }
  
    if (usuarioLogado.email !== usuarioDoBanco.email) {
      throw new HttpException('Não autorizado para alterar os dados do usuário', 403);
    }
  
    try {
      await this.repo.alterar({
        id: usuarioLogado.id,
        email: dados.email,
        senha: dados.senha,
        telefone: dados.telefone,
        nome: usuarioDoBanco.nome,
      });
    } catch (error) {
      console.error('Erro ao atualizar o usuário:', error);
      throw new HttpException('Erro ao atualizar os dados do usuário', 500);
    }
  }
  

  @Delete('excluir')
  async excluir(@UsuarioLogado() usuarioLogado: Usuario): Promise<void> {
    await this.repo.excluir(usuarioLogado.id);
  }
}

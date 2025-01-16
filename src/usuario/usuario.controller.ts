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
    @Body() dados: { token: string; email: string; senha: string; telefone: string },
  ): Promise<void> {
    const { token, email, senha, telefone } = dados;

    // Verifica se o token foi fornecido
    if (!token) {
      throw new HttpException('Token não fornecido', 401);
    }

    // Decodifica o token
    let usuarioToken;
    try {
      const segredo = process.env.JWT_SECRET!;
      usuarioToken = jwt.verify(token, segredo);
      console.log(dados)
    } catch (error) {
      throw new HttpException('Token inválido ou expirado', 401);
    }

    // Verifica se o usuário extraído do token possui um ID válido
    if (!usuarioToken || !usuarioToken.id) {
      throw new HttpException('Token inválido', 401);
    }

    // Busca o usuário no banco de dados pelo ID extraído do token
    const usuarioDoBanco = await this.usuarioRepository.buscarPorId(usuarioToken.id);

    if (!usuarioDoBanco) {
      throw new HttpException('Usuário não encontrado', 404);
    }

    // Atualiza os dados do usuário
    try {
      await this.usuarioRepository.alterar({
        id: usuarioDoBanco.id,
        email: email || usuarioDoBanco.email,
        senha: senha || usuarioDoBanco.senha,
        telefone: telefone || usuarioDoBanco.telefone,
        nome: usuarioDoBanco.nome, // Nome permanece inalterado
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

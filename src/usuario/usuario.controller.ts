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
    
  ): Promise<void> {
    console.log('Dados recebidos:', dados);
    

    if (!dados) {
      throw new HttpException('Corpo da requisição está vazio', 400);
    }

    

    // Verificar se o usuário logado é o mesmo que está sendo alterado
    

    // Atualiza diretamente os dados do usuário no banco de dados
    try {
      await this.usuarioRepository.alterar({
        
        email: dados.email,  // Atualizar email
        senha: dados.senha,  // Atualizar senha
        telefone: dados.telefone, // Atualizar telefone
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

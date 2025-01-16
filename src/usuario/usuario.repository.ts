import { Injectable } from '@nestjs/common';
import { RepositorioUsuario, Usuario } from '../regras';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class UsuarioRepository implements RepositorioUsuario {
  constructor(private readonly prismaService: PrismaService) {}

  async salvar(usuario: Usuario): Promise<void> {
    await this.prismaService.usuario.upsert({
      where: { id: usuario.id ?? -1 },
      update: usuario as any,
      create: usuario as any,
    });
  }

  async buscarPorEmail(email: string): Promise<Usuario> {
    return this.prismaService.usuario.findUnique({
      where: { email },
    });
  }

  async buscarPorId(id: number): Promise<Usuario | null> {
    return this.prismaService.usuario.findUnique({ where: { id } });
  }  

  async alterar(usuario: Usuario): Promise<Usuario> {
    // Atualiza os dados do usuário diretamente no banco de dados
    const usuarioAtualizado = await this.prismaService.usuario.update({
      where: { id: usuario.id },
      data: {
        email: usuario.email,
        senha: usuario.senha,
        telefone: usuario.telefone,
      },
    });

    return usuarioAtualizado;
  }

  async excluir(id: number): Promise<void> {
    await this.prismaService.usuario.delete({
      where: { id },
    });
  }
}

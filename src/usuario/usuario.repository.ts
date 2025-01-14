import { Injectable } from '@nestjs/common';
import { RepositorioUsuario, Usuario } from '../regras';
import { PrismaService } from 'src/db/prisma.service';

@Injectable()
export class UsuarioRepository implements RepositorioUsuario {
  constructor(private readonly prismaService: PrismaService) { }

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
  
  async alterar(id: number, email: string, senha: string, telefone: string): Promise<void> {
    await this.prismaService.usuario.update({
      where: { id },
      data: {
        email,
        senha,
        telefone,
      },
    });
  }
  
  async excluir(id: number): Promise<void> {
    await this.prismaService.usuario.delete({
      where: { id },
    });
  }

}

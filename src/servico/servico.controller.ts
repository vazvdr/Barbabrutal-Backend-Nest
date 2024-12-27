import { Controller, Get } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';

@Controller('servicos')
export class ServicoController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  buscarTodos() {
    return this.prisma.servico.findMany();
  }
}

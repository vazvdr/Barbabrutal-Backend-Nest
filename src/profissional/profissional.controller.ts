import { Controller, Get } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';

@Controller('profissionais')
export class ProfissionalController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  buscarTodos() {
    return this.prisma.profissional.findMany();
  }
}

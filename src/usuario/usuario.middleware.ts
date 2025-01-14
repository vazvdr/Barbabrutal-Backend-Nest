import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { UsuarioRepository } from './usuario.repository';
import { Usuario } from '../regras';

@Injectable()
export class UsuarioMiddleware implements NestMiddleware {
  constructor(private readonly repo: UsuarioRepository) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.replace('Bearer ', '');

    if (!token) {
      throw new HttpException('Token não informado', 401);
    }

    let usuario;
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET!) as Usuario;
      usuario = await this.repo.buscarPorEmail(payload.email!);

      if (!usuario) {
        throw new HttpException('Usuário não encontrado', 401);
      }
    } catch (err) {
      throw new HttpException('Token inválido', 403);
    }

    (req as any).usuario = usuario; 
    next();
  }
}

import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsuarioRepository } from './usuario.repository';
import * as jwt from 'jsonwebtoken';
import { Usuario } from '../regras';

@Injectable()
export class UsuarioMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Middleware executado, headers:', req.headers);
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const segredo = process.env.JWT_SECRET!;
        const usuario = jwt.verify(token, segredo);
        req['usuarioLogado'] = usuario;
      } catch (error) {
        console.error('Erro ao verificar token:', error);
      }
    }
    next();
  }
}

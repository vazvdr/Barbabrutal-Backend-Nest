import { Injectable, NestMiddleware, HttpException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UsuarioMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new HttpException('Token não fornecido', 401);
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new HttpException('Token inválido', 401);
    }

    try {
      const segredo = process.env.JWT_SECRET!;
      const payload = jwt.verify(token, segredo);
      req.usuarioLogado = payload; // Anexa o usuário logado à requisição
      next();
    } catch (err) {
      throw new HttpException('Token inválido ou expirado', 401);
    }
  }
}

import { Injectable, NestMiddleware, HttpException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class UsuarioMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        // Lista de métodos HTTP permitidos
        const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE'];

        // Verifica se o método HTTP da requisição é permitido
        if (!allowedMethods.includes(req.method)) {
            throw new HttpException(`Método ${req.method} não permitido`, 405);
        }

        // Continua o fluxo se o método for permitido
        next();
    }
}

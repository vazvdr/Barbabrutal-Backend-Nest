import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        origin: 'https://barbabrutal.vercel.app', // Permitir somente o frontend
        methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    });
    await app.listen(3000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Включаем CORS (если нужно, можно настроить origin)
  app.enableCors();

  // Префикс для всех роутов (например, будет /api/users, /api/tags)
  app.setGlobalPrefix('api');

  // 1) Настраиваем конфигурацию Swagger
  const config = new DocumentBuilder()
    .setTitle('My App')
    .setDescription('API documentation')
    .setVersion('1.0')
    // .addBearerAuth() // если нужно авторизовываться через Bearer Token
    .build();

  // 2) Создаём документ
  const document = SwaggerModule.createDocument(app, config);

  // 3) Подключаем UI на эндпоинте /api/docs
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get<number>('PORT') || 3333; // 🟢 Берём порт из .env
  await app.listen(port);
}
void bootstrap();

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // API prefix
  app.setGlobalPrefix('api/v1');

  // Swagger API documentation
  const config = new DocumentBuilder()
    .setTitle('SweetNight GEO System API')
    .setDescription('GEO (Generative Engine Optimization) Management Platform')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('roadmap', 'Roadmap management endpoints')
    .addTag('content', 'Content registry endpoints')
    .addTag('citations', 'Citation tracking endpoints')
    .addTag('analytics', 'Analytics and reporting endpoints')
    .addTag('workflow', 'Workflow automation endpoints')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🚀 SweetNight GEO System API running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api/docs`);
}

bootstrap();

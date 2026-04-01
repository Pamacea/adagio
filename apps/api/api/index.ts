import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

let cachedApp: any;

async function bootstrap() {
  if (!cachedApp) {
    const express = require('express');
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(express())
    );

    // Hide X-Powered-By header for security
    const httpAdapter = app.getHttpAdapter();
    if (httpAdapter.getInstance) {
      const instance = httpAdapter.getInstance();
      instance.disable('x-powered-by');
    }

    // Global prefix
    app.setGlobalPrefix('api/v1');

    // CORS
    app.enableCors({
      origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
      credentials: true,
    });

    // Validation pipe
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      })
    );

    // Swagger documentation
    const config = new DocumentBuilder()
      .setTitle('Adagio API')
      .setDescription("L'atlas harmonique intelligent pour guitaristes")
      .setVersion('0.4.1')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    await app.init();

    cachedApp = app;
  }

  return cachedApp;
}

// Vercel Edge Function handler
export default async function handler(req: any, res: any) {
  const app = await bootstrap();
  const expressApp = app.getHttpAdapter().getInstance();
  return expressApp(req, res);
}

import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WsAdapter } from '@nestjs/platform-ws';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: console,
  });

  const options = new DocumentBuilder()
    .setTitle('Ecommerce Service')
    .setDescription('Ecommerce service API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.useGlobalPipes(
    new ValidationPipe({
      validationError: {
        target: false,
        value: false,
      },
      // we want to see details of the validation errors, such as
      // the property and the constraints
      exceptionFactory: (errors) => new BadRequestException(errors),
    })
  );
  app.enableCors();
  app.useWebSocketAdapter(new WsAdapter(app));

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  const PORT = app.get(ConfigService).get<string>('PORT') || 3000;

  await app.listen(PORT, () => console.log(`Service started at port ${PORT}`));
}

void bootstrap();

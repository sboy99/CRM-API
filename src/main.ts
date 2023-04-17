import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // validation
  app.useGlobalPipes(new ValidationPipe());

  // logging
  app.use(morgan('dev'));
  // port
  const port = process.env.PORT || 8000;
  await app.listen(port);
  console.log(`Serving on port ${port}`);
}
bootstrap();

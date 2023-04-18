import { AppModule } from '@/app.module';
import { AllExceptionsFilter } from '@/filters/all-exceptions.filter';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      stopAtFirstError: true,
    }),
  );
  // filters
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  // logging
  app.use(morgan('dev'));
  // versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });
  // listening
  const port = process.env.PORT || 8000;
  await app.listen(port);
  console.log(`Server is listening on ${port}`);
}
bootstrap();

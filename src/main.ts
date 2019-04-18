import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { port } from './config';
import * as P from 'bluebird';
global.Promise = P;


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(port);
}
bootstrap();

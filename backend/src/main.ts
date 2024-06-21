import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config(); 

  const app = await NestFactory.create(AppModule);
  await app.listen(3001, () => Logger.log('Server running on http://localhost:3001', 'Bootstrap'));
}

bootstrap();
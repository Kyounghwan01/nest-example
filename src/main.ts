import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // validataion (npm i class-validator class-transformer)
  // whiteList -> 데코레이터 없는 프로퍼티는 무조건 거름
  // forbidNonWhitelisted -> validation이외의 값들도 에러메세지에 알려줌
  // transform -> 값을 받을때 정의한 타입으로 형변환
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();

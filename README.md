# nest 공부 정리

## service, controller 생성

1. controller 생성 단축어 -> `nest g co`
2. service 생성 단축어 -> `nest g se`

## params, body, query

1. body => @Body()
2. queryString => @Query("year")
3. params => @Params("id")

## db entities (스키마) 정의

1. module마다 entities 파일을 정의

- movies/entities/movie.entities.ts

```ts
// 서비스로 보내고 받는 인터페이스  만듬, 실제는 db 모델 들어감 (스키마)

export class Movie {
  id: number;
  title: string;
  year: number;
  genres: string[];
}
```

## controller에 사용할 service import

express에서는 `import service from './movies.service.ts'`로 가져오겠지만

nest에서는 위와 같이 가져오지 않고, `constructor`를 사용하여 `MoviesService ` 클래스를 가져와 사용한다

```ts {3}
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviceService: MoviesService) {}

  @Get()
  getAll(): Movie[] {
    return this.moviceService.getAll();
  }
}
```

controller에 service를 넣기 전 DI를 추가해야한다.

### module에 service와 controller 추가

```ts
import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

@Module({
  controllers: [MoviesController],
  // MoviesService를 provider에 넣어서 di를 시켜야 MoviesController에서 MoviesService를 사용할 수 있다.
  providers: [MoviesService],
})
export class MoviesModule {}
```

## status-code를 정의하지 않아도 알아서 nest에서 정의해준다

## NotFoundException 메소드로 에러 핸들링 가능하다

### NotFoundException

값이 없으면 없다는 에러메세지 res.send로 전송

```ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { Movie } from './entities/movie.entities';

@Injectable()
export class MoviesService {
  private movies: Movie[] = [];

  getOne(id: number): Movie {
    const movie = this.movies.find((movie) => movie.id === Number(id));
    if (!movie) {
      throw new NotFoundException(`Movie id ${id} not found`);
    }
    return movie;
  }
}
```

## validation

express에서 처럼 validataion을 일일히 구현하거나 미들웨어를 만들 필요가 없다

movie를 create할때 들어오는 body 값에 대해 validation을 한다

1. npm i class-validator class-transformer (validation에 필요한 패키지 설치)

2. main.ts에 pipeline 설정

```ts
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // whiteList -> 데코레이터 없는 프로퍼티는 무조건 거름
  // forbidNonWhitelisted -> validation이외의 값들도 에러메세지에 알려줌
  // transform -> 컨트롤러가 값을 받을때 정의한 타입으로 형변환
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
```

3. CreateMovieDto 생성

```ts
// movies/dto/create-movie.dto.ts
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  readonly title: string;
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  readonly title: string;

  @IsNumber()
  readonly year: number;

  // 배열이면 each true, 옵셔널 값이면 IsOptional 추가
  @IsOptional()
  @IsString({ each: true })
  readonly genres: string[];

  /**
   * 자동으로 validation 된다
   * {
    "statusCode": 400,
    "message": [
        "title must be a string",
        "year must be a number conforming to the specified constraints",
        "each value in genres must be a string"
    ],
    "error": "Bad Request"
}
   */
```

4. 생성한 dto를 controller에 연결

```ts {7}
// movies/movies.controller.ts
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviceService: MoviesService) {}

  @Post()
  create(@Body() movieData: CreateMovieDto) {
    return this.moviceService.create(movieData);
  }
}
```

## 모듈화

`app.module.ts`의 `imports`에 만들 모듈을 넣어준다

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';

@Module({
  imports: [MoviesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

해당 모듈은 controller와 service로 구성되어있다

```ts
// movies.module.ts
import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService],
})
export class MoviesModule {}
```

## unit test

`yarn test:cov`를 이용하면 어느 파일이 테스트가 안되고 있고, 해당 파일의 어떤 함수 및 몇번째 줄이 테스트가 안되어있는지 알 수 있다.

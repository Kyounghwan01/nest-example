import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateeMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entities';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  // 컨트롤러에서 서비스 가져옴
  // express에서는 import service를 하지만 nest에서는 constructor로 요청
  constructor(private readonly moviceService: MoviesService) {}

  @Get()
  getAll(): Movie[] {
    return this.moviceService.getAll();
  }

  @Get('search')
  search(@Query('year') searchYear: string) {
    return `we are search with title ${searchYear}`;
  }

  @Get('/:id')
  getOne(@Param('id') movieId: number): Movie {
    return this.moviceService.getOne(movieId);
  }

  @Post()
  create(@Body() movieData: CreateMovieDto) {
    return this.moviceService.create(movieData);
  }

  @Delete('/:id')
  remove(@Param('id') movieId: number) {
    return this.moviceService.deleteOne(movieId);
  }

  @Patch('/:id')
  patch(@Param('id') movieId: number, @Body() updateData: UpdateeMovieDto) {
    return this.moviceService.update(movieId, updateData);
  }
}

/**
 * 1. nest g co
2. get params => @Params("id") id: string
2-1 nest는 express위에서 작동하기에 req, res를 사용 가능하다.
req => @Req() , res => @Res() -> 그러나 nest의 속도 측면에서 볼때 req, res를 사용하지 않는 것이 좋다
3. body => @Body()
4. querystring => @Query()
5. service 만들기 nest g s
6. service에 들어갈 entities만들기 (스키마)
7. 컨트롤러에 서비스 넣기 (import 하지않고 constructor로 넣기)
// 자동으로 status code를 넣어준다
// NotFoundException로 에러 핸들링 가능
8. create, update, delete
9. validate 세팅 -> data transfer object (validate할 타입 정의 - CreateMovieDto) -> main.js에 파이프라인 만들(미들웨어)
10. 모듈화
11. DI -> service와 controller사이의 di 추가
 */

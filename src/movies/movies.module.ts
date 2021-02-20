import { Module } from '@nestjs/common';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';

@Module({
  controllers: [MoviesController],
  // MoviesService를 provider에 넣어서 di를 시켜야 MoviesController에서 MoviesService를 사용할 수 있다.
  providers: [MoviesService],
})
export class MoviesModule {}

import { PartialType } from '@nestjs/mapped-types';
import { CreateMovieDto } from './create-movie.dto';

// UpdateeMovieDto는 CreateMovieDto와 인터페이스 동일하나 필수 값이 아니다
export class UpdateeMovieDto extends PartialType(CreateMovieDto) {}

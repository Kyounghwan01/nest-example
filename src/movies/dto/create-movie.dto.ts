import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMovieDto {
  @IsString()
  readonly title: string;

  @IsNumber()
  readonly year: number;

  // 배열이면 each true
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
}

// type 체크와 동시이 validation을 안해도된다

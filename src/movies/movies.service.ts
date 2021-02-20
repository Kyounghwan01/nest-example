import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateeMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entities';

@Injectable()
export class MoviesService {
  // fake db
  //service에서는 쿼리 다룸
  private movies: Movie[] = [];

  getAll(): Movie[] {
    // 실제에는 db에 접근하여 전체 movie 가져옴
    return this.movies;
  }

  getOne(id: number): Movie {
    const movie = this.movies.find((movie) => movie.id === Number(id));
    if (!movie) {
      throw new NotFoundException(`Movie id ${id} not found`);
    }
    return movie;
  }

  deleteOne(id: number): boolean {
    this.getOne(id);
    this.movies = this.movies.filter((movie) => movie.id !== Number(id));
    return true;
  }

  create(movieData: CreateMovieDto) {
    this.movies.push({
      id: this.movies.length + 1,
      ...movieData,
    });
  }

  update(id: number, updateData: UpdateeMovieDto) {
    const movie = this.getOne(id);
    this.deleteOne(id);
    this.movies.push({ ...movie, ...updateData });
  }
}

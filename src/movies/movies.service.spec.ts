import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);

    service.create({
      title: 'test mobie',
      genres: ['test'],
      year: 2000,
    });
  });

  afterAll(() => {
    // 생성한 db 다 날림
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array', async () => {
      const result = service.getAll();
      expect(result).toBeInstanceOf(Array);
    });
  });

  describe('getOne', () => {
    // service는 무조건 it 안에서만 읽을수있음
    it('should return a movie', () => {
      const movie = service.getOne(1);
      expect(movie).toBeDefined();
      expect(movie.id).toEqual(1);
      expect(movie.title).toEqual('test mobie');
    });

    it('should throw 404 error', () => {
      try {
        service.getOne(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('Movie id 999 not found');
      }
    });
  });

  describe('deleteOne', () => {
    it('delete a movie', () => {
      const beforeDelete = service.getAll().length;

      service.deleteOne(1);
      const afterDelete = service.getAll().length;

      expect(afterDelete).toBeLessThan(beforeDelete);
    });

    it('should throw a NotFoundException', () => {
      try {
        service.deleteOne(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe('create', () => {
    it('should create a movie', () => {
      const beforeCreate = service.getAll().length;

      service.create({
        title: 'test movie 2',
        genres: ['test'],
        year: 2000,
      });

      const afterCreate = service.getAll().length;
      const after = service.getAll();

      expect(afterCreate).toBeGreaterThan(beforeCreate);
      expect(after[afterCreate - 1].title).toEqual('test movie 2');
    });
  });

  describe('update', () => {
    it('should update a movie', () => {
      service.update(1, { title: 'update test' });
      const movie = service.getOne(1);

      expect(movie.title).toEqual('update test');
    });

    it('should throw a NotFoundException', () => {
      try {
        service.update(999, { title: 'update test' });
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });
});

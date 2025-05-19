import { Injectable, NotFoundException } from '@nestjs/common';
import { Movie } from '../models/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';

@Injectable()
export class MoviesService {
  private movies: Movie[] = [];

  async findAll(page: number, limit: number) {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Return just the array instead of pagination object
    return this.movies;
  }

  async findOne(id: number) {
    const movie = this.movies.find(m => m.id === id);
    if (!movie) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    return movie;
  }

  async create(movie: CreateMovieDto) {
    const newMovie = {
      ...movie,
      id: Date.now(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.movies.push(newMovie);
    return newMovie;
  }

  async update(id: number, movieData: Partial<Movie>) {
    const index = this.movies.findIndex(m => m.id === id);
    if (index === -1) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }

    this.movies[index] = {
      ...this.movies[index],
      ...movieData,
    };

    return this.movies[index];
  }

  async delete(id: number) {
    const index = this.movies.findIndex(m => m.id === id);
    if (index === -1) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    this.movies.splice(index, 1);
  }
}
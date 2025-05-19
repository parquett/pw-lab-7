import { Injectable, NotFoundException } from '@nestjs/common';
import { Movie } from '../models/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class MoviesService {
  private readonly filePath = path.join(process.cwd(), 'data', 'movies.json');
  private movies: Movie[] = [];

  constructor() {
    this.initStorage();
  }

  private async initStorage() {
    try {
      await fs.mkdir(path.join(process.cwd(), 'data'), { recursive: true });
      const data = await fs.readFile(this.filePath, 'utf8');
      this.movies = JSON.parse(data);
    } catch (error) {
      this.movies = [];
      await this.saveToFile();
    }
  }

  private async saveToFile() {
    await fs.writeFile(this.filePath, JSON.stringify(this.movies, null, 2));
  }

  async findAll() {
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
    await this.saveToFile();
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

    await this.saveToFile();
    return this.movies[index];
  }

  async delete(id: number) {
    const index = this.movies.findIndex(m => m.id === id);
    if (index === -1) {
      throw new NotFoundException(`Movie with ID ${id} not found`);
    }
    this.movies.splice(index, 1);
    await this.saveToFile();
  }
}
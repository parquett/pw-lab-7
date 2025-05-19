import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { MoviesService } from './movies.service';
import { Permissions } from '../auth/permissions.decorator';
import { Movie } from '../models/movie.entity';
import { CreateMovieDto } from './dto/create-movie.dto';

@ApiTags('movies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all movies' })
  async getMovies() {
    try {
      return await this.moviesService.findAll();
    } catch (error) {
      console.error('Error fetching movies:', error);
      throw error;
    }
  }

  @Post()
  @Permissions('WRITE')
  @ApiOperation({ summary: 'Create a movie' })
  async createMovie(@Body() movie: CreateMovieDto) {
    try {
      console.log('Creating movie:', movie); // Debug log
      const result = await this.moviesService.create(movie);
      console.log('Created movie:', result); // Debug log
      return result;
    } catch (error) {
      console.error('Error creating movie:', error);
      throw error;
    }
  }
  @Put(':id')
  @Permissions('UPDATE')
  @ApiOperation({ summary: 'Update a movie' })
  async updateMovie(@Param('id') id: string, @Body() movie: Partial<Movie>) {
    return this.moviesService.update(Number(id), movie);
  }

  @Delete(':id')
  @Permissions('DELETE')
  @ApiOperation({ summary: 'Delete a movie' })
  async deleteMovie(@Param('id') id: string) {
    return this.moviesService.delete(Number(id));
  }
}
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MoviesModule } from './movies/movies.module';

@Module({
  imports: [
    AuthModule,
    MoviesModule,
  ],
})
export class AppModule {}
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieController } from './movie.controller';
import { MovieCommentSchema, MovieSchema } from './movie.schema';
import { MovieService } from './movie.service';
import { MOVIE_COMMENT_SCHEMA, MOVIE_SCHEMA } from './movie.type';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      {
        name: MOVIE_SCHEMA,
        schema: MovieSchema,
      },
      {
        name: MOVIE_COMMENT_SCHEMA,
        schema: MovieCommentSchema,
      },
    ]),
  ],
  controllers: [MovieController],
  providers: [MovieService],
})
export class MovieModule {}

import { Module, HttpModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieCommentSchema, MovieSchema } from './movie.schema';
import { MOVIE_COMMENT_SCHEMA, MOVIE_SCHEMA } from './movie.type';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';

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

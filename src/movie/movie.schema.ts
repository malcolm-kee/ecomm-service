import { Schema } from 'mongoose';
import { Movie, MovieComment, MOVIE_SCHEMA } from './movie.type';

export const MovieSchema = new Schema<Movie>(
  {
    adult: Boolean,
    originalTitle: String,
    overview: String,
    releaseDate: String,
    title: String,
    posterUrl: String,
    backdropUrl: String,
  },
  {
    timestamps: true,
  }
);

export const MovieCommentSchema = new Schema<MovieComment>(
  {
    movie: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: MOVIE_SCHEMA,
    },
    userId: { type: String, required: true },
    userName: String,
    content: String,
    rating: Number,
  },
  {
    timestamps: true,
  }
);

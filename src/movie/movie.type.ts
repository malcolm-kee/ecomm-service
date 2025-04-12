import type { Document, Types } from 'mongoose';

export interface MovieBase {
  adult: boolean;
  overview: string;
  title: string;
}

export interface ApiMovie extends MovieBase {
  id: number;
  original_title: string;
  release_date: string;
  poster_path: string;
  backdrop_path: string;
}

export interface Movie extends MovieBase {
  originalTitle: string;
  releaseDate: string;
  posterUrl: string;
  thumbnailUrl: string;
  backdropUrl: string;
}

export interface MovieComment {
  movie: Types.ObjectId;
  userName: string;
  userId: string;
  content: string;
  rating: number;
}

export type MovieDocument = Movie & Document<string, unknown, Movie>;

export type MovieCommentDocument = MovieComment &
  Document<string, unknown, MovieComment>;

export const MOVIE_SCHEMA = 'Movie';

export const MOVIE_COMMENT_SCHEMA = 'MovieComment';

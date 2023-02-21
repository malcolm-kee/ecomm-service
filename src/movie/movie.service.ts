import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { zip } from 'rxjs';
import { map } from 'rxjs/operators';
import { CreateMovieCommentDto } from './movie.dto';
import {
  ApiMovie,
  Movie,
  MovieCommentDocument,
  MovieDocument,
  MOVIE_COMMENT_SCHEMA,
  MOVIE_SCHEMA,
} from './movie.type';

@Injectable()
export class MovieService {
  private hasData: undefined | boolean;

  constructor(
    @InjectModel(MOVIE_SCHEMA) private movieModel: Model<MovieDocument>,
    @InjectModel(MOVIE_COMMENT_SCHEMA)
    private movieCommentModel: Model<MovieCommentDocument>,
    private http: HttpService
  ) {}

  async getMovies({
    before,
    page = 1,
    limit = 10,
  }: {
    page?: number;
    before?: string;
    limit?: number | string;
  } = {}) {
    if (typeof this.hasData === 'undefined') {
      const doc = await this.movieModel.findOne().exec();
      if (doc) {
        this.hasData = true;
      } else {
        this.hasData = false;
      }
    }

    if (!this.hasData) {
      const movies = await zip(this.getConfig(), this.collectMovies())
        .pipe(
          map(([{ images }, movies]) => {
            const imageBaseUrl = `${images.secure_base_url}${
              images.poster_sizes[images.poster_sizes.length - 2]
            }`;
            const thumbnailBaseUrl = `${images.secure_base_url}${images.poster_sizes[0]}`;

            return movies.map(
              (movie): Movie => ({
                adult: movie.adult,
                overview: movie.overview,
                title: movie.title,
                originalTitle: movie.original_title,
                releaseDate: movie.release_date,
                posterUrl: `${imageBaseUrl}${movie.poster_path}`,
                thumbnailUrl: `${thumbnailBaseUrl}${movie.poster_path}`,
                backdropUrl: `${imageBaseUrl}${movie.backdrop_path}`,
              })
            );
          })
        )
        .toPromise();

      await this.movieModel.create(...movies);
    }

    const limitValue = Number(limit);

    return this.movieModel
      .find(
        before
          ? {
              createdAt: {
                $lt: before,
              },
            }
          : {},
        {},
        {
          sort: {
            createdAt: -1,
          },
          skip: limitValue * Math.max(page - 1, 0),
          limit: limitValue,
        }
      )
      .exec();
  }

  getOne(id: string) {
    return this.movieModel.findById(id).exec();
  }

  getCommentsForMovies(movieId: string) {
    return this.movieCommentModel
      .find(
        {
          movie: movieId,
        },
        {},
        {
          sort: {
            createdAt: -1,
          },
        }
      )
      .exec();
  }

  createMovieComment(
    data: CreateMovieCommentDto,
    user: { id: string; name: string }
  ) {
    return this.movieCommentModel.create({
      ...data,
      movie: data.movieId,
      userId: user.id,
      userName: user.name,
    });
  }

  deleteMovieComment(commentId: string, userId: string) {
    return this.movieCommentModel
      .findOneAndRemove({
        _id: commentId,
        userId,
      })
      .exec();
  }

  private collectMovies() {
    return zip(
      this.getMoviesFromApi(1),
      this.getMoviesFromApi(2),
      this.getMoviesFromApi(3)
    ).pipe(
      map(([one, two, three]) => one.results.concat(two.results, three.results))
    );
  }

  private getMoviesFromApi(page: number) {
    return this.http
      .get<{
        page: number;
        total_results: number;
        total_pages: 500;
        results: ApiMovie[];
      }>(`${baseUrl}/discover/movie`, {
        params: {
          sort_by: 'popularity.desc',
          api_key: apiKey,
          page,
        },
      })
      .pipe(map((res) => res.data));
  }

  private getConfig() {
    return this.http
      .get<Configuration>(`${baseUrl}/configuration`, {
        params: {
          api_key: apiKey,
        },
      })
      .pipe(map((res) => res.data));
  }
}

const apiKey = 'a460784a8c5d04c46594768a48309ba0';

const baseUrl = 'https://api.themoviedb.org/3';

export type ImageConfiguration = {
  base_url: string;
  secure_base_url: string;
  backdrop_sizes: string[];
  logo_sizes: string[];
  poster_sizes: string[];
  profile_sizes: string[];
  still_sizes: string[];
};

export type Configuration = {
  images: ImageConfiguration;
  change_keys: string[];
};

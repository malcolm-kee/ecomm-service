import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNumber, IsString, Max, Min } from 'class-validator';

import { Movie } from './movie.type';

export class MovieDto implements Movie {
  @ApiProperty({
    example: 'The Last Mercenary',
  })
  title: string;

  @ApiProperty({
    description: 'Original title',
    example: 'Le Dernier Mercenaire',
  })
  originalTitle: string;

  @ApiProperty({
    example: '2021-07-30',
  })
  releaseDate: string;
  posterUrl: string;
  thumbnailUrl: string;
  backdropUrl: string;
  adult: boolean;

  @ApiProperty({
    description: 'Overview',
    example: 'A movie about a mercenary',
  })
  overview: string;
}

export class CreateMovieCommentDto {
  @IsMongoId()
  movieId: string;

  @IsString()
  content: string;

  @ApiProperty({
    description: 'Rating',
    minimum: 1,
    maximum: 5,
  })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;
}

export class MovieCommentDto extends CreateMovieCommentDto {
  userId: string;
  userName: string;
}

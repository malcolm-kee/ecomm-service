import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { User } from '../auth';
import {
  ApiPaginatedResponse,
  Pagination,
} from '../shared/pagination.decorator';
import { PaginatedDto } from '../shared/pagination.dto';
import { WithGuard } from '../shared/with-guard.decorator';
import { CreateMovieCommentDto, MovieCommentDto, MovieDto } from './movie.dto';
import { MovieService } from './movie.service';

@ApiTags('movie')
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @ApiOperation({
    summary: 'Get list of movies',
    operationId: 'getMovies',
  })
  @ApiOkResponse({
    type: MovieDto,
    isArray: true,
  })
  @Pagination()
  @Get()
  getMovies(
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ): Promise<Array<MovieDto>> {
    return this.movieService.getMovies({
      page,
      limit,
    });
  }

  @ApiOperation({
    summary: 'List movies with pagination',
    operationId: 'listMovies',
  })
  @Pagination()
  @ApiQuery({
    name: 'search',
    required: false,
    type: 'string',
    description: 'Search for movies by title or description',
  })
  @ApiPaginatedResponse(MovieDto)
  @Get('list')
  listMovies(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string
  ): Promise<PaginatedDto<MovieDto>> {
    const searchTerm = search?.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchRegex = new RegExp(searchTerm, 'i');

    return this.movieService.getMoviesPaginated({
      page,
      limit,
      query: searchTerm
        ? {
            $or: [
              { title: { $regex: searchRegex } },
              { originalTitle: { $regex: searchRegex } },
              { overview: { $regex: searchRegex } },
            ],
          }
        : undefined,
    });
  }

  @ApiOperation({
    summary: 'Get one movie',
    operationId: 'getMovie',
  })
  @ApiOkResponse({
    type: MovieDto,
  })
  @Get('movie/:movieId')
  getOneMovie(@Param('movieId') movieId: string) {
    return this.movieService.getOne(movieId);
  }

  @ApiOperation({
    summary: 'Get comments for a movie',
    operationId: 'listMovieComments',
  })
  @ApiOkResponse({
    type: MovieCommentDto,
    isArray: true,
  })
  @Get('movie/:movieId/comment')
  getMovieComments(@Param('movieId') movieId: string) {
    return this.movieService.getCommentsForMovies(movieId);
  }

  @ApiOperation({
    summary: 'Create comment for movie',
    operationId: 'createMovieComment',
  })
  @ApiResponse({
    status: 201,
    type: MovieCommentDto,
  })
  @WithGuard()
  @Post('comment')
  createComment(
    @Body() body: CreateMovieCommentDto,
    @User('userId') userId: string,
    @User('name') userName: string
  ) {
    return this.movieService.createMovieComment(body, {
      id: userId,
      name: userName,
    });
  }

  @ApiOperation({
    summary: 'Delete comment for movie',
    operationId: 'deleteMovieComment',
    description:
      'Note that you must be the owner of the comment (userId) to perform this action.',
  })
  @ApiOkResponse({
    type: MovieCommentDto,
  })
  @WithGuard()
  @Delete('comment/:id')
  async deleteComment(@Param('id') id: string, @User('userId') userId: string) {
    const removedComment = await this.movieService.deleteMovieComment(
      id,
      userId
    );
    if (!removedComment) {
      throw new UnauthorizedException();
    }
    return removedComment;
  }
}

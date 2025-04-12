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
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { User } from '../auth';
import { Pagination } from '../shared/pagination.decorator';
import { WithGuard } from '../shared/with-guard.decorator';
import { CreateMovieCommentDto, MovieCommentDto, MovieDto } from './movie.dto';
import { MovieService } from './movie.service';

@ApiTags('movie')
@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @ApiOperation({
    summary: 'Get list of movies',
    operationId: 'listMovies',
  })
  @ApiOkResponse({
    type: MovieDto,
    isArray: true,
  })
  @Pagination()
  @Get()
  getMovies(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.movieService.getMovies({
      page,
      limit,
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

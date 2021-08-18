import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard, User } from 'auth';
import { Pagination } from '../shared/pagination.decorator';
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
  @ApiResponse({
    status: 200,
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
  @ApiResponse({
    status: 200,
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
  @ApiResponse({
    status: 200,
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
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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
  @ApiResponse({
    status: 200,
    type: MovieCommentDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
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

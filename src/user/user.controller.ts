import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import {
  ApiPaginatedResponse,
  Pagination,
} from '../shared/pagination.decorator';
import { PaginatedDto } from '../shared/pagination.dto';
import { WithGuard } from '../shared/with-guard.decorator';
import { CreateUserDto, UpdateUserDto, UserDto } from './user.dto';
import { UserService } from './user.service';

@ApiTags('user')
@WithGuard()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'List users',
    operationId: 'listUsers',
  })
  @Pagination()
  @ApiPaginatedResponse(UserDto)
  @Get()
  listUsers(
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ): Promise<PaginatedDto<UserDto>> {
    return this.userService.getManyPaginated({
      page,
      limit,
    });
  }

  @ApiOperation({
    summary: 'Get details of one user',
    operationId: 'getUser',
  })
  @ApiOkResponse({
    type: UserDto,
  })
  @Get(':id')
  getUser(@Param('id') id: string): Promise<UserDto> {
    return this.userService.getOne(id);
  }

  @ApiOperation({
    summary: 'Create a user',
    operationId: 'createUser',
  })
  @ApiOkResponse({
    type: UserDto,
  })
  @Post()
  createUser(@Body() body: CreateUserDto): Promise<UserDto> {
    return this.userService.create(body);
  }

  @ApiOperation({
    summary: 'Update a user',
    operationId: 'updateUser',
  })
  @ApiOkResponse({
    type: UserDto,
  })
  @Patch(':id')
  updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto
  ): Promise<UserDto> {
    return this.userService.updateOne(id, body);
  }

  @ApiOperation({
    summary: 'Delete a user',
    operationId: 'deleteUser',
  })
  @ApiOkResponse({
    type: UserDto,
  })
  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteOne(id);
  }
}

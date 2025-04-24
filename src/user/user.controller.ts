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
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import {
  ApiPaginatedResponse,
  Pagination,
} from '../shared/pagination.decorator';
import { PaginatedDto } from '../shared/pagination.dto';
import { WithGuard } from '../shared/with-guard.decorator';
import { WithValidation } from '../shared/with-validation.decorator';
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
  @ApiQuery({
    name: 'search',
    required: false,
    type: 'string',
    description: 'Search for users by name or email',
  })
  @ApiPaginatedResponse(UserDto)
  @Get()
  listUsers(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('search') search?: string
  ): Promise<PaginatedDto<UserDto>> {
    const searchTerm = search?.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchRegex = new RegExp(searchTerm, 'i');

    return this.userService.getManyPaginated({
      page,
      limit,
      query: searchTerm
        ? {
            $or: [
              { name: { $regex: searchRegex } },
              { email: { $regex: searchRegex } },
            ],
          }
        : undefined,
    });
  }

  @ApiOperation({
    summary: 'Get details of one user',
    operationId: 'getUser',
  })
  @Get(':id')
  getUser(@Param('id') id: string): Promise<UserDto> {
    return this.userService.getOne(id);
  }

  @ApiOperation({
    summary: 'Create a user',
    operationId: 'createUser',
  })
  @WithValidation()
  @Post()
  createUser(@Body() body: CreateUserDto): Promise<UserDto> {
    return this.userService.create(body);
  }

  @ApiOperation({
    summary: 'Update a user',
    operationId: 'updateUser',
  })
  @WithValidation()
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
  @Delete(':id')
  deleteUser(@Param('id') id: string): Promise<UserDto> {
    return this.userService.deleteOne(id);
  }
}

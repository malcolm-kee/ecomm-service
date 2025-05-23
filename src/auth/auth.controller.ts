import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConflictResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Request as ExpressRequest } from 'express';

import { WithGuard } from '../shared/with-guard.decorator';
import { UserData } from '../user/user.type';
import {
  LoginDto,
  LoginResponse,
  RegisterDto,
  RegisterResponse,
  UserProfile,
} from './auth.dto';
import { AuthService } from './auth.service';
import { AuthenticatedRequest } from './jwt.type';
import { LocalAuthGuard } from './local.auth.guard';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @ApiOperation({
    summary: 'Create an account',
    operationId: 'register',
  })
  @ApiResponse({
    status: 201,
    type: RegisterResponse,
  })
  @ApiConflictResponse({
    description: 'Email already used',
  })
  @Post('register')
  register(@Body() body: RegisterDto) {
    return this.service.createUser(body);
  }

  @ApiOperation({
    summary: 'Login your account',
    operationId: 'login',
  })
  @ApiBody({
    type: LoginDto,
  })
  @ApiOkResponse({
    type: LoginResponse,
    description: 'Login success',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  login(@Request() req: LoginRequest) {
    return this.service.login(req.user);
  }

  @ApiOperation({
    summary: 'Get logged-in user profile',
    operationId: 'getProfile',
  })
  @ApiOkResponse({
    type: UserProfile,
  })
  @WithGuard()
  @Get('whoami')
  getProfile(@Request() req: AuthenticatedRequest) {
    return req.user;
  }
}

type LoginRequest = ExpressRequest & {
  user: UserData & { _id: string };
};

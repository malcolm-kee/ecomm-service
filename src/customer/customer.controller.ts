import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  HttpCode,
  Get,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiTags,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  AuthService,
  LocalAuthGuard,
  AuthenticatedRequest,
  JwtAuthGuard,
} from '../auth';
import {
  RegisterDto,
  LoginDto,
  LoginResponse,
  UserProfile,
} from './customer.dto';

@ApiTags('customer')
@Controller()
export class CustomerController {
  constructor(private readonly service: AuthService) {}

  @ApiOperation({
    summary: 'Create an account',
    operationId: 'register',
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
  @ApiResponse({
    status: 200,
    type: LoginResponse,
    description: 'Login success',
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  login(@Request() req) {
    return this.service.login(req.user);
  }

  @ApiOperation({
    summary: 'Get logged-in user profile',
    operationId: 'getProfile',
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    type: UserProfile,
  })
  @UseGuards(JwtAuthGuard)
  @Get('whoami')
  getProfile(@Request() req: AuthenticatedRequest) {
    return req.user;
  }
}

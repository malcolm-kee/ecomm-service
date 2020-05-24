import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { JwtPayload } from '../auth';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Malcolm Kee',
  })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'malcolm@gmail.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({
    example: '12345678',
  })
  password: string;

  @IsString()
  @ApiProperty({
    example: 'http://github.com/malcolm-kee.png',
  })
  avatar: string;
}

export class LoginDto {
  @ApiProperty({
    description: 'Email used during registration',
    example: 'malcolm@gmail.com',
  })
  username: string;

  @ApiProperty({
    example: '12345678',
  })
  password: string;
}

export class LoginResponse {
  access_token: string;
}

export class UserProfile implements JwtPayload {
  userId: string;
  name: string;
  email: string;
}

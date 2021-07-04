import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUrl,
  MinLength,
  ValidateIf,
} from 'class-validator';
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

  @ApiProperty({
    example: 'http://github.com/malcolm-kee.png',
  })
  @IsString()
  @ValidateIf((dto) => dto.avatar !== '')
  @IsUrl()
  avatar: string;
}

export class LoginDto {
  @ApiProperty({
    description: 'Email used during registration',
    example: 'malcolm@gmail.com',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: '12345678',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginResponse {
  access_token: string;
}

export class UserProfile implements JwtPayload {
  userId: string;
  name: string;
  email: string;
  avatar: string;
}

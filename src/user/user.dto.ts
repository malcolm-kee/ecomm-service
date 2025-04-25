import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

import { UserData } from './user.type';

export class UserDto implements Omit<UserData, 'password'> {
  @ApiProperty()
  _id: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'Harry Potter',
  })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The email of the user. Must be unique.',
    example: 'test@test.com',
  })
  email: string;

  @IsString()
  @IsUrl({
    require_tld: false, // allow localhost for testing
  })
  @ApiProperty({
    example: 'https://github.com/malcolm-kee.png',
  })
  avatar: string;
}

export class CreateUserDto
  extends OmitType(UserDto, ['_id'])
  implements Omit<UserData, '_id'>
{
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({
    example: '12345678',
  })
  password: string;
}

export class UpdateUserDto extends PartialType(UserDto) {}

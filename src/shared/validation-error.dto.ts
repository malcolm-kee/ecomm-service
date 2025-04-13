import { ValidationError } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ValidationErrorMessageDto
  implements Pick<ValidationError, 'property' | 'constraints' | 'children'>
{
  @ApiProperty({
    description: `Object's property that hasn't passed validation`,
    example: 'password',
  })
  property: string;

  @ApiProperty({
    type: 'object',
    additionalProperties: {
      type: 'string',
    },
    example: {
      isNotEmpty: 'password must not be empty',
      minLength: 'password must be at least 8 characters long',
    },
    description: 'Constraints that failed validation with error messages',
  })
  constraints?: { [type: string]: string };

  @ApiProperty({
    isArray: true,
    type: () => ValidationErrorMessageDto,
    description: 'Contains all nested validation errors of the property',
    example: [
      {
        property: 'name',
        constraints: {
          isNotEmpty: 'name must not be empty',
        },
        children: [],
      },
    ],
  })
  children?: ValidationErrorMessageDto[];
}

export class ValidationErrorDto {
  @ApiProperty({
    example: 'Bad Request',
  })
  error: string;

  @ApiProperty({
    isArray: true,
    type: ValidationErrorMessageDto,
  })
  message: Array<ValidationErrorMessageDto>;

  @ApiProperty({
    example: 400,
  })
  statusCode: number;
}

import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse } from '@nestjs/swagger';

import { ValidationErrorDto } from './validation-error.dto';

export function WithValidation() {
  return applyDecorators(
    ApiBadRequestResponse({
      type: ValidationErrorDto,
    })
  );
}

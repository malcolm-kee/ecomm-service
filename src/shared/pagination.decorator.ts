import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function Pagination() {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      type: 'number',
      required: false,
    }),
    ApiQuery({
      name: 'limit',
      type: 'number',
      required: false,
    })
  );
}

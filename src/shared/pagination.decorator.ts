import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiQuery,
  getSchemaPath,
} from '@nestjs/swagger';
import { PaginatedDto } from './pagination.dto';

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

export function ApiPaginatedResponse<Model extends Type<any>>(model: Model) {
  return applyDecorators(
    ApiExtraModels(PaginatedDto, model),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginatedDto) },
          {
            properties: {
              docs: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    })
  );
}

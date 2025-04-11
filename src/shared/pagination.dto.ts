import { ApiProperty } from '@nestjs/swagger';

export class PaginatedDto<Record> {
  // Although according to the docs: https://docs.nestjs.com/openapi/operations#advanced-generic-apiresponse,
  // this is not needed. But somehow it would causes a circular dependency error.
  // This workaround is from https://github.com/nestjs/swagger/issues/669#issuecomment-1945245130
  @ApiProperty({
    type: 'object',
    properties: {},
    isArray: true,
  })
  docs: Array<Record>;

  @ApiProperty()
  totalDocs: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  page?: number;

  @ApiProperty()
  hasPrevPage: boolean;

  @ApiProperty()
  hasNextPage: boolean;

  @ApiProperty()
  prevPage?: number | null;

  @ApiProperty()
  nextPage?: number | null;
}

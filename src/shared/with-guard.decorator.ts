import { UseGuards, applyDecorators } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { JwtAuthGuard } from './jwt-auth.guard';

export function WithGuard() {
  return applyDecorators(UseGuards(JwtAuthGuard), ApiBearerAuth());
}

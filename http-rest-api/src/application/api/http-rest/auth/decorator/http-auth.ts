import { applyDecorators, UseGuards } from '@nestjs/common';
import { HttpJwtAuthGuard } from '@application/api/http-rest/auth/guard/http-jwt-auth-guard';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const HttpAuth = (): ((...args: any) => void) => {
  return applyDecorators(UseGuards(HttpJwtAuthGuard));
};

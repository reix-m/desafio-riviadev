import { CoreApiResponse } from '@core/common/api/core-api-response';
import { Code } from '@core/common/code/code';
import { Exception } from '@core/common/exception/exception';
import { ApiServerConfig } from '@infrastructure/config/api-server-config';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class NestHttpExceptionFilter implements ExceptionFilter {
  public catch(error: Error, host: ArgumentsHost): void {
    const request: Request = host.switchToHttp().getRequest();
    const response: Response = host.switchToHttp().getResponse<Response>();

    let errorResponse: CoreApiResponse<unknown> = CoreApiResponse.error(Code.INTERNAL_ERROR.code, error.message);
    let statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR;

    errorResponse = this.handleNestError(error, errorResponse);
    errorResponse = this.handleCoreException(error, errorResponse);
    statusCode = this.handleHttpErrorStatusCode(error, statusCode);

    if (ApiServerConfig.LogEnable) {
      const message: Record<string, unknown> = {
        message: errorResponse.message,
        code: errorResponse.code,
        content: {
          method: request.method,
          hostname: request.hostname,
          originalUrl: request.originalUrl,
          route: request.baseUrl,
          query: request.query,
          params: request.params,
          body: request.body,
        },
      };
      Logger.error(message, error?.stack);
    }

    response.status(statusCode).json(errorResponse);
  }

  private handleNestError(error: Error, errorResponse: CoreApiResponse<unknown>): CoreApiResponse<unknown> {
    if (error instanceof HttpException) {
      errorResponse = CoreApiResponse.error(error.getStatus(), error.message, null);
    }
    if (error instanceof UnauthorizedException) {
      errorResponse = CoreApiResponse.error(Code.UNAUTHORIZED_ERROR.code, Code.UNAUTHORIZED_ERROR.message, null);
    }
    return errorResponse;
  }

  private handleCoreException(error: Error, errorResponse: CoreApiResponse<unknown>): CoreApiResponse<unknown> {
    if (error instanceof Exception) {
      errorResponse = CoreApiResponse.error(error.code, error.message, error.data);
    }

    return errorResponse;
  }

  private handleHttpErrorStatusCode(error: Error, statusCode: number): number {
    if (error instanceof HttpException) {
      statusCode = error.getStatus();
    }

    if (error instanceof Exception) {
      switch (error.code) {
        case Code.UNAUTHORIZED_ERROR.code:
          statusCode = HttpStatus.UNAUTHORIZED;
          break;
        default:
          statusCode = HttpStatus.BAD_REQUEST;
          break;
      }
    }

    return statusCode;
  }
}

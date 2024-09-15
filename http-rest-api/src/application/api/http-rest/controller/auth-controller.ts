import { HttpLocalAuthGuard } from '@application/api/http-rest/auth/guard/http-local-auth-guard';
import { HttpAuthService } from '@application/api/http-rest/auth/http-auth-service';
import { HttpRequestWithUser, HttpSignedUser } from '@application/api/http-rest/auth/type/http-auth-types';
import { HttpRestApiModelSignInBody } from '@application/api/http-rest/controller/documentation/auth/http-rest-api-model-sign-in-body';
import { HttpRestApiResponseSignedUser } from '@application/api/http-rest/controller/documentation/auth/http-rest-api-response-signed-user';
import { CoreApiResponse } from '@core/common/api/core-api-response';
import { Code } from '@core/common/code/code';
import { Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: HttpAuthService) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @UseGuards(HttpLocalAuthGuard)
  @ApiBody({ type: HttpRestApiModelSignInBody })
  @ApiResponse({ status: HttpStatus.OK, type: HttpRestApiResponseSignedUser })
  public async signIn(@Req() request: HttpRequestWithUser): Promise<CoreApiResponse<HttpSignedUser>> {
    return CoreApiResponse.success(Code.SUCCESS.code, this.authService.signIn(request.user));
  }
}

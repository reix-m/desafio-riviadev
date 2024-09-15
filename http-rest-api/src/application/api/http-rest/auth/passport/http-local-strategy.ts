import { HttpAuthService } from '@application/api/http-rest/auth/http-auth-service';
import { HttpUserPayload } from '@application/api/http-rest/auth/type/http-auth-types';
import { Code } from '@core/common/code/code';
import { Exception } from '@core/common/exception/exception';
import { CoreAssert } from '@core/common/util/assert/core-assert';
import { ApiServerConfig } from '@infrastructure/config/api-server-config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

@Injectable()
export class HttpLocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: HttpAuthService) {
    super({
      usernameField: ApiServerConfig.SignInUsernameField,
      passwordField: ApiServerConfig.SignInPasswordField,
    });
  }

  public async validate(username: string, password: string): Promise<HttpUserPayload> {
    const user: HttpUserPayload = CoreAssert.notEmpty(
      await this.authService.validateUser(username, password),
      Exception.new({ code: Code.UNAUTHORIZED_ERROR })
    );

    return user;
  }
}

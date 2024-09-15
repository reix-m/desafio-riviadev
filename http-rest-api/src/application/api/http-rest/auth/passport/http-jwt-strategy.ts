import { HttpAuthService } from '@application/api/http-rest/auth/http-auth-service';
import { HttpJwtPayload, HttpUserPayload } from '@application/api/http-rest/auth/type/http-auth-types';
import { Code } from '@core/common/code/code';
import { Exception } from '@core/common/exception/exception';
import { CoreAssert } from '@core/common/util/assert/core-assert';
import { User } from '@core/domain/user/entity/user';
import { ApiServerConfig } from '@infrastructure/config/api-server-config';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class HttpJwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: HttpAuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromHeader(ApiServerConfig.AccessTokenHeader),
      ignoreExpiration: false,
      secretOrKey: ApiServerConfig.AccessTokenSecret,
    });
  }

  public async validate(payload: HttpJwtPayload): Promise<HttpUserPayload> {
    const user: User = CoreAssert.notEmpty(
      await this.authService.getUser({ id: payload.id }),
      Exception.new({ code: Code.UNAUTHORIZED_ERROR })
    );

    return { id: user.getId(), email: user.getEmail() };
  }
}

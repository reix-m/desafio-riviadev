import { HttpJwtPayload, HttpSignedUser, HttpUserPayload } from '@application/api/http-rest/auth/type/http-auth-types';
import { Nullable } from '@core/common/type/common-types';
import { UserDITokens } from '@core/domain/user/di/user-di-tokens';
import { User } from '@core/domain/user/entity/user';
import { UserRepositoryPort } from '@core/domain/user/port/persistence/user-repository-port';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class HttpAuthService {
  constructor(
    @Inject(UserDITokens.UserRepository) private readonly userRepository: UserRepositoryPort,
    private readonly jwtService: JwtService
  ) {}

  public async validateUser(username: string, password: string): Promise<Nullable<HttpUserPayload>> {
    const user: Nullable<User> = await this.userRepository.findUser({ email: username });

    if (!user) {
      return null;
    }

    const isPasswordIsValid: boolean = user.getPassword().compare(password);

    if (!isPasswordIsValid) {
      return null;
    }

    return {
      id: user.getId(),
      email: user.getEmail(),
    };
  }

  public signIn(user: HttpUserPayload): HttpSignedUser {
    const payload: HttpJwtPayload = { id: user.id };
    return {
      id: user.id,
      accessToken: this.jwtService.sign(payload),
    };
  }

  public async getUser(by: { id: string }): Promise<Nullable<User>> {
    return this.userRepository.findUser(by);
  }
}

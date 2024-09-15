import { HttpAuthService } from '@application/api/http-rest/auth/http-auth-service';
import { HttpJwtStrategy } from '@application/api/http-rest/auth/passport/http-jwt-strategy';
import { HttpLocalStrategy } from '@application/api/http-rest/auth/passport/http-local-strategy';
import { AuthController } from '@application/api/http-rest/controller/auth-controller';
import { UserModule } from '@application/di/user-module';
import { ApiServerConfig } from '@infrastructure/config/api-server-config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  controllers: [AuthController],
  imports: [
    PassportModule,
    JwtModule.register({
      secret: ApiServerConfig.AccessTokenSecret,
      signOptions: { expiresIn: `${ApiServerConfig.AccessTokenTTLInMinutes}m` },
    }),
    UserModule,
  ],
  providers: [HttpAuthService, HttpLocalStrategy, HttpJwtStrategy],
})
export class AuthModule {}

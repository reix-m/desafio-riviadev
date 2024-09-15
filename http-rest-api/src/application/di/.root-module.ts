import { AuthModule } from '@application/di/auth-module';
import { InfrastructureModule } from '@application/di/infrastructure-module';
import { MediaModule } from '@application/di/media-module';
import { UserModule } from '@application/di/user-module';
import { Module } from '@nestjs/common';

@Module({
  imports: [InfrastructureModule, UserModule, AuthModule, MediaModule],
})
export class RootModule {}

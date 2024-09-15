import { AuthModule } from '@application/di/auth-module';
import { InfrastructureModule } from '@application/di/infrastructure-module';
import { UserModule } from '@application/di/user-module';
import { Module } from '@nestjs/common';

@Module({
  imports: [InfrastructureModule, UserModule, AuthModule],
})
export class RootModule {}

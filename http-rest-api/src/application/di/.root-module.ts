import { InfrastructureModule } from '@application/di/infrastructure-module';
import { UserModule } from '@application/di/user-module';
import { Module } from '@nestjs/common';

@Module({
  imports: [InfrastructureModule, UserModule],
})
export class RootModule {}

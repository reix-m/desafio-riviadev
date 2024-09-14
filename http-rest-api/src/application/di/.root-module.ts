import { Module } from '@nestjs/common';
import { InfrastructureModule } from '@application/di/infrastructure-module';

@Module({
  imports: [InfrastructureModule],
})
export class RootModule {}

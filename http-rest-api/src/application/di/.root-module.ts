import { AuthModule } from '@application/di/auth-module';
import { InfrastructureModule } from '@application/di/infrastructure-module';
import { MediaModule } from '@application/di/media-module';
import { UserModule } from '@application/di/user-module';
import { Module } from '@nestjs/common';
import { ProductModule } from '@application/di/product-module';

@Module({
  imports: [InfrastructureModule, UserModule, AuthModule, MediaModule, ProductModule],
})
export class RootModule {}

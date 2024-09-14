import { RootModule } from '@application/di/.root-module';
import { ApiServerConfig } from '@infrastructure/config/api-server-config';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { initializeTransactionalContext, StorageDriver } from 'typeorm-transactional';

export class ServerApplication {
  private readonly host: string = ApiServerConfig.Host;

  private readonly port: number = ApiServerConfig.Port;

  public async run(): Promise<void> {
    this.startTransactionalContext();

    const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(RootModule);

    this.log();

    await app.listen(this.port, this.host);
  }
  private startTransactionalContext(): void {
    initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });
  }

  private log(): void {
    Logger.log(`Server started on host: ${this.host}; port: ${this.port};`, ServerApplication.name);
  }

  public static new(): ServerApplication {
    return new ServerApplication();
  }
}

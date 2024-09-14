import { RootModule } from '@application/di/.root-module';
import { ApiServerConfig } from '@infrastructure/config/api-server-config';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { initializeTransactionalContext, StorageDriver } from 'typeorm-transactional';
import * as packageJson from '../../package.json';

export class ServerApplication {
  private readonly host: string = ApiServerConfig.Host;

  private readonly port: number = ApiServerConfig.Port;

  public async run(): Promise<void> {
    this.startTransactionalContext();

    const app: NestExpressApplication = await NestFactory.create<NestExpressApplication>(RootModule);

    this.buildAPIDocumentation(app);
    this.log();

    await app.listen(this.port, this.host);
  }

  private startTransactionalContext(): void {
    initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });
  }

  private buildAPIDocumentation(app: NestExpressApplication): void {
    const title: string = 'Riviadev Http Rest API';
    const description: string = 'Riviadev Http Rest API documentation';
    const version: string = packageJson.version;

    const options: Omit<OpenAPIObject, 'paths'> = new DocumentBuilder()
      .setTitle(title)
      .setDescription(description)
      .setVersion(version)
      .addBearerAuth({ type: 'apiKey', in: 'header', name: ApiServerConfig.AccessTokenHeader })
      .build();

    const document: OpenAPIObject = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('docs', app, document, { jsonDocumentUrl: '/docs/format.json' });
  }

  private log(): void {
    Logger.log(`Server started on host: ${this.host}; port: ${this.port};`, ServerApplication.name);
  }

  public static new(): ServerApplication {
    return new ServerApplication();
  }
}

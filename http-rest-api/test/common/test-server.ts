import { NestExpressApplication } from '@nestjs/platform-express';
import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { RootModule } from '@application/di/.root-module';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { getDataSourceToken } from '@nestjs/typeorm';

export class TestServer {
  constructor(
    public readonly serverApplication: NestExpressApplication,
    public readonly dbConnection: DataSource,
    public readonly testingModule: TestingModule
  ) {}

  public static async new(): Promise<TestServer> {
    initializeTransactionalContext();

    const testingModule: TestingModule = await Test.createTestingModule({ imports: [RootModule] }).compile();

    const dbConnection: DataSource = testingModule.get(getDataSourceToken());

    const serverApplication: NestExpressApplication = testingModule.createNestApplication();

    return new TestServer(serverApplication, dbConnection, testingModule);
  }
}

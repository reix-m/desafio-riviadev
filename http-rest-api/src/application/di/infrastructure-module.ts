import { NestHttpExceptionFilter } from '@application/api/http-rest/exception-filter/nest-http-exception-filter';
import { NestHttpLogginInterceptor } from '@application/api/http-rest/interceptor/nest-http-loggin-interceptor';
import { CoreDITokens } from '@core/common/di/core-di-tokens';
import { NestCommandBusAdapter } from '@infrastructure/adapter/message/nest-command-bus-adapter';
import { NestEventBusAdapter } from '@infrastructure/adapter/message/nest-event-bus-adapter';
import { NestQueryBusAdapter } from '@infrastructure/adapter/message/nest-query-bus-adapter';
import { TypeOrmDirectory } from '@infrastructure/adapter/persistence/typeorm/typeorm-directory';
import { ApiServerConfig } from '@infrastructure/config/api-server-config';
import { DatabaseConfig } from '@infrastructure/config/database-config';
import { Global, Module, Provider } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

const providers: Provider[] = [
  {
    provide: APP_FILTER,
    useClass: NestHttpExceptionFilter,
  },
  {
    provide: CoreDITokens.CommandBus,
    useClass: NestCommandBusAdapter,
  },
  {
    provide: CoreDITokens.QueryBus,
    useClass: NestQueryBusAdapter,
  },
  {
    provide: CoreDITokens.EventBus,
    useClass: NestEventBusAdapter,
  },
];

if (ApiServerConfig.LogEnable) {
  providers.push({
    provide: APP_INTERCEPTOR,
    useClass: NestHttpLogginInterceptor,
  });
}

@Global()
@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forRootAsync({
      useFactory() {
        return {
          name: 'default',
          type: 'postgres',
          host: DatabaseConfig.DbHost,
          port: DatabaseConfig.DbPort,
          username: DatabaseConfig.DbUsername,
          password: DatabaseConfig.DbPassword,
          database: DatabaseConfig.DbName,
          logging: DatabaseConfig.DbLogEnable ? 'all' : false,
          entities: [`${TypeOrmDirectory}/entity/**/*{.ts,.js}`],
          migrationsRun: true,
          migrations: [`${TypeOrmDirectory}/migration/**/*{.ts,.js}`],
          migrationsTransactionMode: 'all',
        };
      },
      async dataSourceFactory(options) {
        return addTransactionalDataSource(new DataSource(options as DataSourceOptions));
      },
    }),
  ],
  providers,
  exports: [CoreDITokens.CommandBus, CoreDITokens.QueryBus, CoreDITokens.EventBus],
})
export class InfrastructureModule {}

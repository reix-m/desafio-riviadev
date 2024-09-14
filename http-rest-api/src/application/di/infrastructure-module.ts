import { NestHttpExceptionFilter } from '@application/api/http-rest/exception-filter/nest-http-exception-filter';
import { NestHttpLogginInterceptor } from '@application/api/http-rest/interceptor/nest-http-loggin-interceptor';
import { TypeOrmDirectory } from '@infrastructure/adapter/persistence/typeorm/typeorm-directory';
import { ApiServerConfig } from '@infrastructure/config/api-server-config';
import { DatabaseConfig } from '@infrastructure/config/database-config';
import { Global, Module, Provider } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

const providers: Provider[] = [
  {
    provide: APP_FILTER,
    useClass: NestHttpExceptionFilter,
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
})
export class InfrastructureModule {}

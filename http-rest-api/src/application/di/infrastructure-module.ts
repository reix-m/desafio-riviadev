import { TypeOrmDirectory } from '@infrastructure/adapter/persistence/typeorm/typeorm-directory';
import { DatabaseConfig } from '@infrastructure/config/database-config';
import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

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
})
export class InfrastructureModule {}

import { UserController } from '@application/api/http-rest/controller/user-controller';
import { UserDITokens } from '@core/domain/user/di/user-di-tokens';
import { UserRepositoryPort } from '@core/domain/user/port/persistence/user-repository-port';
import { HandleGetUserPreviewQueryService } from '@core/features/user/get-user-preview-query/handle-get-user-preview-query-service';
import { SignUpService } from '@core/features/user/sign-up/sign-up-service';
import { TypeOrmUserRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/user/typeorm-user-repository-adapter';
import { NestWrapperGetUserPreviewQueryHandler } from '@infrastructure/handler/user/nest-wrapper-get-user-preview-query-handler';
import { Module, Provider } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

const persistenceProviders: Provider[] = [
  {
    provide: UserDITokens.UserRepository,
    useFactory: (dataSource: DataSource) => new TypeOrmUserRepositoryAdapter(dataSource),
    inject: [getDataSourceToken()],
  },
];

const useCaseProviders: Provider[] = [
  {
    provide: UserDITokens.SignUpUseCase,
    useFactory: (userRepository: UserRepositoryPort) => new SignUpService(userRepository),
    inject: [UserDITokens.UserRepository],
  },
];

const handlerProviders: Provider[] = [
  NestWrapperGetUserPreviewQueryHandler,
  {
    provide: UserDITokens.GetUserPreviewQueryHandler,
    useFactory: (userRepository: UserRepositoryPort) => new HandleGetUserPreviewQueryService(userRepository),
    inject: [UserDITokens.UserRepository],
  },
];

@Module({
  controllers: [UserController],
  providers: [...persistenceProviders, ...useCaseProviders, ...handlerProviders],
  exports: [UserDITokens.UserRepository],
})
export class UserModule {}

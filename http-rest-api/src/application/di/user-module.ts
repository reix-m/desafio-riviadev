import { UserDITokens } from '@core/domain/user/di/user-di-tokens';
import { UserRepositoryPort } from '@core/domain/user/port/persistence/user-repository-port';
import { SignUpService } from '@core/features/user/sign-up/sign-up-service';
import { TypeOrmUserRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/user/typeorm-user-repository-adapter';
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
    inject: [UserDITokens],
  },
];

@Module({
  providers: [...persistenceProviders, ...useCaseProviders],
  exports: [UserDITokens.UserRepository],
})
export class UserModule {}

import { UserDITokens } from '@core/domain/user/di/user-di-tokens';
import { User } from '@core/domain/user/entity/user';
import { UserRepositoryPort } from '@core/domain/user/port/persistence/user-repository-port';
import { Password } from '@core/domain/user/value-object/password';
import { TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';

export class UserFixture {
  constructor(private readonly testingModule: TestingModule) {}

  public async insertUser(payload: { email?: string; password?: string }): Promise<User> {
    const userRepository: UserRepositoryPort = this.testingModule.get(UserDITokens.UserRepository);

    const userId: string = randomUUID();
    const userFirstName: string = `${randomUUID()}_${userId}`;
    const userEmail: string = `${userFirstName}@email.com`;
    const userPassword: string = payload?.password ?? randomUUID();

    const password: Password = await Password.new(userPassword);

    const user: User = await User.new({
      id: userId,
      firstName: userFirstName,
      lastName: 'Last',
      email: payload.email ?? userEmail,
      password,
    });

    await userRepository.addUser(user);

    return user;
  }

  public static new(testingModule: TestingModule): UserFixture {
    return new UserFixture(testingModule);
  }
}

import { Code } from '@core/common/code/code';
import { Exception } from '@core/common/exception/exception';
import { CoreAssert } from '@core/common/util/assert/core-assert';
import { User } from '@core/domain/user/entity/user';
import { UserRepositoryPort } from '@core/domain/user/port/persistence/user-repository-port';
import { UserUseCaseResponseDto } from '@core/domain/user/usecase/dto/user-usecase-response-dto';
import { Password } from '@core/domain/user/value-object/password';
import { SignUpPort } from '@core/features/user/sign-up/port/sign-up-port';
import { SignUpUseCase } from '@core/features/user/sign-up/usecase/sign-up-usecase';

export class SignUpService implements SignUpUseCase {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  public async execute(payload: SignUpPort): Promise<UserUseCaseResponseDto> {
    const doesUserExist: boolean = !!(await this.userRepository.countUsers({
      email: payload.email,
    }));

    CoreAssert.isFalse(
      doesUserExist,
      Exception.new({
        code: Code.ENTITY_ALREADY_EXISTS_ERROR,
        overrideMessage: 'User already exists.',
      })
    );

    const password: Password = await Password.new(payload.password);
    const user: User = await User.new({
      firstName: payload.firstName,
      lastName: payload.lastName,
      password,
      email: payload.email,
    });

    await this.userRepository.addUser(user);

    return UserUseCaseResponseDto.newFromUser(user);
  }
}

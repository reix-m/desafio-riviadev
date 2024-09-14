import { Code } from '@core/common/code/code';
import { Exception } from '@core/common/exception/exception';
import { ClassValidationDetails } from '@core/common/util/class-validator/class-validator';
import { User } from '@core/domain/user/entity/user';
import { UserRepositoryPort } from '@core/domain/user/port/persistence/user-repository-port';
import { UserUseCaseResponseDto } from '@core/domain/user/usecase/dto/user-usecase-response-dto';
import { Password } from '@core/domain/user/value-object/password';
import { SignUpPort } from '@core/features/user/sign-up/port/sign-up-port';
import { SignUpService } from '@core/features/user/sign-up/sign-up-service';
import { SignUpUseCase } from '@core/features/user/sign-up/usecase/sign-up-usecase';
import { createMock } from '@golevelup/ts-jest';
import { randomUUID } from 'crypto';

function createSignUpPort(): SignUpPort {
  return {
    firstName: randomUUID(),
    lastName: randomUUID(),
    email: 'test@email.com',
    password: randomUUID(),
  };
}

describe('SignUpService', () => {
  const userRepository: UserRepositoryPort = createMock<UserRepositoryPort>();
  const signUpService: SignUpUseCase = new SignUpService(userRepository);

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('execute', () => {
    test('should sign up user', async () => {
      const mockUserId: string = randomUUID();

      jest.spyOn(userRepository, 'countUsers').mockResolvedValue(0);
      jest.spyOn(userRepository, 'addUser').mockResolvedValue({ id: mockUserId });

      const signUpPort: SignUpPort = createSignUpPort();

      const password: Password = await Password.new(signUpPort.password);
      const expectedUser: User = await User.new({
        id: mockUserId,
        firstName: signUpPort.firstName,
        lastName: signUpPort.lastName,
        email: signUpPort.email,
        password,
      });

      const expectedUserUseCaseDto: UserUseCaseResponseDto = UserUseCaseResponseDto.newFromUser(expectedUser);

      const resultUserUseCaseDto: UserUseCaseResponseDto = await signUpService.execute(signUpPort);

      resultUserUseCaseDto.id = expectedUserUseCaseDto.id;

      expect(resultUserUseCaseDto).toEqual(expectedUserUseCaseDto);
    });

    test('should throw exception when user already exists', async () => {
      const mockUserId: string = randomUUID();

      jest.spyOn(userRepository, 'countUsers').mockResolvedValue(1);
      jest.spyOn(userRepository, 'addUser').mockResolvedValue({ id: mockUserId });

      const signUpPort: SignUpPort = createSignUpPort();

      try {
        await signUpService.execute(signUpPort);
      } catch (e) {
        const exception: Exception<ClassValidationDetails> = e as Exception<ClassValidationDetails>;

        expect(exception).toBeInstanceOf(Exception);
        expect(exception.code).toBe(Code.ENTITY_ALREADY_EXISTS_ERROR.code);
      }
    });
  });
});

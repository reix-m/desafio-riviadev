import { CreateUserEntityPayload } from '@core/domain/user/entity/type/create-user-entity-payload';
import { User } from '@core/domain/user/entity/user';
import { UserUseCaseResponseDto } from '@core/domain/user/usecase/dto/user-usecase-response-dto';
import { Password } from '@core/domain/user/value-object/password';
import { randomUUID } from 'crypto';

describe('UserUseCaseResponseDto', () => {
  describe('newFromUser', () => {
    test('should creates UserUseCaseDto instance with required parameters', async () => {
      const user: User = await createUser();
      const userUseCaseDto: UserUseCaseResponseDto = UserUseCaseResponseDto.newFromUser(user);

      expect(userUseCaseDto.id).toBe(user.getId());
      expect(userUseCaseDto.firstName).toBe(user.getFirstName());
      expect(userUseCaseDto.lastName).toBe(user.getLastName());
      expect(userUseCaseDto.email).toBe(user.getEmail());
    });
  });
});

async function createUser(): Promise<User> {
  const createUserEntityPayload: CreateUserEntityPayload = {
    firstName: randomUUID(),
    lastName: randomUUID(),
    email: 'admin@email.com',
    password: await Password.new(randomUUID()),
  };

  return User.new(createUserEntityPayload);
}

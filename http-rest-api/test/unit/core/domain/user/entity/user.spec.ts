import { CreateUserEntityPayload } from '@core/domain/user/entity/type/create-user-entity-payload';
import { User } from '@core/domain/user/entity/user';
import { Password } from '@core/domain/user/value-object/password';
import { randomUUID } from 'crypto';

describe('User', () => {
  describe('new', () => {
    test('should create user instance with default parameters', async () => {
      jest.useFakeTimers();
      const currentDate: number = Date.now();

      const passwordValue = 'password123';
      const password: Password = await Password.new(passwordValue);

      const createUserEntityPayload: CreateUserEntityPayload = {
        firstName: 'First',
        lastName: 'Last',
        email: 'test@email.com',
        password,
      };

      const user: User = await User.new(createUserEntityPayload);

      expect(typeof user.getId() === 'string').toBeTruthy();
      expect(user.getFirstName()).toBe(createUserEntityPayload.firstName);
      expect(user.getLastName()).toBe(createUserEntityPayload.lastName);
      expect(user.getEmail()).toBe(createUserEntityPayload.email);
      expect(user.getPassword().getValue()).not.toBe(passwordValue);
      expect(user.getCreatedAt().getTime()).toBe(currentDate);
      expect(user.getUpdatedAt()).toBeNull();
      expect(user.getRemovedAt()).toBeNull();

      jest.useRealTimers();
    });

    test('should create user with custom parameters', async () => {
      jest.useFakeTimers();
      const customCreatedAt: Date = new Date(Date.now() - 10000);
      const customUpdatedAt: Date = new Date(Date.now() - 6000);
      const customRemovedAt: Date = new Date(Date.now() - 4000);
      const customId: string = randomUUID();

      const passwordValue: string = 'password123';
      const password: Password = await Password.new(passwordValue);
      const createUserEntityPayload: CreateUserEntityPayload = {
        firstName: 'First',
        lastName: 'Last',
        email: 'mail@email.com',
        password,
        id: customId,
        createdAt: customCreatedAt,
        updatedAt: customUpdatedAt,
        removedAt: customRemovedAt,
      };

      const user: User = await User.new(createUserEntityPayload);

      expect(user.getId()).toBe(customId);
      expect(user.getFirstName()).toBe(createUserEntityPayload.firstName);
      expect(user.getLastName()).toBe(createUserEntityPayload.lastName);
      expect(user.getEmail()).toBe(createUserEntityPayload.email);
      expect(user.getPassword().getValue()).not.toBe(passwordValue);
      expect(user.getCreatedAt()).toBe(customCreatedAt);
      expect(user.getUpdatedAt()).toBe(customUpdatedAt);
      expect(user.getRemovedAt()).toBe(customRemovedAt);

      jest.useRealTimers();
    });
  });

  describe('remove', () => {
    test('should mark user instance as removed', async () => {
      jest.useFakeTimers();
      const currentDate: number = Date.now();

      const password: Password = await Password.new('password123');
      const user: User = await User.new({
        firstName: 'First',
        lastName: 'Last',
        email: 'test@email.com',
        password,
      });

      await user.remove();

      expect(user.getRemovedAt()!.getTime()).toBe(currentDate);

      jest.useRealTimers();
    });
  });
});

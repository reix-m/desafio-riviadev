import { Code } from '@core/common/code/code';
import { Exception } from '@core/common/exception/exception';
import { ClassValidationDetails } from '@core/common/util/class-validator/class-validator';
import { Password } from '@core/domain/user/value-object/password';
import { randomUUID } from 'crypto';

describe('Password', () => {
  describe('new', () => {
    test('should not create Password instance when data is valid', async () => {
      const invalidPassword: string = '1234567';
      try {
        await Password.new(invalidPassword);
      } catch (e) {
        const exception: Exception<ClassValidationDetails> = e as Exception<ClassValidationDetails>;

        expect(exception).toBeInstanceOf(Exception);
        expect(exception.code).toBe(Code.VALUE_OBJECT_VALIDATION_ERROR.code);
        expect(exception.data!.errors[0].property).toBe('_value');
      }
    });

    test('should create Password instance when data is valid', async () => {
      const validPassword: string = randomUUID();

      const password: Password = await Password.new(validPassword);

      expect(password).toBeInstanceOf(Password);
      expect(typeof password.getValue() === 'string').toBeTruthy();
      expect(password.getValue()).not.toBe(validPassword);
    });
  });

  describe('compare', () => {
    test('should return true when passwords are the same', async () => {
      const validPassword: string = randomUUID();

      const password: Password = await Password.new(validPassword);

      expect(password.compare(validPassword)).toBeTruthy();
    });

    test('expect return false when passwords are not the same', async () => {
      const validPassword = randomUUID();

      const password: Password = await Password.new(validPassword);

      const incorrectPassword: string = randomUUID() + validPassword;

      expect(password.compare(incorrectPassword)).toBeFalsy();
    });
  });
});

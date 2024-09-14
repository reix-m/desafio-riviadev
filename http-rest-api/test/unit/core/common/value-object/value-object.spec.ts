import { Code } from '@core/common/code/code';
import { Exception } from '@core/common/exception/exception';
import { ClassValidationDetails } from '@core/common/util/class-validator/class-validator';
import { ValueObject } from '@core/common/value-object/value-object';
import { IsString } from 'class-validator';

class MockValueObject extends ValueObject {
  @IsString()
  public address: string;

  constructor(address: string) {
    super();
    this.address = address;
  }
}

describe('ValueObject', () => {
  describe('validate', () => {
    test('should not throw exception when value object is valid', async () => {
      const validValueObject: MockValueObject = new MockValueObject('My Address');
      await expect(validValueObject.validate()).resolves.toBeUndefined();
    });

    test('should throw exception when valud object is not valid', async () => {
      const address: unknown = 42;
      const invalidValueObject: MockValueObject = new MockValueObject(address as string);

      try {
        await invalidValueObject.validate();
      } catch (e) {
        const exception: Exception<ClassValidationDetails> = e as Exception<ClassValidationDetails>;

        expect(exception).toBeInstanceOf(Exception);
        expect(exception.code).toBe(Code.VALUE_OBJECT_VALIDATION_ERROR.code);
        expect(exception.data!.errors[0].property).toBe('address');
      }
    });
  });
});

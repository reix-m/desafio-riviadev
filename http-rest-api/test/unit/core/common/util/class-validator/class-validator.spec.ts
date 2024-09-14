import { Optional } from '@core/common/type/common-types';
import { ClassValidationDetails, ClassValidator } from '@core/common/util/class-validator/class-validator';
import { IsNumber, IsString } from 'class-validator';

export class MockClass {
  @IsString()
  public stringProperty: string;

  @IsNumber()
  public numberProperty: number;

  constructor(stringProperty: string, numberProperty: number) {
    this.stringProperty = stringProperty;
    this.numberProperty = numberProperty;
  }
}

describe('ClassValidator', () => {
  describe('validate', () => {
    test("should doesn't return validation details when target is valid", async () => {
      const validInstance: MockClass = new MockClass('1', 1);
      await expect(ClassValidator.validate(validInstance)).resolves.toBeUndefined();
    });

    test('should return object with validation details when target is invalid', async () => {
      const stringProperty: unknown = 42;
      const numberProperty: unknown = '42';

      const invalidInstance: MockClass = new MockClass(stringProperty as string, numberProperty as number);
      const validationDetails: Optional<ClassValidationDetails> = await ClassValidator.validate(invalidInstance);

      expect(validationDetails).toBeDefined();
      expect(validationDetails!.context).toBe('MockClass');
      expect(validationDetails!.errors[0].property).toBe('stringProperty');
      expect(validationDetails!.errors[1].property).toBe('numberProperty');
    });
  });
});

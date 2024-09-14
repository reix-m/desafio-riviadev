import { UseCaseValidatableAdapter } from '@core/common/adapter/usecase/usecase-validatable-adapter';
import { Code } from '@core/common/code/code';
import { Exception } from '@core/common/exception/exception';
import { ClassValidationDetails } from '@core/common/util/class-validator/class-validator';
import { IsString } from 'class-validator';

class MockAdapter extends UseCaseValidatableAdapter {
  @IsString()
  public stringProperty: string;

  constructor(stringProperty: string) {
    super();
    this.stringProperty = stringProperty;
  }
}

describe('UseCaseValidatableAdapter', () => {
  describe('validate', () => {
    test('should not throw Exception when adapter is valid', async () => {
      const validInstance: MockAdapter = new MockAdapter('42');
      await expect(validInstance.validate()).resolves.toBeUndefined();
    });

    test('should throws Exception when adapter is not valid', async () => {
      const stringProperty: unknown = 42;
      const invalidInstance: MockAdapter = new MockAdapter(stringProperty as string);

      expect.hasAssertions();

      try {
        await invalidInstance.validate();
      } catch (e) {
        const exception: Exception<ClassValidationDetails> = e as Exception<ClassValidationDetails>;

        expect(exception).toBeInstanceOf(Exception);
        expect(exception.code).toBe(Code.USE_CASE_PORT_VALIDATION_ERROR.code);
        expect(exception.data!.errors[0].property).toBe('stringProperty');
      }
    });
  });
});

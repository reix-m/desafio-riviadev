import { Code } from '@core/common/code/code';
import { Exception } from '@core/common/exception/exception';
import { ClassValidationDetails } from '@core/common/util/class-validator/class-validator';
import { Quantity } from '@core/domain/product/value-object/quantity';

describe('Quantity', () => {
  describe('new', () => {
    test('should create Quantity when data is valid', async () => {
      const quantityValue: number = 10;

      const quantity: Quantity = await Quantity.new(quantityValue);

      expect(quantity.getValue()).toBe(quantityValue);
    });

    test('should not create Quantity when data is not valid', async () => {
      const invalidQuantityValue: number = -1;

      try {
        await Quantity.new(invalidQuantityValue);
      } catch (e) {
        const exception: Exception<ClassValidationDetails> = e as Exception<ClassValidationDetails>;

        expect(exception).toBeInstanceOf(Exception);
        expect(exception.code).toBe(Code.VALUE_OBJECT_VALIDATION_ERROR.code);
        expect(exception.data!.errors[0].property).toBe('_value');
      }
    });
  });
});

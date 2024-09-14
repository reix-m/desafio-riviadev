import { CoreAssert } from '@core/common/util/assert/core-assert';

describe('CoreAssert', () => {
  const assertionError: Error = new Error('AssertionError');

  describe('isFalse', () => {
    test('should not throw error when expression is false', () => {
      expect(CoreAssert.isFalse(false, assertionError)).toBeUndefined();
    });

    test('should throw error when expression is true', () => {
      try {
        CoreAssert.isFalse(true, assertionError);
      } catch (error) {
        expect(error).toEqual(assertionError);
      }
    });
  });
});

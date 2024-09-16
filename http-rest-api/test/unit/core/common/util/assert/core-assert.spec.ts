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

  describe('notEmpty', () => {
    test('should not throw error when expression is not <null|undefined>', () => {
      expect(CoreAssert.notEmpty({}, assertionError)).toEqual({});
    });

    test('should throw error when expression is null', () => {
      try {
        CoreAssert.notEmpty(null, assertionError);
      } catch (error) {
        expect(error).toEqual(assertionError);
      }
    });

    test('should throw error when expression is undefined', () => {
      try {
        CoreAssert.notEmpty(undefined, assertionError);
      } catch (error) {
        expect(error).toEqual(assertionError);
      }
    });
  });

  describe('isTrue', () => {
    test('should not throw error when expression is true', () => {
      expect(CoreAssert.isTrue(true, assertionError)).toBeUndefined();
    });

    test('should throw error when expression is false', () => {
      try {
        CoreAssert.isTrue(false, assertionError);
      } catch (e) {
        expect(e).toEqual(assertionError);
      }
    });
  });
});

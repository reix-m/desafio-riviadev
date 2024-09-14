import { Exception } from '@core/common/exception/exception';
import { Code } from '@core/common/code/code';

describe('Exception', () => {
  describe('new', () => {
    test('should create exception with default parameters when data and overrideMessage args are empty', () => {
      const exception: Exception<void> = Exception.new({
        code: Code.BAD_REQUEST_ERROR,
      });

      expect(exception.code).toBe(Code.BAD_REQUEST_ERROR.code);
      expect(exception.message).toBe(Code.BAD_REQUEST_ERROR.message);
      expect(exception.data).toBeUndefined();
    });

    test('should create exception with custom parameters when data and overrideMessage args are set', () => {
      const overrideMessage: string = 'Custom Error.';
      const data: Record<string, unknown> = { result: 'Custom Error.' };
      const exception: Exception<Record<string, unknown>> = Exception.new({
        code: Code.BAD_REQUEST_ERROR,
        overrideMessage,
        data,
      });

      expect(exception.code).toBe(Code.BAD_REQUEST_ERROR.code);
      expect(exception.message).toBe(overrideMessage);
      expect(exception.data).toEqual(data);
    });
  });
});

import { CoreApiResponse } from '@core/common/api/core-api-response';

describe('CoreApiResponse', () => {
  describe('success', () => {
    test('should creates success response with default parameters', () => {
      jest.useFakeTimers();

      const currentDate: number = Date.now();

      const response: CoreApiResponse<unknown> = CoreApiResponse.success();

      expect(response.code).toBe(200);
      expect(response.message).toBe('Success.');
      expect(response.timestamp).toBeGreaterThanOrEqual(currentDate);
      expect(response.data).toBeNull();

      jest.useRealTimers();
    });

    test('should creates success response with custom parameters', () => {
      jest.useFakeTimers();

      const currentDate: number = Date.now();

      const customCode: number = 201;
      const customMessage: string = 'Success Response.';
      const customData: Record<string, unknown> = { result: customMessage };

      const response: CoreApiResponse<unknown> = CoreApiResponse.success(customCode, customData, customMessage);

      expect(response.code).toBe(customCode);
      expect(response.message).toBe(customMessage);
      expect(response.timestamp).toBeGreaterThanOrEqual(currentDate);
      expect(response.data).toEqual(customData);

      jest.useRealTimers();
    });
  });

  describe('error', () => {
    test('should creates error response with default parameters', () => {
      jest.useFakeTimers();

      const currentDate: number = Date.now();

      const response: CoreApiResponse<unknown> = CoreApiResponse.error();

      expect(response.code).toBe(500);
      expect(response.message).toBe('Internal error.');
      expect(response.timestamp).toBeGreaterThanOrEqual(currentDate);
      expect(response.data).toBeNull();

      jest.useRealTimers();
    });

    test('should creates error response with custom parameters', () => {
      jest.useFakeTimers();

      const currentDate: number = Date.now();

      const customCode: number = 404;
      const customMessage: string = 'Resource not found.';
      const customData: Record<string, unknown> = { result: customMessage };

      const response: CoreApiResponse<unknown> = CoreApiResponse.error(customCode, customMessage, customData);

      expect(response.code).toBe(customCode);
      expect(response.message).toBe(customMessage);
      expect(response.timestamp).toBeGreaterThanOrEqual(currentDate);
      expect(response.data).toEqual(customData);

      jest.useRealTimers();
    });
  });
});

import { GetUserPreviewQueryResult } from '@core/features/user/get-user-preview-query/result/get-user-preview-query-result';
import { randomUUID } from 'crypto';

describe('GetUserPreviewQueryResult', () => {
  describe('new', () => {
    test('should create GetUserPreviewQueryResult with required parameters', () => {
      const userId: string = randomUUID();
      const userName: string = 'User Name';

      const getUserPreviewQueryResult: GetUserPreviewQueryResult = GetUserPreviewQueryResult.new(userId, userName);

      expect(getUserPreviewQueryResult.id).toBe(userId);
      expect(getUserPreviewQueryResult.name).toBe(userName);
    });
  });
});

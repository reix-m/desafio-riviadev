import { GetUserPreviewQuery } from '@core/features/user/get-user-preview-query/query/get-user-preview-query';
import { RepositoryFindOptions } from '@core/common/persistence/repository-options';
import { randomUUID } from 'crypto';

describe('GetUserPreviewQuery', () => {
  describe('new', () => {
    test('should create GetUserPreviewQuery with default parameters when input options are empty', () => {
      const customBy: { id: string } = { id: randomUUID() };
      const getUserPreviewQuery: GetUserPreviewQuery = GetUserPreviewQuery.new(customBy);

      expect(getUserPreviewQuery.by).toEqual(customBy);
      expect(getUserPreviewQuery.options).toBeUndefined();
    });

    test('should create GetUserPreviewQuery with custom parameters when input args are set', () => {
      const customBy: { id: string } = { id: randomUUID() };
      const customFindOptions: RepositoryFindOptions = { limit: 5, offset: 0 };

      const getUserPreviewQuery: GetUserPreviewQuery = GetUserPreviewQuery.new(customBy, customFindOptions);

      expect(getUserPreviewQuery.by).toEqual(customBy);
      expect(getUserPreviewQuery.options).toEqual(customFindOptions);
    });
  });
});

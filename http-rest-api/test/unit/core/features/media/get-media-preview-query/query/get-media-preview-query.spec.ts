import { RepositoryFindOptions } from '@core/common/persistence/repository-options';
import { GetMediaPreviewQuery } from '@core/features/media/get-media-preview-query/query/get-media-preview-query';
import { randomUUID } from 'crypto';

describe('GetMediaPreviewQuery', () => {
  describe('new', () => {
    test('should create GetMediaPreviewQuery with default parameters when input agrs are empty', () => {
      const getMediaPreviewQuery: GetMediaPreviewQuery = GetMediaPreviewQuery.new({});

      expect(getMediaPreviewQuery.by).toEqual({});
      expect(getMediaPreviewQuery.options).toBeUndefined();
    });

    test('should create GetMediaPreviewQuery with custom parameters when input args are set', () => {
      const customBy: { id?: string; ownerId?: string } = { id: randomUUID(), ownerId: randomUUID() };
      const customFindOptions: RepositoryFindOptions = { limit: 10, offset: 0 };

      const getMediaPreviewQuery: GetMediaPreviewQuery = GetMediaPreviewQuery.new(customBy, customFindOptions);

      expect(getMediaPreviewQuery.by).toEqual(customBy);
      expect(getMediaPreviewQuery.options).toEqual(customFindOptions);
    });
  });
});

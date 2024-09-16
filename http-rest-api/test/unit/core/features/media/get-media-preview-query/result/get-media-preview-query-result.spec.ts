import { MediaType } from '@core/common/enums/media-enums';
import { GetMediaPreviewQueryResult } from '@core/features/media/get-media-preview-query/result/get-media-preview-query-result';
import { randomUUID } from 'crypto';

describe('GetMediaPreviewQueryResult', () => {
  describe('new', () => {
    test('should create GetMediaPreviewQueryResult with required parameters', () => {
      const mediaId: string = randomUUID();
      const mediaType: MediaType = MediaType.Image;
      const relativePath: string = '/relative/path';

      const getMediaPreviewQueryResult: GetMediaPreviewQueryResult = GetMediaPreviewQueryResult.new(
        mediaId,
        mediaType,
        relativePath
      );

      expect(getMediaPreviewQueryResult.id).toBe(mediaId);
      expect(getMediaPreviewQueryResult.type).toBe(mediaType);
      expect(getMediaPreviewQueryResult.relativePath).toBe(relativePath);
    });
  });
});

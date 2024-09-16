import { MediaType } from '@core/common/enums/media-enums';
import { Nullable } from '@core/common/type/common-types';
import { Media } from '@core/domain/media/entity/media';
import { MediaRepositoryPort } from '@core/domain/media/port/persistence/media-repository-port';
import { FileMetadata } from '@core/domain/media/value-object/file-metadata';
import { HandleGetMediaPreviewQueryService } from '@core/features/media/get-media-preview-query/handle-get-media-preview-query-service';
import { GetMediaPreviewQueryHandler } from '@core/features/media/get-media-preview-query/handler/get-media-preview-query-handler';
import { GetMediaPreviewQuery } from '@core/features/media/get-media-preview-query/query/get-media-preview-query';
import { GetMediaPreviewQueryResult } from '@core/features/media/get-media-preview-query/result/get-media-preview-query-result';
import { createMock } from '@golevelup/ts-jest';
import { randomUUID } from 'crypto';

async function createMedia(): Promise<Media> {
  const metadata: FileMetadata = await FileMetadata.new({
    relativePath: '/relative/path',
    size: 100,
    ext: 'png',
    mimetype: 'image/png',
  });

  return Media.new({
    ownerId: randomUUID(),
    name: randomUUID(),
    type: MediaType.Image,
    metadata: metadata,
  });
}

describe('HandleGetMediaPreviewQueryService', () => {
  const mediaRepository: MediaRepositoryPort = createMock<MediaRepositoryPort>();
  const getMediaPreviewQueryHandler: GetMediaPreviewQueryHandler = new HandleGetMediaPreviewQueryService(
    mediaRepository
  );

  describe('handle', () => {
    test('should return media preview when media found', async () => {
      const mockMedia: Media = await createMedia();

      jest.spyOn(mediaRepository, 'findMedia').mockResolvedValue(mockMedia);

      const expectedPreview: GetMediaPreviewQueryResult = GetMediaPreviewQueryResult.new(
        mockMedia.getId(),
        mockMedia.getType(),
        mockMedia.getMetadata().getRelativePath()
      );

      const getMediaPreviewQuery: GetMediaPreviewQuery = { by: {} };
      const resultPreview: Nullable<GetMediaPreviewQueryResult> =
        await getMediaPreviewQueryHandler.handle(getMediaPreviewQuery);

      expect(resultPreview).toEqual(expectedPreview);
    });

    test('should return nothing when media not found', async () => {
      jest.spyOn(mediaRepository, 'findMedia').mockResolvedValue(null);

      const getMediaPreviewQuery: GetMediaPreviewQuery = { by: {} };
      const resultPreview: Nullable<GetMediaPreviewQueryResult> =
        await getMediaPreviewQueryHandler.handle(getMediaPreviewQuery);

      expect(resultPreview).toBeNull();
    });
  });
});

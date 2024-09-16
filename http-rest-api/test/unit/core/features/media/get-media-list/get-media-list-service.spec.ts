import { MediaType } from '@core/common/enums/media-enums';
import { Media } from '@core/domain/media/entity/media';
import { MediaRepositoryPort } from '@core/domain/media/port/persistence/media-repository-port';
import { MediaUseCaseResponseDto } from '@core/domain/media/usecase/dto/media-usecase-response-dto';
import { FileMetadata } from '@core/domain/media/value-object/file-metadata';
import { GetMediaListService } from '@core/features/media/get-media-list/get-media-list-service';
import { GetMediaListPort } from '@core/features/media/get-media-list/port/get-media-lista-port';
import { GetMediaListUseCase } from '@core/features/media/get-media-list/usecase/get-media-list-usecase';
import { createMock } from '@golevelup/ts-jest';
import { randomUUID } from 'crypto';

async function createMedia(): Promise<Media> {
  const metadata: FileMetadata = await FileMetadata.new({
    relativePath: '/relative/path',
    size: 10_000_000,
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

describe('GetMediaListService', () => {
  const mediaRepository: MediaRepositoryPort = createMock<MediaRepositoryPort>();
  const getMediaListService: GetMediaListUseCase = new GetMediaListService(mediaRepository);

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('execute', () => {
    test('should return media list', async () => {
      const mockMedia: Media = await createMedia();

      jest.spyOn(mediaRepository, 'findMedias').mockResolvedValue([mockMedia]);

      const expectedMediaUseCaseDto: MediaUseCaseResponseDto = MediaUseCaseResponseDto.newFromMedia(mockMedia);

      const getMediaListPort: GetMediaListPort = { executorId: mockMedia.getOwnerId() };
      const resultMediaUseCaseDtos: MediaUseCaseResponseDto[] = await getMediaListService.execute(getMediaListPort);

      expect(resultMediaUseCaseDtos.length).toBe(1);
      expect(resultMediaUseCaseDtos[0]).toEqual(expectedMediaUseCaseDto);
    });
  });
});

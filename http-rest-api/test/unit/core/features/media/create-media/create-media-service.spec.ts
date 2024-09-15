import { MediaType } from '@core/common/enums/media-enums';
import { Media } from '@core/domain/media/entity/media';
import { MediaFileStoragePort } from '@core/domain/media/port/persistence/media-file-storage-port';
import { MediaRepositoryPort } from '@core/domain/media/port/persistence/media-repository-port';
import { MediaUseCaseResponseDto } from '@core/domain/media/usecase/dto/media-usecase-response-dto';
import { FileMetadata } from '@core/domain/media/value-object/file-metadata';
import { CreateFileMetadataValueObjectPayload } from '@core/domain/media/value-object/type/create-file-metadata-value-object-payload';
import { CreateMediaService } from '@core/features/media/create-media/create-media-service';
import { CreateMediaPort } from '@core/features/media/create-media/port/create-media-port';
import { createMock } from '@golevelup/ts-jest';
import { randomUUID } from 'crypto';

async function createFileMetadata(): Promise<FileMetadata> {
  const createFileMetadataValueObjectPayload: CreateFileMetadataValueObjectPayload = {
    relativePath: '/relative/path',
    size: 100,
    ext: 'png',
    mimetype: 'image/png',
  };

  return await FileMetadata.new(createFileMetadataValueObjectPayload);
}

describe('CreateMediaService', () => {
  const mediaRepository: MediaRepositoryPort = createMock<MediaRepositoryPort>();
  const mediaFileStorage: MediaFileStoragePort = createMock<MediaFileStoragePort>();
  const createMediaService: CreateMediaService = new CreateMediaService(mediaRepository, mediaFileStorage);

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('execute', () => {
    test('should upload media file and add media record to repository', async () => {
      jest.useFakeTimers();

      const mockFileMetadata: FileMetadata = await createFileMetadata();
      const mockMediaId: string = randomUUID();

      jest.spyOn(mediaFileStorage, 'upload').mockResolvedValue(mockFileMetadata);
      jest.spyOn(mediaRepository, 'addMedia').mockResolvedValue({ id: mockMediaId });

      const createMediaPort: CreateMediaPort = {
        executorId: randomUUID(),
        name: randomUUID(),
        type: MediaType.Image,
        file: Buffer.from(''),
      };

      const expectedMedia: Media = await Media.new({
        id: mockMediaId,
        ownerId: createMediaPort.executorId,
        name: createMediaPort.name,
        type: createMediaPort.type,
        metadata: mockFileMetadata,
      });

      const expectedMediaUseCaseDto: MediaUseCaseResponseDto =
        await MediaUseCaseResponseDto.newFromMedia(expectedMedia);

      const resultMediaUseCaseDto: MediaUseCaseResponseDto = await createMediaService.execute(createMediaPort);

      resultMediaUseCaseDto.id = expectedMediaUseCaseDto.id;

      expect(resultMediaUseCaseDto).toEqual(expectedMediaUseCaseDto);

      jest.useRealTimers();
    });
  });
});

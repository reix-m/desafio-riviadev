import { Code } from '@core/common/code/code';
import { MediaType } from '@core/common/enums/media-enums';
import { Exception } from '@core/common/exception/exception';
import { ClassValidationDetails } from '@core/common/util/class-validator/class-validator';
import { Media } from '@core/domain/media/entity/media';
import { MediaRepositoryPort } from '@core/domain/media/port/persistence/media-repository-port';
import { MediaUseCaseResponseDto } from '@core/domain/media/usecase/dto/media-usecase-response-dto';
import { FileMetadata } from '@core/domain/media/value-object/file-metadata';
import { GetMediaService } from '@core/features/media/get-media/get-media-service';
import { GetMediaPort } from '@core/features/media/get-media/port/get-media-port';
import { GetMediaUseCase } from '@core/features/media/get-media/usecase/get-media-usecase';
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

describe('GetMediaService', () => {
  const mediaRepository: MediaRepositoryPort = createMock<MediaRepositoryPort>();
  const getMediaService: GetMediaUseCase = new GetMediaService(mediaRepository);

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('execute', () => {
    test('should return media', async () => {
      const mockMedia: Media = await createMedia();

      jest.spyOn(mediaRepository, 'findMedia').mockResolvedValue(mockMedia);

      const expectedMediaUseCaseDto: MediaUseCaseResponseDto = MediaUseCaseResponseDto.newFromMedia(mockMedia);

      const getMediaPort: GetMediaPort = { mediaId: mockMedia.getId() };
      const resultMediaUseCaseDto: MediaUseCaseResponseDto = await getMediaService.execute(getMediaPort);

      expect(resultMediaUseCaseDto).toEqual(expectedMediaUseCaseDto);
    });

    test('should throw Exception when media not found', async () => {
      jest.spyOn(mediaRepository, 'findMedia').mockResolvedValue(null);

      try {
        const getMediaPort: GetMediaPort = { mediaId: randomUUID() };
        await getMediaService.execute(getMediaPort);
      } catch (e) {
        const exception: Exception<ClassValidationDetails> = e as Exception<ClassValidationDetails>;

        expect(exception).toBeInstanceOf(Exception);
        expect(exception.code).toBe(Code.ENTITY_NOT_FOUND_ERROR.code);
      }
    });
  });
});

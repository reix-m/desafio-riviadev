import { Code } from '@core/common/code/code';
import { MediaType } from '@core/common/enums/media-enums';
import { Exception } from '@core/common/exception/exception';
import { ClassValidationDetails } from '@core/common/util/class-validator/class-validator';
import { Media } from '@core/domain/media/entity/media';
import { MediaRepositoryPort } from '@core/domain/media/port/persistence/media-repository-port';
import { MediaUseCaseResponseDto } from '@core/domain/media/usecase/dto/media-usecase-response-dto';
import { FileMetadata } from '@core/domain/media/value-object/file-metadata';
import { EditMediaService } from '@core/features/media/edit-media/edit-media-service';
import { EditMediaPort } from '@core/features/media/edit-media/port/edit-media-port';
import { EditMediaUseCase } from '@core/features/media/edit-media/usecase/edit-media-usecase';
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
describe('EditMediaService', () => {
  const mediaRepository: MediaRepositoryPort = createMock<MediaRepositoryPort>();
  const editMediaService: EditMediaUseCase = new EditMediaService(mediaRepository);

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('execute', () => {
    test('should edit media and update media record in repository', async () => {
      const mockMedia: Media = await createMedia();

      jest.spyOn(mediaRepository, 'findMedia').mockResolvedValue(mockMedia);
      jest.spyOn(mediaRepository, 'updateMedia').mockResolvedValue();

      const editMediaPort: EditMediaPort = {
        executorId: mockMedia.getOwnerId(),
        mediaId: mockMedia.getId(),
        name: 'New Name',
      };

      const expectedMedia: Media = await Media.new({
        id: mockMedia.getId(),
        ownerId: mockMedia.getOwnerId(),
        name: 'New Name',
        type: mockMedia.getType(),
        metadata: mockMedia.getMetadata(),
        createdAt: mockMedia.getCreatedAt(),
      });

      const expectedMediaUseCaseDto: MediaUseCaseResponseDto = MediaUseCaseResponseDto.newFromMedia(expectedMedia);
      const resultMediaUseCaseDto: MediaUseCaseResponseDto = await editMediaService.execute(editMediaPort);

      expect(resultMediaUseCaseDto.updatedAt).toBe(mockMedia.getUpdatedAt()!.getTime());
      expect(resultMediaUseCaseDto).toEqual({ ...expectedMediaUseCaseDto, updatedAt: resultMediaUseCaseDto.updatedAt });
    });

    test('should throw Exception when media not found', async () => {
      jest.spyOn(mediaRepository, 'findMedia').mockResolvedValue(null);

      try {
        const editMediaPort: EditMediaPort = { executorId: randomUUID(), mediaId: randomUUID(), name: randomUUID() };
        await editMediaService.execute(editMediaPort);
      } catch (e) {
        const exception: Exception<ClassValidationDetails> = e as Exception<ClassValidationDetails>;

        expect(exception).toBeInstanceOf(Exception);
        expect(exception.code).toBe(Code.ENTITY_NOT_FOUND_ERROR.code);
      }
    });

    test('should throw Exception when user is not owner of the media', async () => {
      const mockMedia = await createMedia();
      const executorId: string = randomUUID();

      jest.spyOn(mediaRepository, 'findMedia').mockResolvedValue(mockMedia);

      try {
        const editMediaPort: EditMediaPort = { executorId: executorId, mediaId: mockMedia.getId(), name: randomUUID() };
        await editMediaService.execute(editMediaPort);
      } catch (e) {
        const exception: Exception<ClassValidationDetails> = e as Exception<ClassValidationDetails>;

        expect(exception).toBeInstanceOf(Exception);
        expect(exception.code).toBe(Code.ACCESS_DENIED_ERROR.code);
      }
    });
  });
});

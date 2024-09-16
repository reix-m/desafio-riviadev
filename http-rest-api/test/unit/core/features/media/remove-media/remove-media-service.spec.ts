import { Code } from '@core/common/code/code';
import { MediaType } from '@core/common/enums/media-enums';
import { Exception } from '@core/common/exception/exception';
import { MediaRemovedEvent } from '@core/common/message/event/events/media/media-removed-event';
import { EventBusPort } from '@core/common/port/message/event-bus-port';
import { ClassValidationDetails } from '@core/common/util/class-validator/class-validator';
import { Media } from '@core/domain/media/entity/media';
import { MediaRepositoryPort } from '@core/domain/media/port/persistence/media-repository-port';
import { FileMetadata } from '@core/domain/media/value-object/file-metadata';
import { RemoveMediaPort } from '@core/features/media/remove-media/port/remove-media-port';
import { RemoveMediaService } from '@core/features/media/remove-media/remove-media-service';
import { RemoveMediaUseCase } from '@core/features/media/remove-media/usecase/remove-media-usecase';
import { createMock } from '@golevelup/ts-jest';
import { randomUUID } from 'crypto';

async function createMedia(): Promise<Media> {
  const metadata: FileMetadata = await FileMetadata.new({
    relativePath: '/relative/path',
    size: 1000,
    ext: 'png',
    mimetype: 'image/png',
  });

  return Media.new({
    ownerId: randomUUID(),
    name: randomUUID(),
    type: MediaType.Image,
    metadata: metadata,
    removedAt: new Date(),
  });
}

describe('RemoveMediaService', () => {
  const mediaRepository: MediaRepositoryPort = createMock<MediaRepositoryPort>();
  const eventBus: EventBusPort = createMock<EventBusPort>();
  const removeMediaService: RemoveMediaUseCase = new RemoveMediaService(mediaRepository, eventBus);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('execute', () => {
    test('should removes media and sends event about it', async () => {
      const mockMedia: Media = await createMedia();

      jest.spyOn(mediaRepository, 'findMedia').mockResolvedValue(mockMedia);
      jest.spyOn(mediaRepository, 'removeMedia').mockResolvedValue();
      jest.spyOn(eventBus, 'sendEvent').mockResolvedValue();

      const removeMediaPort: RemoveMediaPort = {
        executorId: mockMedia.getOwnerId(),
        mediaId: mockMedia.getId(),
      };

      await removeMediaService.execute(removeMediaPort);

      const removedMedia: Media = jest.spyOn(mediaRepository, 'removeMedia').mock.calls[0][0];
      const mediaRemovedEvent: MediaRemovedEvent = jest.spyOn(eventBus, 'sendEvent').mock
        .calls[0][0] as MediaRemovedEvent;

      expect(removedMedia).toEqual(mockMedia);
      expect(mediaRemovedEvent).toEqual(
        MediaRemovedEvent.new(mockMedia.getId(), mockMedia.getOwnerId(), mockMedia.getType())
      );
    });

    test('should throw Exception when media not found', async () => {
      jest.spyOn(mediaRepository, 'findMedia').mockResolvedValue(null);

      try {
        const removeMediaPort: RemoveMediaPort = { executorId: randomUUID(), mediaId: randomUUID() };
        await removeMediaService.execute(removeMediaPort);
      } catch (e) {
        const exception: Exception<ClassValidationDetails> = e as Exception<ClassValidationDetails>;

        expect(exception).toBeInstanceOf(Exception);
        expect(exception.code).toBe(Code.ENTITY_NOT_FOUND_ERROR.code);
      }
    });

    test('should throw Exception when user is not owner of the media', async () => {
      const mockMedia: Media = await createMedia();
      const executorId: string = randomUUID();

      jest.spyOn(mediaRepository, 'findMedia').mockResolvedValue(mockMedia);

      try {
        const removeMediaPort: RemoveMediaPort = { executorId: executorId, mediaId: mockMedia.getId() };
        await removeMediaService.execute(removeMediaPort);
      } catch (e) {
        const exception: Exception<ClassValidationDetails> = e as Exception<ClassValidationDetails>;

        expect(exception).toBeInstanceOf(Exception);
        expect(exception.code).toBe(Code.ACCESS_DENIED_ERROR.code);
      }
    });
  });
});

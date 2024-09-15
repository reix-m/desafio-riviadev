import { MediaType } from '@core/common/enums/media-enums';
import { Media } from '@core/domain/media/entity/media';
import { CreateMediaEntityPayload } from '@core/domain/media/entity/type/create-media-entity-payload';
import { MediaUseCaseResponseDto } from '@core/domain/media/usecase/dto/media-usecase-response-dto';
import { FileMetadata } from '@core/domain/media/value-object/file-metadata';
import { randomUUID } from 'crypto';

describe('MediaUseCaseResponseDto', () => {
  describe('newFromMedia', () => {
    test('should creates MediaUseCaseResponseDto with required parameters', async () => {
      const media: Media = await createMedia();
      const mediaUseCaseResponseDto: MediaUseCaseResponseDto = MediaUseCaseResponseDto.newFromMedia(media);

      expect(mediaUseCaseResponseDto.id).toBe(media.getId());
      expect(mediaUseCaseResponseDto.ownerId).toBe(media.getOwnerId());
      expect(mediaUseCaseResponseDto.name).toBe(media.getName());
      expect(mediaUseCaseResponseDto.type).toBe(media.getType());
      expect(mediaUseCaseResponseDto.url).toBe(media.getMetadata().getRelativePath());
      expect(mediaUseCaseResponseDto.createdAt).toBe(media.getCreatedAt().getTime());
      expect(mediaUseCaseResponseDto.updatedAt).toBe(media.getUpdatedAt()?.getTime());
    });
  });

  describe('newListFromMedias', () => {
    test('should creates list of MediaUseCaseResponseDto with required parameters', async () => {
      const media: Media = await createMedia();
      const mediaUseCaseResponseDtos: MediaUseCaseResponseDto[] = MediaUseCaseResponseDto.newListFromMedias([media]);

      expect(mediaUseCaseResponseDtos.length).toBe(1);
      expect(mediaUseCaseResponseDtos[0].id).toBe(media.getId());
      expect(mediaUseCaseResponseDtos[0].ownerId).toBe(media.getOwnerId());
      expect(mediaUseCaseResponseDtos[0].name).toBe(media.getName());
      expect(mediaUseCaseResponseDtos[0].type).toBe(media.getType());
      expect(mediaUseCaseResponseDtos[0].url).toBe(media.getMetadata().getRelativePath());
      expect(mediaUseCaseResponseDtos[0].createdAt).toBe(media.getCreatedAt().getTime());
      expect(mediaUseCaseResponseDtos[0].updatedAt).toBe(media.getUpdatedAt()?.getTime());
    });
  });
});

async function createMedia(): Promise<Media> {
  const createMediaEntityPayload: CreateMediaEntityPayload = {
    ownerId: randomUUID(),
    name: randomUUID(),
    type: MediaType.Image,
    metadata: await FileMetadata.new({ relativePath: '/relative/path' }),
    updatedAt: new Date(),
  };

  return Media.new(createMediaEntityPayload);
}

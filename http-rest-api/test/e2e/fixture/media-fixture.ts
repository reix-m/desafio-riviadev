import { MediaType } from '@core/common/enums/media-enums';
import { MediaDITokens } from '@core/domain/media/di/media-di-tokens';
import { Media } from '@core/domain/media/entity/media';
import { MediaRepositoryPort } from '@core/domain/media/port/persistence/media-repository-port';
import { FileMetadata } from '@core/domain/media/value-object/file-metadata';
import { CreateFileMetadataValueObjectPayload } from '@core/domain/media/value-object/type/create-file-metadata-value-object-payload';
import { TestingModule } from '@nestjs/testing';
import { randomUUID } from 'crypto';

export class MediaFixture {
  constructor(private readonly testingModule: TestingModule) {}

  public async insertMedia(payload?: { ownerId?: string }): Promise<Media> {
    const mediaRepository: MediaRepositoryPort = this.testingModule.get(MediaDITokens.MediaRepository);

    const id: string = randomUUID();
    const createdAt: Date = new Date(Date.now() - 3000);
    const editedAt: Date = new Date(Date.now() - 1000);

    const metadataPayload: CreateFileMetadataValueObjectPayload = {
      relativePath: `images/${randomUUID()}.png`,
      size: 100,
      ext: 'png',
      mimetype: 'image/png',
    };

    const media: Media = await Media.new({
      ownerId: payload?.ownerId || randomUUID(),
      name: randomUUID(),
      type: MediaType.Image,
      metadata: await FileMetadata.new(metadataPayload),
      id: id,
      createdAt: createdAt,
      updatedAt: editedAt,
    });

    await mediaRepository.addMedia(media);

    return media;
  }

  public static new(testingModule: TestingModule): MediaFixture {
    return new MediaFixture(testingModule);
  }
}

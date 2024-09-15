import { MediaType } from '@core/common/enums/media-enums';
import { Media } from '@core/domain/media/entity/media';
import { MediaFileStoragePort } from '@core/domain/media/port/persistence/media-file-storage-port';
import { MediaRepositoryPort } from '@core/domain/media/port/persistence/media-repository-port';
import { MediaUseCaseResponseDto } from '@core/domain/media/usecase/dto/media-usecase-response-dto';
import { FileMetadata } from '@core/domain/media/value-object/file-metadata';
import { CreateMediaPort } from '@core/features/media/create-media/port/create-media-port';
import { CreateMediaUseCase } from '@core/features/media/create-media/usecase/create-media-usecase';

export class CreateMediaService implements CreateMediaUseCase {
  constructor(
    private readonly mediaRepository: MediaRepositoryPort,
    private readonly mediaFileStorage: MediaFileStoragePort
  ) {}

  public async execute(payload: CreateMediaPort): Promise<MediaUseCaseResponseDto> {
    const fileMetadata: FileMetadata = await this.mediaFileStorage.upload(payload.file, { type: MediaType.Image });

    const media: Media = await Media.new({
      ownerId: payload.executorId,
      name: payload.name,
      type: payload.type,
      metadata: fileMetadata,
    });

    await this.mediaRepository.addMedia(media);

    return MediaUseCaseResponseDto.newFromMedia(media);
  }
}

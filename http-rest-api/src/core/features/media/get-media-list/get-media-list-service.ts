import { Media } from '@core/domain/media/entity/media';
import { MediaRepositoryPort } from '@core/domain/media/port/persistence/media-repository-port';
import { MediaUseCaseResponseDto } from '@core/domain/media/usecase/dto/media-usecase-response-dto';
import { GetMediaListUseCase } from '@core/features/media/get-media-list/usecase/get-media-list-usecase';
import { GetMediaListPort } from '@core/features/media/get-media-list/port/get-media-lista-port';

export class GetMediaListService implements GetMediaListUseCase {
  constructor(private readonly mediaRepository: MediaRepositoryPort) {}

  public async execute(payload: GetMediaListPort): Promise<MediaUseCaseResponseDto[]> {
    const medias: Media[] = await this.mediaRepository.findMedias(
      { ownerId: payload?.executorId },
      { offset: payload?.offset, limit: payload?.limit }
    );
    return MediaUseCaseResponseDto.newListFromMedias(medias);
  }
}

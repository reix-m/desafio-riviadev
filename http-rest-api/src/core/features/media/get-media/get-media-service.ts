import { Code } from '@core/common/code/code';
import { Exception } from '@core/common/exception/exception';
import { CoreAssert } from '@core/common/util/assert/core-assert';
import { Media } from '@core/domain/media/entity/media';
import { MediaRepositoryPort } from '@core/domain/media/port/persistence/media-repository-port';
import { MediaUseCaseResponseDto } from '@core/domain/media/usecase/dto/media-usecase-response-dto';
import { GetMediaPort } from '@core/features/media/get-media/port/get-media-port';
import { GetMediaUseCase } from '@core/features/media/get-media/usecase/get-media-usecase';

export class GetMediaService implements GetMediaUseCase {
  constructor(private readonly mediaRepository: MediaRepositoryPort) {}

  public async execute(payload: GetMediaPort): Promise<MediaUseCaseResponseDto> {
    const media: Media = CoreAssert.notEmpty(
      await this.mediaRepository.findMedia({ id: payload.mediaId }),
      Exception.new({ code: Code.ENTITY_NOT_FOUND_ERROR, overrideMessage: 'Media not found.' })
    );

    return MediaUseCaseResponseDto.newFromMedia(media);
  }
}

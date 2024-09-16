import { MediaRepositoryPort } from '@core/domain/media/port/persistence/media-repository-port';
import { MediaUseCaseResponseDto } from '@core/domain/media/usecase/dto/media-usecase-response-dto';
import { EditMediaUseCase } from '@core/features/media/edit-media/usecase/edit-media-usecase';
import { EditMediaPort } from './port/edit-media-port';
import { CoreAssert } from '@core/common/util/assert/core-assert';
import { Exception } from '@core/common/exception/exception';
import { Code } from '@core/common/code/code';
import { Media } from '@core/domain/media/entity/media';

export class EditMediaService implements EditMediaUseCase {
  constructor(private readonly mediaRepository: MediaRepositoryPort) {}

  public async execute(payload: EditMediaPort): Promise<MediaUseCaseResponseDto> {
    const media: Media = CoreAssert.notEmpty(
      await this.mediaRepository.findMedia({ id: payload.mediaId }),
      Exception.new({ code: Code.ENTITY_NOT_FOUND_ERROR, overrideMessage: 'Media not found.' })
    );

    const hasAccess: boolean = payload.executorId === media.getOwnerId();
    CoreAssert.isTrue(hasAccess, Exception.new({ code: Code.ACCESS_DENIED_ERROR }));

    await media.edit({ name: payload.name });
    await this.mediaRepository.updateMedia(media);

    return MediaUseCaseResponseDto.newFromMedia(media);
  }
}

import { Code } from '@core/common/code/code';
import { Exception } from '@core/common/exception/exception';
import { MediaRemovedEvent } from '@core/common/message/event/events/media/media-removed-event';
import { EventBusPort } from '@core/common/port/message/event-bus-port';
import { CoreAssert } from '@core/common/util/assert/core-assert';
import { Media } from '@core/domain/media/entity/media';
import { MediaRepositoryPort } from '@core/domain/media/port/persistence/media-repository-port';
import { RemoveMediaPort } from '@core/features/media/remove-media/port/remove-media-port';
import { RemoveMediaUseCase } from '@core/features/media/remove-media/usecase/remove-media-usecase';

export class RemoveMediaService implements RemoveMediaUseCase {
  constructor(
    private readonly mediaRepository: MediaRepositoryPort,
    private readonly eventBus: EventBusPort
  ) {}

  public async execute(payload: RemoveMediaPort): Promise<void> {
    const media: Media = CoreAssert.notEmpty(
      await this.mediaRepository.findMedia({ id: payload.mediaId }),
      Exception.new({ code: Code.ENTITY_NOT_FOUND_ERROR, overrideMessage: 'Media not found.' })
    );

    const hasAccess: boolean = payload.executorId === media.getOwnerId();
    CoreAssert.isTrue(hasAccess, Exception.new({ code: Code.ACCESS_DENIED_ERROR }));

    await this.mediaRepository.removeMedia(media);
    await this.eventBus.sendEvent(MediaRemovedEvent.new(media.getId(), media.getOwnerId(), media.getType()));
  }
}

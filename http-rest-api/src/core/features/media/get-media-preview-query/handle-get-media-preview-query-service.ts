import { Nullable } from '@core/common/type/common-types';
import { Media } from '@core/domain/media/entity/media';
import { MediaRepositoryPort } from '@core/domain/media/port/persistence/media-repository-port';
import { GetMediaPreviewQueryHandler } from '@core/features/media/get-media-preview-query/handler/get-media-preview-query-handler';
import { GetMediaPreviewQuery } from '@core/features/media/get-media-preview-query/query/get-media-preview-query';
import { GetMediaPreviewQueryResult } from '@core/features/media/get-media-preview-query/result/get-media-preview-query-result';

export class HandleGetMediaPreviewQueryService implements GetMediaPreviewQueryHandler {
  constructor(private readonly mediaRepository: MediaRepositoryPort) {}

  public async handle(query: GetMediaPreviewQuery): Promise<Nullable<GetMediaPreviewQueryResult>> {
    let queryResult: Nullable<GetMediaPreviewQueryResult> = null;

    const media: Nullable<Media> = await this.mediaRepository.findMedia(query.by);
    if (media) {
      queryResult = GetMediaPreviewQueryResult.new(
        media.getId(),
        media.getType(),
        media.getMetadata().getRelativePath()
      );
    }

    return queryResult;
  }
}

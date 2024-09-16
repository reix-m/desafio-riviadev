import { Nullable } from '@core/common/type/common-types';
import { MediaDITokens } from '@core/domain/media/di/media-di-tokens';
import { GetMediaPreviewQueryHandler } from '@core/features/media/get-media-preview-query/handler/get-media-preview-query-handler';
import { GetMediaPreviewQuery } from '@core/features/media/get-media-preview-query/query/get-media-preview-query';
import { GetMediaPreviewQueryResult } from '@core/features/media/get-media-preview-query/result/get-media-preview-query-result';
import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@Injectable()
@QueryHandler(GetMediaPreviewQuery)
export class NestWrapperGetMediaPreviewQueryHandler implements IQueryHandler {
  constructor(
    @Inject(MediaDITokens.GetMediaPreviewQueryHandler)
    private readonly handleService: GetMediaPreviewQueryHandler
  ) {}

  public async execute(query: GetMediaPreviewQuery): Promise<Nullable<GetMediaPreviewQueryResult>> {
    return this.handleService.handle(query);
  }
}

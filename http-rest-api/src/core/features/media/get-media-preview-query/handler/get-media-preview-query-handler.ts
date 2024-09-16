import { QueryHandler } from '@core/common/message/query/query-handler';
import { Nullable } from '@core/common/type/common-types';
import { GetMediaPreviewQuery } from '@core/features/media/get-media-preview-query/query/get-media-preview-query';
import { GetMediaPreviewQueryResult } from '@core/features/media/get-media-preview-query/result/get-media-preview-query-result';

export type GetMediaPreviewQueryHandler = QueryHandler<GetMediaPreviewQuery, Nullable<GetMediaPreviewQueryResult>>;

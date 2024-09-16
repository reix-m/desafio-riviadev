import { QueryHandler } from '@core/common/message/query/query-handler';
import { Nullable } from '@core/common/type/common-types';
import { GetUserPreviewQuery } from '@core/features/user/get-user-preview-query/query/get-user-preview-query';
import { GetUserPreviewQueryResult } from '@core/features/user/get-user-preview-query/result/get-user-preview-query-result';

export type GetUserPreviewQueryHandler = QueryHandler<GetUserPreviewQuery, Nullable<GetUserPreviewQueryResult>>;

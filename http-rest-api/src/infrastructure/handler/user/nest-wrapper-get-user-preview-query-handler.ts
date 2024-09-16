import { Nullable } from '@core/common/type/common-types';
import { UserDITokens } from '@core/domain/user/di/user-di-tokens';
import { GetUserPreviewQueryHandler } from '@core/features/user/get-user-preview-query/handler/get-user-preview-query-handler';
import { GetUserPreviewQuery } from '@core/features/user/get-user-preview-query/query/get-user-preview-query';
import { GetUserPreviewQueryResult } from '@core/features/user/get-user-preview-query/result/get-user-preview-query-result';
import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@Injectable()
@QueryHandler(GetUserPreviewQuery)
export class NestWrapperGetUserPreviewQueryHandler implements IQueryHandler {
  constructor(
    @Inject(UserDITokens.GetUserPreviewQueryHandler)
    private readonly handleService: GetUserPreviewQueryHandler
  ) {}

  public async execute(query: GetUserPreviewQuery): Promise<Nullable<GetUserPreviewQueryResult>> {
    return this.handleService.handle(query);
  }
}

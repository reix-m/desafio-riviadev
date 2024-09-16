import { Nullable } from '@core/common/type/common-types';
import { User } from '@core/domain/user/entity/user';
import { UserRepositoryPort } from '@core/domain/user/port/persistence/user-repository-port';
import { GetUserPreviewQueryHandler } from '@core/features/user/get-user-preview-query/handler/get-user-preview-query-handler';
import { GetUserPreviewQuery } from '@core/features/user/get-user-preview-query/query/get-user-preview-query';
import { GetUserPreviewQueryResult } from '@core/features/user/get-user-preview-query/result/get-user-preview-query-result';

export class HandleGetUserPreviewQueryService implements GetUserPreviewQueryHandler {
  constructor(private readonly userRepository: UserRepositoryPort) {}

  public async handle(query: GetUserPreviewQuery): Promise<Nullable<GetUserPreviewQueryResult>> {
    let queryResult: Nullable<GetUserPreviewQueryResult> = null;

    const user: Nullable<User> = await this.userRepository.findUser(query.by, query.options);
    if (user) {
      queryResult = GetUserPreviewQueryResult.new(user.getId(), user.getName());
    }

    return queryResult;
  }
}

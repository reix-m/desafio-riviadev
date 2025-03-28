import { RepositoryFindOptions } from '@core/common/persistence/repository-options';

export class GetUserPreviewQuery {
  by: { id: string };

  options?: RepositoryFindOptions;

  private constructor(by: { id: string }, options?: RepositoryFindOptions) {
    this.by = by;
    this.options = options;
  }

  public static new(by: { id: string }, options?: RepositoryFindOptions): GetUserPreviewQuery {
    return new GetUserPreviewQuery(by, options);
  }
}

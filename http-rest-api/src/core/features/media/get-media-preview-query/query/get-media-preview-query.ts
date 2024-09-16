import { RepositoryFindOptions } from '@core/common/persistence/repository-options';

export class GetMediaPreviewQuery {
  by: { id?: string; ownerId?: string };

  options?: RepositoryFindOptions;

  private constructor(by: { id?: string; ownerId?: string }, options?: RepositoryFindOptions) {
    this.by = by;
    this.options = options;
  }

  public static new(by: { id?: string; ownerId?: string }, options?: RepositoryFindOptions): GetMediaPreviewQuery {
    return new GetMediaPreviewQuery(by, options);
  }
}

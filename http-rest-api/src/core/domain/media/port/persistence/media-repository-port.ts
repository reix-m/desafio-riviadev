import { RepositoryFindOptions } from '@core/common/persistence/repository-options';
import { Nullable } from '@core/common/type/common-types';
import { Media } from '@core/domain/media/entity/media';

export type MediaRepositoryPort = {
  findMedia(by: { id?: string }, options?: RepositoryFindOptions): Promise<Nullable<Media>>;
  addMedia(media: Media): Promise<{ id: string }>;
  updateMedia(media: Media): Promise<void>;
  findMedias(by: { ownerId?: string }, options?: RepositoryFindOptions): Promise<Media[]>;
};

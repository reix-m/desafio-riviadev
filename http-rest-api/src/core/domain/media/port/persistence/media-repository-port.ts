import { Media } from '@core/domain/media/entity/media';

export type MediaRepositoryPort = {
  addMedia(media: Media): Promise<{ id: string }>;
};

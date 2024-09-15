import { MediaType } from '@core/common/enums/media-enums';
import { FileMetadata } from '@core/domain/media/value-object/file-metadata';

export type CreateMediaEntityPayload = {
  ownerId: string;
  name: string;
  type: MediaType;
  metadata: FileMetadata;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  removedAt?: Date;
};

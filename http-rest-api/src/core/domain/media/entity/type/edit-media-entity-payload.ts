import { FileMetadata } from '@core/domain/media/value-object/file-metadata';

export type EditMediaEntityPayload = {
  name?: string;
  metadata?: FileMetadata;
};

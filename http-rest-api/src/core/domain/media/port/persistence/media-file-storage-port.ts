import { MediaFileStorageOptions } from '@core/common/persistence/media-file-storage-options';
import { FileMetadata } from '@core/domain/media/value-object/file-metadata';
import { Readable } from 'stream';

export type MediaFileStoragePort = {
  upload(file: Buffer | Readable, options: MediaFileStorageOptions): Promise<FileMetadata>;
};

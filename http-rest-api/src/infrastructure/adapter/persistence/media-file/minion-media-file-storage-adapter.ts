import { MediaType } from '@core/common/enums/media-enums';
import { MediaFileStorageOptions } from '@core/common/persistence/media-file-storage-options';
import { CoreAssert } from '@core/common/util/assert/core-assert';
import { MediaFileStoragePort } from '@core/domain/media/port/persistence/media-file-storage-port';
import { FileMetadata } from '@core/domain/media/value-object/file-metadata';
import { FileStorageConfig } from '@infrastructure/config/file-storage-config';
import { randomUUID } from 'crypto';
import * as Minio from 'minio';
import { Readable } from 'stream';

type FileUploadDetails = { bucket: string; ext: string; mimetype: string };

export class MinioMediaFileStorageAdapter implements MediaFileStoragePort {
  private client: Minio.Client = new Minio.Client({
    endPoint: CoreAssert.notEmpty(FileStorageConfig.Endpoint, new Error('Minio: endpoint not set')),
    port: FileStorageConfig.Port,
    accessKey: FileStorageConfig.AccessKey,
    secretKey: FileStorageConfig.SecretKey,
    useSSL: FileStorageConfig.UseSSL,
  });

  public async upload(uploadFile: Buffer | Readable, options: MediaFileStorageOptions): Promise<FileMetadata> {
    const uploadDetails: FileUploadDetails = this.defineFileUploadDetails(options.type);

    const bucket: string = uploadDetails.bucket;
    const key: string = `${randomUUID()}.${uploadDetails.ext}`;

    await this.client.putObject(bucket, key, uploadFile, undefined, { 'content-type': uploadDetails.mimetype });
    const fileStat: Minio.BucketItemStat = await this.client.statObject(bucket, key);

    const fileMetadata: FileMetadata = await FileMetadata.new({
      relativePath: `${bucket}/${key}`,
      size: fileStat.size,
      mimetype: fileStat.metaData['content-type'],
      ext: uploadDetails.ext,
    });

    return fileMetadata;
  }

  private defineFileUploadDetails(type: MediaType): FileUploadDetails {
    const detailsRecord: Record<MediaType, FileUploadDetails> = {
      [MediaType.Image]: {
        bucket: FileStorageConfig.ImageBucket,
        ext: FileStorageConfig.ImageExt,
        mimetype: FileStorageConfig.ImageMimetype,
      },
    };

    return CoreAssert.notEmpty(detailsRecord[type], new Error('Minio: unknown media type'));
  }
}

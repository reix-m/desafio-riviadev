import { Optional } from '@core/common/type/common-types';
import { get } from 'env-var';

export class FileStorageConfig {
  public static readonly Endpoint: Optional<string> = get('FILE_STORAGE_ENDPOINT').asString();

  public static readonly Port: Optional<number> = get('FILE_STORAGE_PORT').asPortNumber();

  public static readonly AccessKey: string = get('FILE_STORAGE_ACCESS_KEY').required().asString();

  public static readonly SecretKey: string = get('FILE_STORAGE_SECRET_KEY').required().asString();

  public static readonly UseSSL: boolean = get('FILE_STORAGE_USE_SSL').asBool() || false;

  public static readonly BasePath: string = get('FILE_STORAGE_BASE_PATH').required().asString();

  public static readonly ImageBucket: string = get('FILE_STORAGE_IMAGE_BUCKET').required().asString();

  public static readonly ImageExt: string = get('FILE_STORAGE_IMAGE_EXT').required().asString();

  public static readonly ImageMimetype: string = get('FILE_STORAGE_IMAGE_MIMETYPE').required().asString();
}

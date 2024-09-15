import { Nullable } from '@core/common/type/common-types';
import { ValueObject } from '@core/common/value-object/value-object';
import { CreateFileMetadataValueObjectPayload } from '@core/domain/media/value-object/type/create-file-metadata-value-object-payload';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class FileMetadata extends ValueObject {
  @IsString()
  private readonly _relativePath: string;

  @IsOptional()
  @IsNumber()
  private readonly _size: Nullable<number>;

  @IsOptional()
  @IsString()
  private readonly _ext: Nullable<string>;

  @IsOptional()
  @IsString()
  private readonly _mimetype: Nullable<string>;

  constructor(payload: CreateFileMetadataValueObjectPayload) {
    super();

    this._relativePath = payload.relativePath;
    this._size = payload?.size ?? null;
    this._ext = payload?.ext ?? null;
    this._mimetype = payload?.mimetype ?? null;
  }

  public getRelativePath(): string {
    return this._relativePath;
  }

  public getSize(): Nullable<number> {
    return this._size;
  }

  public getExt(): Nullable<string> {
    return this._ext;
  }

  public getMimetype(): Nullable<string> {
    return this._mimetype;
  }

  public static async new(payload: CreateFileMetadataValueObjectPayload): Promise<FileMetadata> {
    const fileMetadata: FileMetadata = new FileMetadata(payload);
    await fileMetadata.validate();

    return fileMetadata;
  }
}

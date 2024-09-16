import { Entity } from '@core/common/entity/entity';
import { RemovableEntity } from '@core/common/entity/removable-entity';
import { MediaType } from '@core/common/enums/media-enums';
import { Nullable } from '@core/common/type/common-types';
import { CreateMediaEntityPayload } from '@core/domain/media/entity/type/create-media-entity-payload';
import { EditMediaEntityPayload } from '@core/domain/media/entity/type/edit-media-entity-payload';
import { FileMetadata } from '@core/domain/media/value-object/file-metadata';
import { IsDate, IsEnum, IsInstance, IsOptional, IsString, IsUUID } from 'class-validator';
import { randomUUID } from 'crypto';

export class Media extends Entity<string> implements RemovableEntity {
  @IsUUID()
  private readonly _ownerId: string;

  @IsString()
  private _name: string;

  @IsEnum(MediaType)
  private readonly _type: MediaType;

  @IsInstance(FileMetadata)
  private _metadata: FileMetadata;

  @IsDate()
  private readonly _createdAt: Date;

  @IsOptional()
  @IsDate()
  private _updatedAt: Nullable<Date>;

  @IsOptional()
  @IsDate()
  private _removedAt: Nullable<Date>;

  constructor(payload: CreateMediaEntityPayload) {
    super();

    this._ownerId = payload.ownerId;
    this._name = payload.name;
    this._type = payload.type;
    this._metadata = payload.metadata;
    this._id = payload?.id ?? randomUUID();
    this._createdAt = payload?.createdAt ?? new Date();
    this._updatedAt = payload?.updatedAt ?? null;
    this._removedAt = payload?.removedAt ?? null;
  }

  public getOwnerId(): string {
    return this._ownerId;
  }

  public getName(): string {
    return this._name;
  }

  public getType(): MediaType {
    return this._type;
  }

  public getMetadata(): FileMetadata {
    return this._metadata;
  }

  public getCreatedAt(): Date {
    return this._createdAt;
  }

  public getUpdatedAt(): Nullable<Date> {
    return this._updatedAt;
  }

  public getRemovedAt(): Nullable<Date> {
    return this._removedAt;
  }

  public async remove(): Promise<void> {
    this._removedAt = new Date();
    await this.validate();
  }

  public async edit(payload: EditMediaEntityPayload): Promise<void> {
    const currentDate: Date = new Date();

    if (payload?.name) {
      this._name = payload.name;
      this._updatedAt = currentDate;
    }

    if (payload?.metadata) {
      this._metadata = payload.metadata;
      this._updatedAt = currentDate;
    }

    await this.validate();
  }

  public static async new(payload: CreateMediaEntityPayload): Promise<Media> {
    const media: Media = new Media(payload);
    await media.validate();

    return media;
  }
}

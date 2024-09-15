import { UseCaseValidatableAdapter } from '@core/common/adapter/usecase/usecase-validatable-adapter';
import { MediaType } from '@core/common/enums/media-enums';
import { CreateMediaPort } from '@core/features/media/create-media/port/create-media-port';
import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { IsDefined, IsEnum, IsString, IsUUID } from 'class-validator';
import { Readable } from 'stream';

@Exclude()
export class CreateMediaAdapter extends UseCaseValidatableAdapter implements CreateMediaPort {
  @Expose()
  @IsUUID()
  public executorId: string;

  @Expose()
  @IsString()
  public name: string;

  @Expose()
  @IsEnum(MediaType)
  public type: MediaType;

  @Expose()
  @IsDefined()
  public file: Buffer | Readable;

  public static async new(payload: CreateMediaPort): Promise<CreateMediaAdapter> {
    const adapter: CreateMediaAdapter = plainToInstance(CreateMediaAdapter, payload);
    await adapter.validate();

    return adapter;
  }
}

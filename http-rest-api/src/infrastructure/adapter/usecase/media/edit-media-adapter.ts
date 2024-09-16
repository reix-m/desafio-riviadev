import { UseCaseValidatableAdapter } from '@core/common/adapter/usecase/usecase-validatable-adapter';
import { EditMediaPort } from '@core/features/media/edit-media/port/edit-media-port';
import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { IsOptional, IsString, IsUUID } from 'class-validator';

@Exclude()
export class EditMediaAdapter extends UseCaseValidatableAdapter implements EditMediaPort {
  @Expose()
  @IsUUID()
  public executorId: string;

  @Expose()
  @IsUUID()
  public mediaId: string;

  @Expose()
  @IsOptional()
  @IsString()
  public name?: string;

  public static async new(payload: EditMediaPort): Promise<EditMediaAdapter> {
    const adapter: EditMediaAdapter = plainToInstance(EditMediaAdapter, payload);
    await adapter.validate();

    return adapter;
  }
}

import { UseCaseValidatableAdapter } from '@core/common/adapter/usecase/usecase-validatable-adapter';
import { RemoveMediaPort } from '@core/features/media/remove-media/port/remove-media-port';
import { Exclude, Expose, plainToClass } from 'class-transformer';
import { IsUUID } from 'class-validator';

@Exclude()
export class RemoveMediaAdapter extends UseCaseValidatableAdapter implements RemoveMediaPort {
  @Expose()
  @IsUUID()
  public executorId: string;

  @Expose()
  @IsUUID()
  public mediaId: string;

  public static async new(payload: RemoveMediaPort): Promise<RemoveMediaAdapter> {
    const adapter: RemoveMediaAdapter = plainToClass(RemoveMediaAdapter, payload);
    await adapter.validate();

    return adapter;
  }
}

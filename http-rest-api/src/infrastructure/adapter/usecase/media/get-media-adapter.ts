import { UseCaseValidatableAdapter } from '@core/common/adapter/usecase/usecase-validatable-adapter';
import { GetMediaPort } from '@core/features/media/get-media/port/get-media-port';
import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { IsUUID } from 'class-validator';

@Exclude()
export class GetMediaAdapter extends UseCaseValidatableAdapter implements GetMediaPort {
  @Expose()
  @IsUUID()
  public mediaId: string;

  public static async new(payload: GetMediaPort): Promise<GetMediaAdapter> {
    const adapter: GetMediaAdapter = plainToInstance(GetMediaAdapter, payload);
    await adapter.validate();

    return adapter;
  }
}

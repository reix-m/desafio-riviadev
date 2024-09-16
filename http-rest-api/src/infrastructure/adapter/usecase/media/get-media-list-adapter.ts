import { UseCaseValidatableAdapter } from '@core/common/adapter/usecase/usecase-validatable-adapter';
import { GetMediaListPort } from '@core/features/media/get-media-list/port/get-media-lista-port';
import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { IsNumber, IsOptional, IsUUID } from 'class-validator';

@Exclude()
export class GetMediaListAdapter extends UseCaseValidatableAdapter implements GetMediaListPort {
  @Expose()
  @IsOptional()
  @IsUUID()
  public executorId: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  public offset: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  public limit: number;

  public static async new(payload: GetMediaListPort): Promise<GetMediaListAdapter> {
    const adapter: GetMediaListAdapter = plainToInstance(GetMediaListAdapter, payload);
    await adapter.validate();

    return adapter;
  }
}

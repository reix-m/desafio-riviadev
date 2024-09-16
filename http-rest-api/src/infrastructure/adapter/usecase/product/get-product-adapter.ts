import { UseCaseValidatableAdapter } from '@core/common/adapter/usecase/usecase-validatable-adapter';
import { GetProductPort } from '@core/features/product/get-product/port/get-product-port';
import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { IsUUID } from 'class-validator';

@Exclude()
export class GetProductAdapter extends UseCaseValidatableAdapter implements GetProductPort {
  @Expose()
  @IsUUID()
  public productId: string;

  public static async new(payload: GetProductPort): Promise<GetProductAdapter> {
    const adapter: GetProductAdapter = plainToInstance(GetProductAdapter, payload);
    await adapter.validate();

    return adapter;
  }
}

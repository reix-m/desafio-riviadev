import { UseCaseValidatableAdapter } from '@core/common/adapter/usecase/usecase-validatable-adapter';
import { RemoveProductPort } from '@core/features/product/remove-product/port/remove-product-port';
import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { IsUUID } from 'class-validator';

@Exclude()
export class RemoveProductAdapter extends UseCaseValidatableAdapter implements RemoveProductPort {
  @Expose()
  @IsUUID()
  public executorId: string;

  @Expose()
  @IsUUID()
  public productId: string;

  public static async new(payload: RemoveProductPort): Promise<RemoveProductAdapter> {
    const adapter: RemoveProductAdapter = plainToInstance(RemoveProductAdapter, payload);
    await adapter.validate();

    return adapter;
  }
}

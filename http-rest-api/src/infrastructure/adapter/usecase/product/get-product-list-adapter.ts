import { UseCaseValidatableAdapter } from '@core/common/adapter/usecase/usecase-validatable-adapter';
import { ProductCategory } from '@core/common/enums/product-enums';
import { GetProductListPort } from '@core/features/product/get-product-list/port/get-product-list-port';
import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { IsOptional, IsUUID, IsEnum, IsNumber } from 'class-validator';

@Exclude()
export class GetProductListAdapter extends UseCaseValidatableAdapter implements GetProductListPort {
  @Expose()
  @IsOptional()
  @IsUUID()
  public ownerId?: string;

  @Expose()
  @IsOptional()
  @IsEnum(ProductCategory)
  public category?: ProductCategory;

  @Expose()
  @IsOptional()
  @IsNumber()
  public offset?: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  public limit?: number;

  public static async new(payload: GetProductListPort): Promise<GetProductListAdapter> {
    const adapter: GetProductListAdapter = plainToInstance(GetProductListAdapter, payload);
    await adapter.validate();

    return adapter;
  }
}

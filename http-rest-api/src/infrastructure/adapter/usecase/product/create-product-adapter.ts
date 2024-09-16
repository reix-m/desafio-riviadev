import { UseCaseValidatableAdapter } from '@core/common/adapter/usecase/usecase-validatable-adapter';
import { ProductCategory } from '@core/common/enums/product-enums';
import { CreateProductPort } from '@core/features/product/create-product/port/create-product-port';
import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

@Exclude()
export class CreateProductAdapter extends UseCaseValidatableAdapter implements CreateProductPort {
  @Expose()
  @IsUUID()
  public executorId: string;

  @Expose()
  @IsString()
  public name: string;

  @Expose()
  @IsString()
  public description: string;

  @Expose()
  @IsString()
  public category: ProductCategory;

  @Expose()
  @IsNumber()
  public quantity: number;

  @Expose()
  @IsUUID()
  @IsOptional()
  public imageId?: string;

  public static async new(payload: CreateProductPort): Promise<CreateProductAdapter> {
    const adapter: CreateProductAdapter = plainToInstance(CreateProductAdapter, payload);
    await adapter.validate();

    return adapter;
  }
}

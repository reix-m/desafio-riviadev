import { UseCaseValidatableAdapter } from '@core/common/adapter/usecase/usecase-validatable-adapter';
import { ProductCategory } from '@core/common/enums/product-enums';
import { EditProductPort } from '@core/features/product/edit-product/port/edit-product-port';
import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

@Exclude()
export class EditProductAdapter extends UseCaseValidatableAdapter implements EditProductPort {
  @Expose()
  @IsUUID()
  public executorId: string;

  @Expose()
  @IsUUID()
  public productId: string;

  @Expose()
  @IsOptional()
  @IsString()
  public name?: string;

  @Expose()
  @IsOptional()
  @IsString()
  public description?: string;

  @Expose()
  @IsOptional()
  @IsEnum(ProductCategory)
  public category?: ProductCategory;

  @Expose()
  @IsOptional()
  @IsUUID()
  public imageId?: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  public quantity?: number;

  public static async new(payload: EditProductPort): Promise<EditProductAdapter> {
    const adapter: EditProductAdapter = plainToInstance(EditProductAdapter, payload);
    await adapter.validate();

    return adapter;
  }
}

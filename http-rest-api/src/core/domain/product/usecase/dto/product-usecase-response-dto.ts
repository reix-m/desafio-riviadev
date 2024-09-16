import { ProductCategory } from '@core/common/enums/product-enums';
import { Nullable } from '@core/common/type/common-types';
import { Product } from '@core/domain/product/entity/product';
import { ProductImage } from '@core/domain/product/entity/product-image';
import { ProductOwner } from '@core/domain/product/entity/product-owner';
import { Exclude, Expose, plainToInstance } from 'class-transformer';

@Exclude()
export class ProductUseCaseResponseDto {
  @Expose()
  public id: string;

  public owner: { id: string; name: string };

  public image: Nullable<{ id: string; url: string }>;

  @Expose()
  public name: string;

  @Expose()
  public description: string;

  public quantity: number;

  @Expose()
  public category: ProductCategory;

  public createdAt: number;

  public updatedAt: Nullable<number>;

  public static newFromProduct(product: Product): ProductUseCaseResponseDto {
    const payload: Record<string, unknown> = {
      id: product.getId(),
      name: product.getName(),
      description: product.getDescription(),
      category: product.getCategory(),
    };

    const dto: ProductUseCaseResponseDto = plainToInstance(ProductUseCaseResponseDto, payload);

    const productOwner: ProductOwner = product.getOwner();
    const productImage: Nullable<ProductImage> = product.getImage();

    dto.owner = { id: productOwner.getId(), name: productOwner.getName() };
    dto.image = null;

    if (productImage) {
      dto.image = { id: productImage.getId(), url: productImage.getRelativePath() };
    }

    dto.quantity = product.getQuantity().getValue();
    dto.createdAt = product.getCreatedAt().getTime();
    dto.updatedAt = product.getUpdatedAt()?.getTime() ?? null;

    return dto;
  }

  public static newListFromProducts(products: Product[]): ProductUseCaseResponseDto[] {
    return products.map(this.newFromProduct);
  }
}

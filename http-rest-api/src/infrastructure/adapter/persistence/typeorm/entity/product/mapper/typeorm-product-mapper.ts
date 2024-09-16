import { Nullable } from '@core/common/type/common-types';
import { Product } from '@core/domain/product/entity/product';
import { ProductImage } from '@core/domain/product/entity/product-image';
import { ProductOwner } from '@core/domain/product/entity/product-owner';
import { Quantity } from '@core/domain/product/value-object/quantity';
import { TypeOrmProduct } from '@infrastructure/adapter/persistence/typeorm/entity/product/typeorm-product';

export class TypeOrmProductMapper {
  public static toOrmEntity(domainProduct: Product): TypeOrmProduct {
    const ormProduct: TypeOrmProduct = new TypeOrmProduct();
    const image: Nullable<ProductImage> = domainProduct.getImage();

    ormProduct.id = domainProduct.getId();
    ormProduct.ownerId = domainProduct.getOwner().getId();
    ormProduct.name = domainProduct.getName();
    ormProduct.description = domainProduct.getDescription();
    ormProduct.quantity = domainProduct.getQuantity().getValue();
    ormProduct.category = domainProduct.getCategory();
    ormProduct.imageId = image ? image.getId() : null!;
    ormProduct.createdAt = domainProduct.getCreatedAt();
    ormProduct.updatedAt = domainProduct.getUpdatedAt() as Date;
    ormProduct.removedAt = domainProduct.getRemovedAt() as Date;

    return ormProduct;
  }

  public static toOrmEntities(domainProducts: Product[]): TypeOrmProduct[] {
    return domainProducts.map(this.toOrmEntity);
  }

  public static toDomainEntity(ormProduct: TypeOrmProduct): Product {
    const domainProduct: Product = new Product({
      owner: new ProductOwner(ormProduct.owner.id, `${ormProduct.owner.firstName} ${ormProduct.owner.lastName}`),
      name: ormProduct.name,
      description: ormProduct.description,
      category: ormProduct.category,
      quantity: new Quantity(ormProduct.quantity),
      image: ormProduct?.image ? new ProductImage(ormProduct.image.id, ormProduct.image.relativePath) : null,
      id: ormProduct.id,
      createdAt: ormProduct.createdAt,
      updatedAt: ormProduct.updatedAt,
      removedAt: ormProduct.removedAt,
    });

    return domainProduct;
  }

  public static toDomainEntities(ormProducts: TypeOrmProduct[]): Product[] {
    return ormProducts.map(this.toDomainEntity);
  }
}

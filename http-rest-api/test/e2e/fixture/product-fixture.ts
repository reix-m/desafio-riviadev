import { ProductCategory } from '@core/common/enums/product-enums';
import { Nullable } from '@core/common/type/common-types';
import { Media } from '@core/domain/media/entity/media';
import { Product } from '@core/domain/product/entity/product';
import { User } from '@core/domain/user/entity/user';
import { TestingModule } from '@nestjs/testing';
import { MediaFixture } from './media-fixture';
import { ProductRepositoryPort } from '@core/domain/product/port/persistence/product-repository-port';
import { ProductDITokens } from '@core/domain/product/di/product-di-tokens';
import { randomUUID } from 'crypto';
import { Quantity } from '@core/domain/product/value-object/quantity';
import { ProductOwner } from '@core/domain/product/entity/product-owner';
import { ProductImage } from '@core/domain/product/entity/product-image';

export class ProductFixture {
  constructor(private readonly testingModule: TestingModule) {}

  public async insertProduct(payload: {
    owner: User;
    category: ProductCategory;
    quantity: number;
    withImage?: boolean;
  }): Promise<Product> {
    const productRepository: ProductRepositoryPort = this.testingModule.get(ProductDITokens.ProductRepository);
    const mediaFixture: MediaFixture = MediaFixture.new(this.testingModule);

    const createdAt: Date = new Date(Date.now() - 3000);
    const updatedAt: Date = new Date(Date.now() - 1000);

    const image: Nullable<Media> = payload.withImage
      ? await mediaFixture.insertMedia({ ownerId: payload.owner.getId() })
      : null;

    const product: Product = await Product.new({
      owner: ProductFixture.userToProductOwner(payload.owner),
      name: randomUUID(),
      image: image ? ProductFixture.mediaToProductImage(image) : null,
      description: randomUUID(),
      category: payload.category,
      quantity: await Quantity.new(payload.quantity),
      createdAt: createdAt,
      updatedAt: updatedAt,
    });

    await productRepository.addProduct(product);

    return product;
  }

  public static userToProductOwner(user: User): ProductOwner {
    const name: string = `${user.getFirstName()} ${user.getLastName()}`;
    return new ProductOwner(user.getId(), name);
  }

  public static mediaToProductImage(media: Media): ProductImage {
    return new ProductImage(media.getId(), media.getMetadata().getRelativePath());
  }

  public static new(testingModule: TestingModule): ProductFixture {
    return new ProductFixture(testingModule);
  }
}

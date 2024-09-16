import { ProductCategory } from '@core/common/enums/product-enums';
import { RepositoryFindOptions, RepositoryRemoveOptions } from '@core/common/persistence/repository-options';
import { Nullable } from '@core/common/type/common-types';
import { Product } from '@core/domain/product/entity/product';

export type ProductRepositoryPort = {
  findProduct(by: { id?: string }, options?: RepositoryFindOptions): Promise<Nullable<Product>>;
  findProducts(
    by: { ownerId?: string; category?: ProductCategory },
    options?: RepositoryFindOptions
  ): Promise<Product[]>;
  addProduct(product: Product): Promise<{ id: string }>;
  updateProduct(product: Product): Promise<void>;
  removeProduct(product: Product, options: RepositoryRemoveOptions): Promise<void>;
};

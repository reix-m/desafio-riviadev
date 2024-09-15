import { ProductCategory } from '@core/common/enums/product-enums';
import { Nullable } from '@core/common/type/common-types';
import { ProductImage } from '@core/domain/product/entity/product-image';
import { ProductOwner } from '@core/domain/product/entity/product-owner';
import { Quantity } from '@core/domain/product/value-object/quantity';

export type CreateProductEntityPayload = {
  owner: ProductOwner;
  name: string;
  description: string;
  category: ProductCategory;
  quantity: Quantity;
  image?: Nullable<ProductImage>;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  removedAt?: Date;
};

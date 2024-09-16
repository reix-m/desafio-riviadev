import { ProductCategory } from '@core/common/enums/product-enums';
import { Nullable } from '@core/common/type/common-types';
import { ProductImage } from '@core/domain/product/entity/product-image';
import { Quantity } from '@core/domain/product/value-object/quantity';

export type EditProductEntityPayload = {
  name?: string;
  description?: string;
  category?: ProductCategory;
  quantity?: Quantity;
  image?: Nullable<ProductImage>;
};

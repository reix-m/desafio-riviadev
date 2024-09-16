import { ProductCategory } from '@core/common/enums/product-enums';

export type GetProductListPort = {
  ownerId?: string;
  category?: ProductCategory;
  offset?: number;
  limit?: number;
};

import { ProductCategory } from '@core/common/enums/product-enums';

export type EditProductPort = {
  executorId: string;
  productId: string;
  name?: string;
  description?: string;
  imageId?: string;
  category?: ProductCategory;
  quantity?: number;
};

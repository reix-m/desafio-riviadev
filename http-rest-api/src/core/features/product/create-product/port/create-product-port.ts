import { ProductCategory } from '@core/common/enums/product-enums';

export type CreateProductPort = {
  executorId: string;
  name: string;
  description: string;
  quantity: number;
  category: ProductCategory;
  imageId?: string;
};

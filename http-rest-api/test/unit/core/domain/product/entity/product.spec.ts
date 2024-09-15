import { ProductCategory } from '@core/common/enums/product-enums';
import { Product } from '@core/domain/product/entity/product';
import { ProductImage } from '@core/domain/product/entity/product-image';
import { ProductOwner } from '@core/domain/product/entity/product-owner';
import { CreateProductEntityPayload } from '@core/domain/product/entity/type/create-product-entity-payload';
import { Quantity } from '@core/domain/product/value-object/quantity';
import { randomUUID } from 'crypto';

describe('Product', () => {
  describe('new', () => {
    test('should creates product with default parameters when input optional args are empty', async () => {
      jest.useFakeTimers();

      const currentDate: number = Date.now();

      const productOwnerId: string = randomUUID();
      const productOwnerName: string = randomUUID();

      const createProductEntityPayload: CreateProductEntityPayload = {
        owner: await ProductOwner.new(productOwnerId, productOwnerName),
        name: 'Product Name',
        description: 'Product description',
        category: ProductCategory.Eletronics,
        quantity: await Quantity.new(10),
      };

      const product: Product = await Product.new(createProductEntityPayload);

      expect(typeof product.getId() === 'string').toBeTruthy();
      expect(product.getOwner().getId()).toBe(productOwnerId);
      expect(product.getOwner().getName()).toEqual(productOwnerName);
      expect(product.getName()).toBe(createProductEntityPayload.name);
      expect(product.getDescription()).toBe(createProductEntityPayload.description);
      expect(product.getQuantity().getValue()).toBe(createProductEntityPayload.quantity.getValue());
      expect(product.getCategory()).toBe(createProductEntityPayload.category);
      expect(product.getImage()).toBeNull();
      expect(product.getCreatedAt().getTime()).toBe(currentDate);
      expect(product.getUpdatedAt()).toBeNull();
      expect(product.getRemovedAt()).toBeNull();

      jest.useRealTimers();
    });

    test('should create product with custom parameters when input optional args are set', async () => {
      const productOwnerId: string = randomUUID();
      const productOwnerName: string = randomUUID();

      const imageId: string = randomUUID();
      const relativePath: string = '/relative/path';

      const customId: string = randomUUID();
      const customCreatedAt: Date = new Date(Date.now() - 30000);
      const customUpdatedAt: Date = new Date(Date.now() - 15000);
      const customRemovedAt: Date = new Date(Date.now() - 5000);

      const createProductEntityPayload: CreateProductEntityPayload = {
        owner: await ProductOwner.new(productOwnerId, productOwnerName),
        name: 'Product Name',
        description: 'Product description',
        quantity: await Quantity.new(10),
        category: ProductCategory.House,
        image: await ProductImage.new(imageId, relativePath),
        id: customId,
        createdAt: customCreatedAt,
        updatedAt: customUpdatedAt,
        removedAt: customRemovedAt,
      };

      const product: Product = await Product.new(createProductEntityPayload);

      expect(product.getId()).toBe(customId);
      expect(product.getName()).toBe(createProductEntityPayload.name);
      expect(product.getDescription()).toBe(createProductEntityPayload.description);
      expect(product.getCategory()).toBe(createProductEntityPayload.category);
      expect(product.getQuantity().getValue()).toBe(createProductEntityPayload.quantity.getValue());
      expect(product.getOwner().getId()).toBe(productOwnerId);
      expect(product.getOwner().getName()).toBe(productOwnerName);
      expect(product.getImage()!.getId()).toBe(imageId);
      expect(product.getImage()!.getRelativePath()).toBe(relativePath);
      expect(product.getCreatedAt()).toBe(customCreatedAt);
      expect(product.getUpdatedAt()).toBe(customUpdatedAt);
      expect(product.getRemovedAt()).toBe(customRemovedAt);

      jest.useRealTimers();
    });
  });

  describe('remove', () => {
    test('should marks product as removed', async () => {
      jest.useFakeTimers();

      const currentDate: number = Date.now();

      const productOwnerId: string = randomUUID();
      const productOwnerName: string = randomUUID();

      const product: Product = await Product.new({
        owner: await ProductOwner.new(productOwnerId, productOwnerName),
        name: 'Product Name',
        description: 'Product Description',
        category: ProductCategory.Clothing,
        quantity: await Quantity.new(10),
      });

      await product.remove();

      expect(product.getRemovedAt()!.getTime()).toBe(currentDate);

      jest.useRealTimers();
    });
  });
});

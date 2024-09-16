import { Code } from '@core/common/code/code';
import { ProductCategory } from '@core/common/enums/product-enums';
import { Exception } from '@core/common/exception/exception';
import { ClassValidationDetails } from '@core/common/util/class-validator/class-validator';
import { Product } from '@core/domain/product/entity/product';
import { ProductOwner } from '@core/domain/product/entity/product-owner';
import { ProductRepositoryPort } from '@core/domain/product/port/persistence/product-repository-port';
import { Quantity } from '@core/domain/product/value-object/quantity';
import { RemoveProductPort } from '@core/features/product/remove-product/port/remove-product-port';
import { RemoveProductService } from '@core/features/product/remove-product/remove-product-service';
import { RemoveProductUseCase } from '@core/features/product/remove-product/usecase/remove-product-usecase';
import { createMock } from '@golevelup/ts-jest';
import { randomUUID } from 'crypto';

async function createProduct(): Promise<Product> {
  return Product.new({
    owner: await ProductOwner.new(randomUUID(), randomUUID()),
    name: 'Product name',
    description: 'Product description',
    category: ProductCategory.House,
    quantity: await Quantity.new(10),
  });
}

describe('RemoveProductService', () => {
  const productRepository: ProductRepositoryPort = createMock<ProductRepositoryPort>();
  const removeProductService: RemoveProductUseCase = new RemoveProductService(productRepository);

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('execute', () => {
    test('should remove product', async () => {
      const mockProduct: Product = await createProduct();

      jest.spyOn(productRepository, 'findProduct').mockResolvedValue(mockProduct);
      jest.spyOn(productRepository, 'removeProduct').mockResolvedValue();

      const removeProductPort: RemoveProductPort = {
        executorId: mockProduct.getOwner().getId(),
        productId: mockProduct.getId(),
      };
      await removeProductService.execute(removeProductPort);

      const removedProduct: Product = jest.spyOn(productRepository, 'removeProduct').mock.calls[0][0];

      expect(removedProduct).toEqual(mockProduct);
    });

    test('should throw Exception when product not found', async () => {
      jest.spyOn(productRepository, 'findProduct').mockResolvedValue(null);

      try {
        const removeProductPort: RemoveProductPort = {
          executorId: randomUUID(),
          productId: randomUUID(),
        };
        await removeProductService.execute(removeProductPort);
      } catch (e) {
        const exception: Exception<ClassValidationDetails> = e as Exception<ClassValidationDetails>;

        expect(exception).toBeInstanceOf(Exception);
        expect(exception.code).toBe(Code.ENTITY_NOT_FOUND_ERROR.code);
      }
    });

    test('should throw Exception when user is not woner of the product', async () => {
      const mockProduct: Product = await createProduct();
      const executorId: string = randomUUID();

      jest.spyOn(productRepository, 'findProduct').mockResolvedValue(mockProduct);

      try {
        const removeProductPort: RemoveProductPort = {
          executorId: executorId,
          productId: mockProduct.getId(),
        };
        await removeProductService.execute(removeProductPort);
      } catch (e) {
        const exception: Exception<ClassValidationDetails> = e as Exception<ClassValidationDetails>;

        expect(exception).toBeInstanceOf(Exception);
        expect(exception.code).toBe(Code.ACCESS_DENIED_ERROR.code);
      }
    });
  });
});

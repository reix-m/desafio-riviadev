import { Code } from '@core/common/code/code';
import { ProductCategory } from '@core/common/enums/product-enums';
import { Exception } from '@core/common/exception/exception';
import { ClassValidationDetails } from '@core/common/util/class-validator/class-validator';
import { Product } from '@core/domain/product/entity/product';
import { ProductOwner } from '@core/domain/product/entity/product-owner';
import { ProductRepositoryPort } from '@core/domain/product/port/persistence/product-repository-port';
import { ProductUseCaseResponseDto } from '@core/domain/product/usecase/dto/product-usecase-response-dto';
import { Quantity } from '@core/domain/product/value-object/quantity';
import { GetProductService } from '@core/features/product/get-product/get-product-service';
import { GetProductPort } from '@core/features/product/get-product/port/get-product-port';
import { GetProductUseCase } from '@core/features/product/get-product/usecase/get-product-usecase';
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

describe('GetProductService', () => {
  const productRepository: ProductRepositoryPort = createMock<ProductRepositoryPort>();
  const getProductService: GetProductUseCase = new GetProductService(productRepository);

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('execute', () => {
    test('should return product', async () => {
      const mockProduct: Product = await createProduct();

      jest.spyOn(productRepository, 'findProduct').mockResolvedValue(mockProduct);

      const expectedProductUseCaseDto: ProductUseCaseResponseDto =
        ProductUseCaseResponseDto.newFromProduct(mockProduct);

      const getProductPort: GetProductPort = { productId: mockProduct.getId() };
      const resultProductUseCaseDto: ProductUseCaseResponseDto = await getProductService.execute(getProductPort);

      expect(resultProductUseCaseDto).toEqual(expectedProductUseCaseDto);
    });

    test('should throw Exception when product not found', async () => {
      jest.spyOn(productRepository, 'findProduct').mockResolvedValue(null);

      try {
        const getProductPort: GetProductPort = {
          productId: randomUUID(),
        };
        await getProductService.execute(getProductPort);
      } catch (e) {
        const exception: Exception<ClassValidationDetails> = e as Exception<ClassValidationDetails>;

        expect(exception).toBeInstanceOf(Exception);
        expect(exception.code).toBe(Code.ENTITY_NOT_FOUND_ERROR.code);
      }
    });
  });
});

import { ProductCategory } from '@core/common/enums/product-enums';
import { Product } from '@core/domain/product/entity/product';
import { ProductOwner } from '@core/domain/product/entity/product-owner';
import { ProductRepositoryPort } from '@core/domain/product/port/persistence/product-repository-port';
import { ProductUseCaseResponseDto } from '@core/domain/product/usecase/dto/product-usecase-response-dto';
import { Quantity } from '@core/domain/product/value-object/quantity';
import { GetProductListService } from '@core/features/product/get-product-list/get-product-list-service';
import { GetProductListPort } from '@core/features/product/get-product-list/port/get-product-list-port';
import { GetProductListUseCase } from '@core/features/product/get-product-list/usecase/get-product-list-usecase';
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

describe('GetProductListService', () => {
  const productRepository: ProductRepositoryPort = createMock<ProductRepositoryPort>();
  const getProductListService: GetProductListUseCase = new GetProductListService(productRepository);

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('execute', () => {
    test('should return list of products', async () => {
      const mockProduct: Product = await createProduct();

      jest.spyOn(productRepository, 'findProducts').mockResolvedValue([mockProduct]);

      const expectedProductUseCaseDto: ProductUseCaseResponseDto =
        ProductUseCaseResponseDto.newFromProduct(mockProduct);

      const getProductListPort: GetProductListPort = {};
      const [resultProductUseCaseDto]: ProductUseCaseResponseDto[] =
        await getProductListService.execute(getProductListPort);

      expect(resultProductUseCaseDto).toEqual(expectedProductUseCaseDto);
    });
  });
});

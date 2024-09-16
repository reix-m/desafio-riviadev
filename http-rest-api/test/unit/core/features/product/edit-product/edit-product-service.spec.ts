import { Code } from '@core/common/code/code';
import { MediaType } from '@core/common/enums/media-enums';
import { ProductCategory } from '@core/common/enums/product-enums';
import { Exception } from '@core/common/exception/exception';
import { QueryBusPort } from '@core/common/port/message/query-bus-port';
import { ClassValidationDetails } from '@core/common/util/class-validator/class-validator';
import { Product } from '@core/domain/product/entity/product';
import { ProductImage } from '@core/domain/product/entity/product-image';
import { ProductOwner } from '@core/domain/product/entity/product-owner';
import { ProductRepositoryPort } from '@core/domain/product/port/persistence/product-repository-port';
import { ProductUseCaseResponseDto } from '@core/domain/product/usecase/dto/product-usecase-response-dto';
import { Quantity } from '@core/domain/product/value-object/quantity';
import { GetMediaPreviewQueryResult } from '@core/features/media/get-media-preview-query/result/get-media-preview-query-result';
import { EditProductService } from '@core/features/product/edit-product/edit-product-service';
import { EditProductPort } from '@core/features/product/edit-product/port/edit-product-port';
import { EditProductUseCase } from '@core/features/product/edit-product/usecase/edit-product-usecase';
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

async function createProductImage(customId?: string, customRelativePath?: string): Promise<ProductImage> {
  const id: string = customId || randomUUID();
  const relativePath: string = customRelativePath || '/relative/path';

  return ProductImage.new(id, relativePath);
}

function createProductImagePreview(): GetMediaPreviewQueryResult {
  const id: string = randomUUID();
  const relativePath: string = '/relative/path';

  return GetMediaPreviewQueryResult.new(id, MediaType.Image, relativePath);
}

describe('EditProductService', () => {
  const queryBus: QueryBusPort = createMock<QueryBusPort>();
  const productRepository: ProductRepositoryPort = createMock<ProductRepositoryPort>();
  const editProductService: EditProductUseCase = new EditProductService(productRepository, queryBus);

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('execute', () => {
    test('should edit product and updates record in repository', async () => {
      const mockProduct: Product = await createProduct();
      const mockProductImagePreview: GetMediaPreviewQueryResult = createProductImagePreview();

      jest.spyOn(productRepository, 'findProduct').mockResolvedValue(mockProduct);
      jest.spyOn(queryBus, 'sendQuery').mockResolvedValueOnce(mockProductImagePreview);
      jest.spyOn(productRepository, 'updateProduct').mockResolvedValue();

      const editProductPort: EditProductPort = {
        executorId: mockProduct.getOwner().getId(),
        productId: mockProduct.getId(),
        name: randomUUID(),
        imageId: mockProductImagePreview.id,
        description: randomUUID(),
        category: ProductCategory.Clothing,
        quantity: 10,
      };

      const expectedProduct: Product = await Product.new({
        id: mockProduct.getId(),
        owner: mockProduct.getOwner(),
        name: editProductPort.name!,
        description: editProductPort.description!,
        quantity: await Quantity.new(editProductPort.quantity!),
        category: editProductPort.category!,
        image: await createProductImage(mockProductImagePreview.id, mockProductImagePreview.relativePath),
        createdAt: mockProduct.getCreatedAt(),
      });

      const expectedProductUseCaseDto: ProductUseCaseResponseDto =
        ProductUseCaseResponseDto.newFromProduct(expectedProduct);

      const resultProductUseCaseDto: ProductUseCaseResponseDto = await editProductService.execute(editProductPort);

      expect(resultProductUseCaseDto.updatedAt).toBe(mockProduct.getUpdatedAt()!.getTime());

      expect(resultProductUseCaseDto).toEqual({
        ...expectedProductUseCaseDto,
        updatedAt: resultProductUseCaseDto.updatedAt,
      });
    });

    test('should throw Exception when product not found', async () => {
      jest.spyOn(productRepository, 'findProduct').mockResolvedValue(null);

      try {
        const editProductPort: EditProductPort = {
          executorId: randomUUID(),
          productId: randomUUID(),
          name: randomUUID(),
          description: randomUUID(),
          category: ProductCategory.Clothing,
          quantity: 10,
        };

        await editProductService.execute(editProductPort);
      } catch (e) {
        const exception: Exception<ClassValidationDetails> = e as Exception<ClassValidationDetails>;

        expect(exception).toBeInstanceOf(Exception);
        expect(exception.code).toBe(Code.ENTITY_NOT_FOUND_ERROR.code);
        expect(exception.message).toBe('Product not found.');
      }
    });

    test('should throw Exception when image not found', async () => {
      const mockProduct: Product = await createProduct();
      const mockProductImagePreview: GetMediaPreviewQueryResult = createProductImagePreview();

      jest.spyOn(productRepository, 'findProduct').mockResolvedValue(mockProduct);
      jest.spyOn(queryBus, 'sendQuery').mockResolvedValue(null);

      try {
        const editProductPort: EditProductPort = {
          executorId: mockProduct.getOwner().getId(),
          productId: randomUUID(),
          name: randomUUID(),
          description: randomUUID(),
          category: ProductCategory.Clothing,
          quantity: 10,
          imageId: mockProductImagePreview.id,
        };

        await editProductService.execute(editProductPort);
      } catch (e) {
        const exception: Exception<ClassValidationDetails> = e as Exception<ClassValidationDetails>;

        expect(exception).toBeInstanceOf(Exception);
        expect(exception.code).toBe(Code.ENTITY_NOT_FOUND_ERROR.code);
        expect(exception.message).toBe('Product image not found.');
      }
    });

    test('should throw Exception when user is not the owner of product', async () => {
      const mockProduct: Product = await createProduct();
      const executorId: string = randomUUID();

      jest.spyOn(productRepository, 'findProduct').mockResolvedValue(mockProduct);

      try {
        const editProductPort: EditProductPort = {
          executorId: executorId,
          productId: mockProduct.getId(),
          name: randomUUID(),
          description: randomUUID(),
          category: ProductCategory.Clothing,
          quantity: 10,
        };

        await editProductService.execute(editProductPort);
      } catch (e) {
        const exception: Exception<ClassValidationDetails> = e as Exception<ClassValidationDetails>;

        expect(exception).toBeInstanceOf(Exception);
        expect(exception.code).toBe(Code.ACCESS_DENIED_ERROR.code);
      }
    });
  });
});

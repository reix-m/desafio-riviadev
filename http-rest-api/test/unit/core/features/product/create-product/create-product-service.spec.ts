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
import { CreateProductService } from '@core/features/product/create-product/create-product-service';
import { CreateProductPort } from '@core/features/product/create-product/port/create-product-port';
import { CreateProductUseCase } from '@core/features/product/create-product/usecase/create-product-usecase';
import { GetUserPreviewQueryResult } from '@core/features/user/get-user-preview-query/result/get-user-preview-query-result';
import { createMock } from '@golevelup/ts-jest';
import { randomUUID } from 'crypto';

async function createProductOwner(customId?: string, customName?: string): Promise<ProductOwner> {
  const id: string = customId || randomUUID();
  const name: string = customName || randomUUID();

  return ProductOwner.new(id, name);
}

function createProductOwnerPreview(): GetUserPreviewQueryResult {
  const id: string = randomUUID();
  const name: string = randomUUID();

  return GetUserPreviewQueryResult.new(id, name);
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

describe('CreateProductService', () => {
  const productRepository: ProductRepositoryPort = createMock<ProductRepositoryPort>();
  const queryBus: QueryBusPort = createMock<QueryBusPort>();
  const createProductService: CreateProductUseCase = new CreateProductService(productRepository, queryBus);

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('execute', () => {
    test('should create product', async () => {
      jest.useFakeTimers();

      const mockProductId: string = randomUUID();

      const mockProductOwnerPreview: GetUserPreviewQueryResult = createProductOwnerPreview();
      const mockProductImagePreview: GetMediaPreviewQueryResult = createProductImagePreview();

      jest
        .spyOn(queryBus, 'sendQuery')
        .mockResolvedValueOnce(mockProductOwnerPreview)
        .mockResolvedValueOnce(mockProductImagePreview);
      jest.spyOn(productRepository, 'addProduct').mockResolvedValue({ id: mockProductId });

      const createProductPort: CreateProductPort = {
        executorId: randomUUID(),
        name: randomUUID(),
        description: randomUUID(),
        category: ProductCategory.Clothing,
        quantity: 10,
        imageId: mockProductImagePreview.id,
      };

      const expectedProduct: Product = await Product.new({
        id: mockProductId,
        owner: await createProductOwner(mockProductOwnerPreview.id, mockProductOwnerPreview.name),
        name: createProductPort.name,
        description: createProductPort.description,
        quantity: await Quantity.new(createProductPort.quantity),
        category: createProductPort.category,
        image: await createProductImage(mockProductImagePreview.id, mockProductImagePreview.relativePath),
      });

      const expectedProductUseCaseDto: ProductUseCaseResponseDto =
        ProductUseCaseResponseDto.newFromProduct(expectedProduct);

      const resultProductUseCaseDto: ProductUseCaseResponseDto = await createProductService.execute(createProductPort);
      resultProductUseCaseDto.id = expectedProductUseCaseDto.id;

      expect(resultProductUseCaseDto).toEqual(expectedProductUseCaseDto);

      jest.useRealTimers();
    });

    test('should throw Exception when owner not found', async () => {
      jest.spyOn(queryBus, 'sendQuery').mockResolvedValue(null);

      try {
        const createProductPort: CreateProductPort = {
          executorId: randomUUID(),
          name: randomUUID(),
          description: randomUUID(),
          category: ProductCategory.Clothing,
          quantity: 10,
        };
        await createProductService.execute(createProductPort);
      } catch (e) {
        const exception: Exception<ClassValidationDetails> = e as Exception<ClassValidationDetails>;

        expect(exception).toBeInstanceOf(Exception);
        expect(exception.code).toBe(Code.ENTITY_NOT_FOUND_ERROR.code);
        expect(exception.message).toBe('Product owner not found.');
      }
    });

    test('should throw Exception when image not found', async () => {
      const mockProductOwnerPreview: GetUserPreviewQueryResult = createProductOwnerPreview();

      jest.spyOn(queryBus, 'sendQuery').mockResolvedValueOnce(mockProductOwnerPreview).mockResolvedValueOnce(null);

      try {
        const createProductPort: CreateProductPort = {
          executorId: randomUUID(),
          name: randomUUID(),
          description: randomUUID(),
          category: ProductCategory.Clothing,
          quantity: 10,
        };
        await createProductService.execute(createProductPort);
      } catch (e) {
        const exception: Exception<ClassValidationDetails> = e as Exception<ClassValidationDetails>;

        expect(exception).toBeInstanceOf(Exception);
        expect(exception.code).toBe(Code.ENTITY_NOT_FOUND_ERROR.code);
        expect(exception.message).toBe('Product image not found.');
      }
    });
  });
});

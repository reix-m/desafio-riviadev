import { Code } from '@core/common/code/code';
import { Exception } from '@core/common/exception/exception';
import { GetUserPreviewQuery } from '@core/features/user/get-user-preview-query/query/get-user-preview-query';
import { GetUserPreviewQueryResult } from '@core/features/user/get-user-preview-query/result/get-user-preview-query-result';
import { QueryBusPort } from '@core/common/port/message/query-bus-port';
import { Optional } from '@core/common/type/common-types';
import { CoreAssert } from '@core/common/util/assert/core-assert';
import { Product } from '@core/domain/product/entity/product';
import { ProductImage } from '@core/domain/product/entity/product-image';
import { ProductOwner } from '@core/domain/product/entity/product-owner';
import { ProductRepositoryPort } from '@core/domain/product/port/persistence/product-repository-port';
import { ProductUseCaseResponseDto } from '@core/domain/product/usecase/dto/product-usecase-response-dto';
import { Quantity } from '@core/domain/product/value-object/quantity';
import { CreateProductPort } from '@core/features/product/create-product/port/create-product-port';
import { CreateProductUseCase } from '@core/features/product/create-product/usecase/create-product-usecase';
import { GetMediaPreviewQuery } from '@core/features/media/get-media-preview-query/query/get-media-preview-query';
import { GetMediaPreviewQueryResult } from '@core/features/media/get-media-preview-query/result/get-media-preview-query-result';

export class CreateProductService implements CreateProductUseCase {
  constructor(
    private readonly productRepository: ProductRepositoryPort,
    private readonly queryBus: QueryBusPort
  ) {}

  public async execute(payload: CreateProductPort): Promise<ProductUseCaseResponseDto> {
    const productOwner: GetUserPreviewQueryResult = CoreAssert.notEmpty(
      await this.queryBus.sendQuery(GetUserPreviewQuery.new({ id: payload.executorId })),
      Exception.new({ code: Code.ENTITY_NOT_FOUND_ERROR, overrideMessage: 'Product owner not found.' })
    );

    const productImage: Optional<GetMediaPreviewQueryResult> = payload.imageId
      ? await this.queryBus.sendQuery(GetMediaPreviewQuery.new({ id: payload.imageId, ownerId: payload.executorId }))
      : undefined;

    const imageNotFound: boolean = !!(!productImage && payload?.imageId);
    CoreAssert.isFalse(
      imageNotFound,
      Exception.new({ code: Code.ENTITY_NOT_FOUND_ERROR, overrideMessage: 'Product image not found.' })
    );

    const product: Product = await Product.new({
      owner: await ProductOwner.new(productOwner.id, productOwner.name),
      image: productImage ? await ProductImage.new(productImage.id, productImage?.relativePath) : null,
      name: payload.name,
      description: payload.description,
      category: payload.category,
      quantity: await Quantity.new(payload.quantity),
    });

    await this.productRepository.addProduct(product);

    return ProductUseCaseResponseDto.newFromProduct(product);
  }
}

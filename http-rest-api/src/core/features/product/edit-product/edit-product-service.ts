import { Code } from '@core/common/code/code';
import { Exception } from '@core/common/exception/exception';
import { QueryBusPort } from '@core/common/port/message/query-bus-port';
import { Nullable } from '@core/common/type/common-types';
import { CoreAssert } from '@core/common/util/assert/core-assert';
import { Product } from '@core/domain/product/entity/product';
import { ProductImage } from '@core/domain/product/entity/product-image';
import { ProductRepositoryPort } from '@core/domain/product/port/persistence/product-repository-port';
import { ProductUseCaseResponseDto } from '@core/domain/product/usecase/dto/product-usecase-response-dto';
import { Quantity } from '@core/domain/product/value-object/quantity';
import { GetMediaPreviewQuery } from '@core/features/media/get-media-preview-query/query/get-media-preview-query';
import { GetMediaPreviewQueryResult } from '@core/features/media/get-media-preview-query/result/get-media-preview-query-result';
import { EditProductPort } from '@core/features/product/edit-product/port/edit-product-port';
import { EditProductUseCase } from '@core/features/product/edit-product/usecase/edit-product-usecase';

export class EditProductService implements EditProductUseCase {
  constructor(
    private readonly productRepository: ProductRepositoryPort,
    private readonly queryBus: QueryBusPort
  ) {}

  public async execute(payload: EditProductPort): Promise<ProductUseCaseResponseDto> {
    const product: Product = CoreAssert.notEmpty(
      await this.productRepository.findProduct({ id: payload.productId }),
      Exception.new({ code: Code.ENTITY_NOT_FOUND_ERROR, overrideMessage: 'Product not found.' })
    );

    const hasAccess: boolean = payload.executorId === product.getOwner().getId();
    CoreAssert.isTrue(hasAccess, Exception.new({ code: Code.ACCESS_DENIED_ERROR }));

    await product.edit({
      name: payload.name,
      image: await this.defineNewImage(payload, product),
      description: payload.description,
      category: payload.category,
      quantity: payload?.quantity ? await Quantity.new(payload.quantity) : undefined,
    });

    await this.productRepository.updateProduct(product);

    return ProductUseCaseResponseDto.newFromProduct(product);
  }

  private async defineNewImage(payload: EditProductPort, product: Product): Promise<Nullable<ProductImage>> {
    let newProductImage: Nullable<ProductImage> = null;

    const needUpdateImage: boolean = !!(payload.imageId && payload.imageId !== product.getImage()?.getId());
    const needResetImage: boolean = payload.imageId === null;

    if (needUpdateImage) {
      const query: GetMediaPreviewQuery = GetMediaPreviewQuery.new({
        id: payload.imageId,
        ownerId: payload.executorId,
      });
      const exception: Exception<void> = Exception.new({
        code: Code.ENTITY_NOT_FOUND_ERROR,
        overrideMessage: 'Product image not found.',
      });
      const productImage: GetMediaPreviewQueryResult = CoreAssert.notEmpty(
        await this.queryBus.sendQuery(query),
        exception
      );

      newProductImage = await ProductImage.new(productImage.id, productImage.relativePath);
    }

    if (needResetImage) {
      newProductImage = null;
    }

    return newProductImage;
  }
}

import { Code } from '@core/common/code/code';
import { Exception } from '@core/common/exception/exception';
import { CoreAssert } from '@core/common/util/assert/core-assert';
import { Product } from '@core/domain/product/entity/product';
import { ProductRepositoryPort } from '@core/domain/product/port/persistence/product-repository-port';
import { ProductUseCaseResponseDto } from '@core/domain/product/usecase/dto/product-usecase-response-dto';
import { GetProductPort } from '@core/features/product/get-product/port/get-product-port';
import { GetProductUseCase } from '@core/features/product/get-product/usecase/get-product-usecase';

export class GetProductService implements GetProductUseCase {
  constructor(private readonly productRepository: ProductRepositoryPort) {}

  public async execute(payload: GetProductPort): Promise<ProductUseCaseResponseDto> {
    const product: Product = CoreAssert.notEmpty(
      await this.productRepository.findProduct({ id: payload.productId }),
      Exception.new({ code: Code.ENTITY_NOT_FOUND_ERROR, overrideMessage: 'Product not found.' })
    );

    return ProductUseCaseResponseDto.newFromProduct(product);
  }
}

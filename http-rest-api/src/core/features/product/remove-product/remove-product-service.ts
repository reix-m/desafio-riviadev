import { Code } from '@core/common/code/code';
import { Exception } from '@core/common/exception/exception';
import { CoreAssert } from '@core/common/util/assert/core-assert';
import { Product } from '@core/domain/product/entity/product';
import { ProductRepositoryPort } from '@core/domain/product/port/persistence/product-repository-port';
import { RemoveProductPort } from '@core/features/product/remove-product/port/remove-product-port';
import { RemoveProductUseCase } from '@core/features/product/remove-product/usecase/remove-product-usecase';

export class RemoveProductService implements RemoveProductUseCase {
  constructor(private readonly productRepository: ProductRepositoryPort) {}

  public async execute(payload: RemoveProductPort): Promise<void> {
    const product: Product = CoreAssert.notEmpty(
      await this.productRepository.findProduct({ id: payload.productId }),
      Exception.new({ code: Code.ENTITY_NOT_FOUND_ERROR, overrideMessage: 'Product not found.' })
    );

    const hasAccess: boolean = payload.executorId === product.getOwner().getId();
    CoreAssert.isTrue(hasAccess, Exception.new({ code: Code.ACCESS_DENIED_ERROR }));

    await this.productRepository.removeProduct(product);
  }
}

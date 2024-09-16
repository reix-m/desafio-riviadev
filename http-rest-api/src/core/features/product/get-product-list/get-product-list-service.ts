import { Product } from '@core/domain/product/entity/product';
import { ProductRepositoryPort } from '@core/domain/product/port/persistence/product-repository-port';
import { ProductUseCaseResponseDto } from '@core/domain/product/usecase/dto/product-usecase-response-dto';
import { GetProductListPort } from '@core/features/product/get-product-list/port/get-product-list-port';
import { GetProductListUseCase } from '@core/features/product/get-product-list/usecase/get-product-list-usecase';

export class GetProductListService implements GetProductListUseCase {
  constructor(private readonly productRepository: ProductRepositoryPort) {}

  public async execute(payload: GetProductListPort): Promise<ProductUseCaseResponseDto[]> {
    const products: Product[] = await this.productRepository.findProducts(
      {
        ownerId: payload.ownerId,
        category: payload.category,
      },
      { offset: payload?.offset, limit: payload?.limit }
    );

    return ProductUseCaseResponseDto.newListFromProducts(products);
  }
}

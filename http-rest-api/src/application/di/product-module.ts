import { ProductController } from '@application/api/http-rest/controller/product-controller';
import { CoreDITokens } from '@core/common/di/core-di-tokens';
import { ProductDITokens } from '@core/domain/product/di/product-di-tokens';
import { CreateProductService } from '@core/features/product/create-product/create-product-service';
import { CreateProductUseCase } from '@core/features/product/create-product/usecase/create-product-usecase';
import { TypeOrmProductRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/product/typeorm-product-repository-adapter';
import { TransactionalUseCaseWrapper } from '@infrastructure/transactional/transactional-usecase-wrapper';
import { Module, Provider } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

const persistenceProviders: Provider[] = [
  {
    provide: ProductDITokens.ProductRepository,
    useFactory: (dataSource: DataSource) => new TypeOrmProductRepositoryAdapter(dataSource),
    inject: [getDataSourceToken()],
  },
];

const useCaseProviders: Provider[] = [
  {
    provide: ProductDITokens.CreateProductUseCase,
    useFactory: (productRepository, queryBus) => {
      const service: CreateProductUseCase = new CreateProductService(productRepository, queryBus);
      return new TransactionalUseCaseWrapper(service);
    },
    inject: [ProductDITokens.ProductRepository, CoreDITokens.QueryBus],
  },
];

@Module({
  controllers: [ProductController],
  providers: [...persistenceProviders, ...useCaseProviders],
})
export class ProductModule {}

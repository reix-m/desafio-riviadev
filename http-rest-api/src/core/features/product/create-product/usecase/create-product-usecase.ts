import { TransactionalUseCase } from '@core/common/usecase/transactional-usecase';
import { ProductUseCaseResponseDto } from '@core/domain/product/usecase/dto/product-usecase-response-dto';
import { CreateProductPort } from '@core/features/product/create-product/port/create-product-port';

export type CreateProductUseCase = TransactionalUseCase<CreateProductPort, ProductUseCaseResponseDto>;

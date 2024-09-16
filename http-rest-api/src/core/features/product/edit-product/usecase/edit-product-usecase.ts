import { TransactionalUseCase } from '@core/common/usecase/transactional-usecase';
import { ProductUseCaseResponseDto } from '@core/domain/product/usecase/dto/product-usecase-response-dto';
import { EditProductPort } from '@core/features/product/edit-product/port/edit-product-port';

export type EditProductUseCase = TransactionalUseCase<EditProductPort, ProductUseCaseResponseDto>;

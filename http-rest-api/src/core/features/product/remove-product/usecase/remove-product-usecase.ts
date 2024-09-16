import { TransactionalUseCase } from '@core/common/usecase/transactional-usecase';
import { RemoveProductPort } from '@core/features/product/remove-product/port/remove-product-port';

export type RemoveProductUseCase = TransactionalUseCase<RemoveProductPort, void>;

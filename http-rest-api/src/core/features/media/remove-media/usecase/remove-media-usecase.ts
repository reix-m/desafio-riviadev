import { TransactionalUseCase } from '@core/common/usecase/transactional-usecase';
import { RemoveMediaPort } from '@core/features/media/remove-media/port/remove-media-port';

export type RemoveMediaUseCase = TransactionalUseCase<RemoveMediaPort, void>;

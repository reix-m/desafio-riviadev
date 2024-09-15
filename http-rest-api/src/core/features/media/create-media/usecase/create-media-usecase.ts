import { TransactionalUseCase } from '@core/common/usecase/transactional-usecase';
import { MediaUseCaseResponseDto } from '@core/domain/media/usecase/dto/media-usecase-response-dto';
import { CreateMediaPort } from '@core/features/media/create-media/port/create-media-port';

export type CreateMediaUseCase = TransactionalUseCase<CreateMediaPort, MediaUseCaseResponseDto>;

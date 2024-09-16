import { TransactionalUseCase } from '@core/common/usecase/transactional-usecase';
import { MediaUseCaseResponseDto } from '@core/domain/media/usecase/dto/media-usecase-response-dto';
import { EditMediaPort } from '@core/features/media/edit-media/port/edit-media-port';

export type EditMediaUseCase = TransactionalUseCase<EditMediaPort, MediaUseCaseResponseDto>;

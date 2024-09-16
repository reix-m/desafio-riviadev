import { UseCase } from '@core/common/usecase/usecase';
import { MediaUseCaseResponseDto } from '@core/domain/media/usecase/dto/media-usecase-response-dto';
import { GetMediaPort } from '@core/features/media/get-media/port/get-media-port';

export type GetMediaUseCase = UseCase<GetMediaPort, MediaUseCaseResponseDto>;

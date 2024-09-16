import { UseCase } from '@core/common/usecase/usecase';
import { MediaUseCaseResponseDto } from '@core/domain/media/usecase/dto/media-usecase-response-dto';
import { GetMediaListPort } from '@core/features/media/get-media-list/port/get-media-lista-port';

export type GetMediaListUseCase = UseCase<GetMediaListPort, MediaUseCaseResponseDto[]>;

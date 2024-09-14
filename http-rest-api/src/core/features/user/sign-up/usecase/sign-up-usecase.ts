import { UseCase } from '@core/common/usecase/usecase';
import { UserUseCaseResponseDto } from '@core/domain/user/usecase/dto/user-usecase-response-dto';
import { SignUpPort } from '@core/features/user/sign-up/port/sign-up-port';

export type SignUpUseCase = UseCase<SignUpPort, UserUseCaseResponseDto>;

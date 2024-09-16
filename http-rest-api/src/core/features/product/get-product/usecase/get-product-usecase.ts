import { UseCase } from '@core/common/usecase/usecase';
import { ProductUseCaseResponseDto } from '@core/domain/product/usecase/dto/product-usecase-response-dto';
import { GetProductPort } from '@core/features/product/get-product/port/get-product-port';

export type GetProductUseCase = UseCase<GetProductPort, ProductUseCaseResponseDto>;

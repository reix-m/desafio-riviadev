import { UseCase } from '@core/common/usecase/usecase';
import { ProductUseCaseResponseDto } from '@core/domain/product/usecase/dto/product-usecase-response-dto';
import { GetProductListPort } from '@core/features/product/get-product-list/port/get-product-list-port';

export type GetProductListUseCase = UseCase<GetProductListPort, ProductUseCaseResponseDto[]>;

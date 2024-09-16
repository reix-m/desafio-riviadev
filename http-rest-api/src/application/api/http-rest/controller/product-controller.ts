import { HttpAuth } from '@application/api/http-rest/auth/decorator/http-auth';
import { HttpUser } from '@application/api/http-rest/auth/decorator/http-user';
import { HttpUserPayload } from '@application/api/http-rest/auth/type/http-auth-types';
import { HttpRestApiModelCreateProductBody } from '@application/api/http-rest/controller/documentation/product/http-rest-api-model-create-product-body';
import { HttpRestApiResponseProduct } from '@application/api/http-rest/controller/documentation/product/http-rest-api-response-product';
import { CoreApiResponse } from '@core/common/api/core-api-response';
import { Code } from '@core/common/code/code';
import { ProductDITokens } from '@core/domain/product/di/product-di-tokens';
import { ProductUseCaseResponseDto } from '@core/domain/product/usecase/dto/product-usecase-response-dto';
import { CreateProductUseCase } from '@core/features/product/create-product/usecase/create-product-usecase';
import { CreateProductAdapter } from '@infrastructure/adapter/usecase/product/create-product-adapter';
import { FileStorageConfig } from '@infrastructure/config/file-storage-config';
import { Body, Controller, HttpCode, HttpStatus, Inject, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { resolve } from 'url';

@Controller('products')
@ApiTags('products')
export class ProductController {
  constructor(
    @Inject(ProductDITokens.CreateProductUseCase) private readonly createProductUseCase: CreateProductUseCase
  ) {}

  @Post()
  @HttpAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiBody({ type: HttpRestApiModelCreateProductBody })
  @ApiResponse({ status: HttpStatus.CREATED, type: HttpRestApiResponseProduct })
  public async createProduct(
    @HttpUser() user: HttpUserPayload,
    @Body() body: HttpRestApiModelCreateProductBody
  ): Promise<CoreApiResponse<ProductUseCaseResponseDto>> {
    const adapter: CreateProductAdapter = await CreateProductAdapter.new({
      executorId: user.id,
      name: body.name,
      description: body.description,
      imageId: body.imageId,
      category: body.category,
      quantity: body.quantity,
    });

    const createdProduct: ProductUseCaseResponseDto = await this.createProductUseCase.execute(adapter);
    this.setFileStorageBasePath([createdProduct]);

    return CoreApiResponse.success(Code.CREATED.code, createdProduct, Code.CREATED.message);
  }

  private setFileStorageBasePath(products: ProductUseCaseResponseDto[]): void {
    products.forEach((product: ProductUseCaseResponseDto) => {
      if (product.image) {
        product.image.url = resolve(FileStorageConfig.BasePath, product.image.url);
      }
    });
  }
}

import { HttpAuth } from '@application/api/http-rest/auth/decorator/http-auth';
import { HttpUser } from '@application/api/http-rest/auth/decorator/http-user';
import { HttpUserPayload } from '@application/api/http-rest/auth/type/http-auth-types';
import { HttpRestApiModelCreateProductBody } from '@application/api/http-rest/controller/documentation/product/http-rest-api-model-create-product-body';
import { HttpRestApiModelEditProductBody } from '@application/api/http-rest/controller/documentation/product/http-rest-api-model-edit-product-body';
import { HttpRestApiResponseProduct } from '@application/api/http-rest/controller/documentation/product/http-rest-api-response-product';
import { CoreApiResponse } from '@core/common/api/core-api-response';
import { Code } from '@core/common/code/code';
import { ProductDITokens } from '@core/domain/product/di/product-di-tokens';
import { ProductUseCaseResponseDto } from '@core/domain/product/usecase/dto/product-usecase-response-dto';
import { CreateProductUseCase } from '@core/features/product/create-product/usecase/create-product-usecase';
import { EditProductUseCase } from '@core/features/product/edit-product/usecase/edit-product-usecase';
import { CreateProductAdapter } from '@infrastructure/adapter/usecase/product/create-product-adapter';
import { EditProductAdapter } from '@infrastructure/adapter/usecase/product/edit-product-adapter';
import { FileStorageConfig } from '@infrastructure/config/file-storage-config';
import { Body, Controller, HttpCode, HttpStatus, Inject, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { resolve } from 'url';

@Controller('products')
@ApiTags('products')
export class ProductController {
  constructor(
    @Inject(ProductDITokens.CreateProductUseCase) private readonly createProductUseCase: CreateProductUseCase,
    @Inject(ProductDITokens.EditProductUseCase) private readonly editProductUseCase: EditProductUseCase
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

  @Put(':productId')
  @HttpAuth()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiBody({ type: HttpRestApiModelEditProductBody })
  @ApiResponse({ status: HttpStatus.OK, type: HttpRestApiResponseProduct })
  public async editProduct(
    @HttpUser() user: HttpUserPayload,
    @Body() body: HttpRestApiModelEditProductBody,
    @Param('productId') productId: string
  ): Promise<CoreApiResponse<ProductUseCaseResponseDto>> {
    const adapter: EditProductAdapter = await EditProductAdapter.new({
      executorId: user.id,
      productId: productId,
      name: body.name,
      description: body.description,
      quantity: body.quantity,
      category: body.category,
      imageId: body.imageId,
    });

    const editedProduct: ProductUseCaseResponseDto = await this.editProductUseCase.execute(adapter);
    this.setFileStorageBasePath([editedProduct]);

    return CoreApiResponse.success(Code.SUCCESS.code, editedProduct);
  }

  private setFileStorageBasePath(products: ProductUseCaseResponseDto[]): void {
    products.forEach((product: ProductUseCaseResponseDto) => {
      if (product.image) {
        product.image.url = resolve(FileStorageConfig.BasePath, product.image.url);
      }
    });
  }
}

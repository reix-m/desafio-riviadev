import { HttpAuth } from '@application/api/http-rest/auth/decorator/http-auth';
import { HttpUser } from '@application/api/http-rest/auth/decorator/http-user';
import { HttpUserPayload } from '@application/api/http-rest/auth/type/http-auth-types';
import { HttpRestApiModelCreateProductBody } from '@application/api/http-rest/controller/documentation/product/http-rest-api-model-create-product-body';
import { HttpRestApiModelEditProductBody } from '@application/api/http-rest/controller/documentation/product/http-rest-api-model-edit-product-body';
import { HttpRestApiModelGetProductListQuery } from '@application/api/http-rest/controller/documentation/product/http-rest-api-model-get-product-list-query';
import { HttpRestApiResponseProduct } from '@application/api/http-rest/controller/documentation/product/http-rest-api-response-product';
import { HttpRestApiResponseProductList } from '@application/api/http-rest/controller/documentation/product/http-rest-api-response-product-list';
import { CoreApiResponse } from '@core/common/api/core-api-response';
import { Code } from '@core/common/code/code';
import { ProductDITokens } from '@core/domain/product/di/product-di-tokens';
import { ProductUseCaseResponseDto } from '@core/domain/product/usecase/dto/product-usecase-response-dto';
import { CreateProductUseCase } from '@core/features/product/create-product/usecase/create-product-usecase';
import { EditProductUseCase } from '@core/features/product/edit-product/usecase/edit-product-usecase';
import { GetProductListUseCase } from '@core/features/product/get-product-list/usecase/get-product-list-usecase';
import { GetProductUseCase } from '@core/features/product/get-product/usecase/get-product-usecase';
import { RemoveProductUseCase } from '@core/features/product/remove-product/usecase/remove-product-usecase';
import { CreateProductAdapter } from '@infrastructure/adapter/usecase/product/create-product-adapter';
import { EditProductAdapter } from '@infrastructure/adapter/usecase/product/edit-product-adapter';
import { GetProductAdapter } from '@infrastructure/adapter/usecase/product/get-product-adapter';
import { GetProductListAdapter } from '@infrastructure/adapter/usecase/product/get-product-list-adapter';
import { RemoveProductAdapter } from '@infrastructure/adapter/usecase/product/remove-product-adapter';
import { FileStorageConfig } from '@infrastructure/config/file-storage-config';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Inject, Param, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { resolve } from 'url';

@Controller('products')
@ApiTags('products')
export class ProductController {
  constructor(
    @Inject(ProductDITokens.CreateProductUseCase) private readonly createProductUseCase: CreateProductUseCase,
    @Inject(ProductDITokens.EditProductUseCase) private readonly editProductUseCase: EditProductUseCase,
    @Inject(ProductDITokens.RemoveProductUseCase) private readonly removeProductUseCase: RemoveProductUseCase,
    @Inject(ProductDITokens.GetProductUseCase) private readonly getProductUseCase: GetProductUseCase,
    @Inject(ProductDITokens.GetProductListUseCase) private readonly getProductListUseCase: GetProductListUseCase
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

  @Delete(':productId')
  @HttpAuth()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: HttpRestApiResponseProduct })
  public async removeProduct(
    @HttpUser() user: HttpUserPayload,
    @Param('productId') productId: string
  ): Promise<CoreApiResponse<void>> {
    const adapter: RemoveProductAdapter = await RemoveProductAdapter.new({ executorId: user.id, productId: productId });
    await this.removeProductUseCase.execute(adapter);

    return CoreApiResponse.success();
  }

  @Get(':productId')
  @HttpAuth()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: HttpRestApiResponseProduct })
  public async getProduct(@Param('productId') productId: string): Promise<CoreApiResponse<ProductUseCaseResponseDto>> {
    const adapter: GetProductAdapter = await GetProductAdapter.new({ productId: productId });
    const product: ProductUseCaseResponseDto = await this.getProductUseCase.execute(adapter);
    this.setFileStorageBasePath([product]);

    return CoreApiResponse.success(Code.SUCCESS.code, product);
  }

  private setFileStorageBasePath(products: ProductUseCaseResponseDto[]): void {
    products.forEach((product: ProductUseCaseResponseDto) => {
      if (product.image) {
        product.image.url = resolve(FileStorageConfig.BasePath, product.image.url);
      }
    });
  }

  @Get()
  @HttpAuth()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiQuery({ type: HttpRestApiModelGetProductListQuery })
  @ApiResponse({ status: HttpStatus.OK, type: HttpRestApiResponseProductList })
  public async getProductList(
    @Query() query: HttpRestApiModelGetProductListQuery
  ): Promise<CoreApiResponse<ProductUseCaseResponseDto[]>> {
    const adapter: GetProductListAdapter = await GetProductListAdapter.new({
      ownerId: query.ownerId,
      category: query.category,
      offset: Number(query.offset ?? 0),
      limit: Number(query.limit ?? 10),
    });
    const products: ProductUseCaseResponseDto[] = await this.getProductListUseCase.execute(adapter);
    this.setFileStorageBasePath(products);

    return CoreApiResponse.success(Code.SUCCESS.code, products);
  }
}

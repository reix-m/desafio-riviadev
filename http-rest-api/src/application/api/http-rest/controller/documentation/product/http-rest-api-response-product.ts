import { HttpRestApiResponse } from '@application/api/http-rest/controller/documentation/common/http-rest-api-response';
import { HttpRestApiModelProduct } from '@application/api/http-rest/controller/documentation/product/http-rest-api-model-product';
import { ApiProperty } from '@nestjs/swagger';

export class HttpRestApiResponseProduct extends HttpRestApiResponse {
  @ApiProperty({ type: HttpRestApiModelProduct })
  public data: HttpRestApiModelProduct;
}

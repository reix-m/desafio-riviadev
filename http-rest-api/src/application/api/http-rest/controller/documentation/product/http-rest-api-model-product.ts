import { HttpRestApiModelProductImage } from '@application/api/http-rest/controller/documentation/product/http-rest-api-model-product-image';
import { HttpRestApiModelProductOwner } from '@application/api/http-rest/controller/documentation/product/http-rest-api-model-product-owner';
import { ProductCategory } from '@core/common/enums/product-enums';
import { ApiProperty } from '@nestjs/swagger';

export class HttpRestApiModelProduct {
  @ApiProperty({ type: 'string' })
  public id: string;

  @ApiProperty({ type: HttpRestApiModelProductOwner })
  public owner: HttpRestApiModelProductOwner;

  @ApiProperty({ type: HttpRestApiModelProductImage })
  public image: HttpRestApiModelProductImage;

  @ApiProperty({ type: 'string' })
  public name: string;

  @ApiProperty({ type: 'string' })
  public description: string;

  @ApiProperty({ enum: ProductCategory })
  public category: ProductCategory;

  @ApiProperty({ type: 'number' })
  public quantity: number;

  @ApiProperty({ type: 'number' })
  public createdAt: number;

  @ApiProperty({ type: 'number', required: false })
  public updatedAt: number;
}

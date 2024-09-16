import { ProductCategory } from '@core/common/enums/product-enums';
import { ApiProperty } from '@nestjs/swagger';

export class HttpRestApiModelGetProductListQuery {
  @ApiProperty({ type: 'number', required: false, default: 0 })
  public offset: number;

  @ApiProperty({ type: 'number', required: false, default: 10 })
  public limit: number;

  @ApiProperty({ type: 'string', required: false })
  public ownerId: string;

  @ApiProperty({ enum: ProductCategory, required: false })
  public category: ProductCategory;
}

import { ProductCategory } from '@core/common/enums/product-enums';
import { ApiProperty } from '@nestjs/swagger';

export class HttpRestApiModelCreateProductBody {
  @ApiProperty({ type: 'string' })
  public name: string;

  @ApiProperty({ type: 'string', required: false })
  public imageId: string;

  @ApiProperty({ type: 'string' })
  public description: string;

  @ApiProperty({ enum: ProductCategory })
  public category: ProductCategory;

  @ApiProperty({ type: 'number' })
  public quantity: number;
}

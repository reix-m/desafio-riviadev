import { ProductCategory } from '@core/common/enums/product-enums';
import { ApiProperty } from '@nestjs/swagger';

export class HttpRestApiModelEditProductBody {
  @ApiProperty({ type: 'string', required: false })
  public name: string;

  @ApiProperty({ type: 'string', required: false })
  public imageId: string;

  @ApiProperty({ type: 'string', required: false })
  public description: string;

  @ApiProperty({ enum: ProductCategory, required: false })
  public category: ProductCategory;

  @ApiProperty({ type: 'number', required: false })
  public quantity: number;
}

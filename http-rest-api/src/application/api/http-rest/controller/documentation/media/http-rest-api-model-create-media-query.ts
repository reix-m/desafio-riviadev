import { MediaType } from '@core/common/enums/media-enums';
import { ApiProperty } from '@nestjs/swagger';

export class HttpRestApiModelCreateMediaQuery {
  @ApiProperty({ type: 'string', required: false })
  public name: string;

  @ApiProperty({ enum: MediaType })
  public type: MediaType;
}

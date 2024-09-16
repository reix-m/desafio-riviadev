import { ApiProperty } from '@nestjs/swagger';

export class HttpRestApiModelGetMediaListQuery {
  @ApiProperty({ type: 'number', required: false, default: 0 })
  public offset: number;

  @ApiProperty({ type: 'number', required: false, default: 10 })
  public limit: number;

  @ApiProperty({ type: 'string', required: false })
  public executorId: string;
}

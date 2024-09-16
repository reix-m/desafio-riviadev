import { ApiProperty } from '@nestjs/swagger';

export class HttpRestApiModelProductImage {
  @ApiProperty({ type: 'string' })
  public id: string;

  @ApiProperty({ type: 'string' })
  public url: string;
}

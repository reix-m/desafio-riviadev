import { ApiProperty } from '@nestjs/swagger';

export class HttpRestApiModelProductOwner {
  @ApiProperty({ type: 'string' })
  public id: string;

  @ApiProperty({ type: 'string' })
  public name: string;
}

import { ApiProperty } from '@nestjs/swagger';

export class HttpRestApiModelUser {
  @ApiProperty({ type: 'string' })
  public id: string;

  @ApiProperty({ type: 'string' })
  public firstName: string;

  @ApiProperty({ type: 'string' })
  public lastName: string;

  @ApiProperty({ type: 'string' })
  public email: string;
}

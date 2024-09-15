import { ApiProperty } from '@nestjs/swagger';

export class HttpRestApiModelSignInBody {
  @ApiProperty({ type: 'string' })
  public email: string;

  @ApiProperty({ type: 'string' })
  public password: string;
}

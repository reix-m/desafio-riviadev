import { ApiProperty } from '@nestjs/swagger';

export class HttpRestApiModelSignUpBody {
  @ApiProperty({ type: 'string' })
  public firstName: string;

  @ApiProperty({ type: 'string' })
  public lastName: string;

  @ApiProperty({ type: 'string' })
  public email: string;

  @ApiProperty({ type: 'string' })
  public password: string;
}

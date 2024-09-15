import { HttpRestApiResponse } from '@application/api/http-rest/controller/documentation/common/http-rest-api-response';
import { ApiProperty } from '@nestjs/swagger';

export class HttpRestApiResponseSignedUser extends HttpRestApiResponse {
  @ApiProperty({ type: HttpRestApiResponseSignedUser })
  public data: HttpRestApiResponseSignedUser;
}

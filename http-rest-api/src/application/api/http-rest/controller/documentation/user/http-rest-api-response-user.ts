import { HttpRestApiResponse } from '@application/api/http-rest/controller/documentation/common/http-rest-api-response';
import { HttpRestApiModelUser } from '@application/api/http-rest/controller/documentation/user/http-rest-api-model-user';
import { ApiProperty } from '@nestjs/swagger';

export class HttpRestApiResponseUser extends HttpRestApiResponse {
  @ApiProperty({ type: HttpRestApiModelUser })
  public data: HttpRestApiModelUser;
}

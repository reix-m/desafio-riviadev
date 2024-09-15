import { HttpRestApiResponse } from '@application/api/http-rest/controller/documentation/common/http-rest-api-response';
import { HttpRestApiModelMedia } from '@application/api/http-rest/controller/documentation/media/http-rest-api-model-media';
import { ApiProperty } from '@nestjs/swagger';

export class HttpRestApiResponseMedia extends HttpRestApiResponse {
  @ApiProperty({ type: HttpRestApiModelMedia })
  public data: HttpRestApiModelMedia;
}

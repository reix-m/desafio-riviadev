import { ApiProperty } from '@nestjs/swagger';
import { HttpRestApiResponse } from '@application/api/http-rest/controller/documentation/common/http-rest-api-response';
import { HttpRestApiModelMedia } from '@application/api/http-rest/controller/documentation/media/http-rest-api-model-media';

export class HttpRestApiResponseMediaList extends HttpRestApiResponse {
  @ApiProperty({ type: HttpRestApiModelMedia, isArray: true })
  public data: HttpRestApiModelMedia[];
}

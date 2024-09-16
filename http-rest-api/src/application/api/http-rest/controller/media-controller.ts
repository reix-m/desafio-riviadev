import { HttpAuth } from '@application/api/http-rest/auth/decorator/http-auth';
import { HttpUser } from '@application/api/http-rest/auth/decorator/http-user';
import { HttpRequestWithUser, HttpUserPayload } from '@application/api/http-rest/auth/type/http-auth-types';
import { HttpRestApiModelCreateMediaBody } from '@application/api/http-rest/controller/documentation/media/http-rest-api-model-create-media-body';
import { HttpRestApiModelCreateMediaQuery } from '@application/api/http-rest/controller/documentation/media/http-rest-api-model-create-media-query';
import { HttpRestApiModelEditMediaBody } from '@application/api/http-rest/controller/documentation/media/http-rest-api-model-edit-media-body';
import { HttpRestApiModelGetMediaListQuery } from '@application/api/http-rest/controller/documentation/media/http-rest-api-model-get-media-list-query';
import { HttpRestApiResponseMedia } from '@application/api/http-rest/controller/documentation/media/http-rest-api-response-media';
import { HttpRestApiResponseMediaList } from '@application/api/http-rest/controller/documentation/media/http-rest-api-response-media-list';
import { CoreApiResponse } from '@core/common/api/core-api-response';
import { Code } from '@core/common/code/code';
import { MediaType } from '@core/common/enums/media-enums';
import { MediaDITokens } from '@core/domain/media/di/media-di-tokens';
import { MediaUseCaseResponseDto } from '@core/domain/media/usecase/dto/media-usecase-response-dto';
import { CreateMediaUseCase } from '@core/features/media/create-media/usecase/create-media-usecase';
import { EditMediaUseCase } from '@core/features/media/edit-media/usecase/edit-media-usecase';
import { GetMediaListUseCase } from '@core/features/media/get-media-list/usecase/get-media-list-usecase';
import { GetMediaUseCase } from '@core/features/media/get-media/usecase/get-media-usecase';
import { CreateMediaAdapter } from '@infrastructure/adapter/usecase/media/create-media-adapter';
import { EditMediaAdapter } from '@infrastructure/adapter/usecase/media/edit-media-adapter';
import { GetMediaAdapter } from '@infrastructure/adapter/usecase/media/get-media-adapter';
import { GetMediaListAdapter } from '@infrastructure/adapter/usecase/media/get-media-list-adapter';
import { FileStorageConfig } from '@infrastructure/config/file-storage-config';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { parse } from 'path';
import { resolve } from 'url';

type MulterFile = { originalname: string; mimetype: string; size: number; buffer: Buffer };

@Controller('medias')
@ApiTags('medias')
export class MediaController {
  constructor(
    @Inject(MediaDITokens.CreateMediaUseCase) private readonly createMediaUseCase: CreateMediaUseCase,
    @Inject(MediaDITokens.GetMediaUseCase) private readonly getMediaUseCase: GetMediaUseCase,
    @Inject(MediaDITokens.EditMediaUseCase) private readonly editMediaUseCase: EditMediaUseCase,
    @Inject(MediaDITokens.GetMediaListUseCase) private readonly getMediaListUseCase: GetMediaListUseCase
  ) {}

  @Post()
  @HttpAuth()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: HttpRestApiModelCreateMediaBody })
  @ApiQuery({ name: 'name', type: 'string', required: false })
  @ApiQuery({ name: 'type', enum: MediaType })
  @ApiResponse({ status: HttpStatus.CREATED, type: HttpRestApiResponseMedia })
  public async createMedia(
    @Req() request: HttpRequestWithUser,
    @UploadedFile() file: MulterFile,
    @Query() query: HttpRestApiModelCreateMediaQuery
  ): Promise<CoreApiResponse<MediaUseCaseResponseDto>> {
    const adapter: CreateMediaAdapter = await CreateMediaAdapter.new({
      executorId: request.user.id,
      name: query.name ?? parse(file.originalname).name,
      type: query.type,
      file: file.buffer,
    });

    const createdMedia: MediaUseCaseResponseDto = await this.createMediaUseCase.execute(adapter);
    this.setFileStorageBasePath([createdMedia]);

    return CoreApiResponse.success(Code.CREATED.code, createdMedia, Code.CREATED.message);
  }

  @Get(':mediaId')
  @HttpAuth()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, type: HttpRestApiResponseMedia })
  public async getMedia(@Param('mediaId') mediaId: string): Promise<CoreApiResponse<MediaUseCaseResponseDto>> {
    const adapter: GetMediaAdapter = await GetMediaAdapter.new({
      mediaId: mediaId,
    });

    const media: MediaUseCaseResponseDto = await this.getMediaUseCase.execute(adapter);
    this.setFileStorageBasePath([media]);

    return CoreApiResponse.success(Code.SUCCESS.code, media);
  }

  private setFileStorageBasePath(medias: MediaUseCaseResponseDto[]): void {
    medias.forEach((media: MediaUseCaseResponseDto) => (media.url = resolve(FileStorageConfig.BasePath, media.url)));
  }

  @Put(':mediaId')
  @HttpAuth()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiBody({ type: HttpRestApiModelEditMediaBody })
  @ApiResponse({ status: HttpStatus.OK, type: HttpRestApiResponseMedia })
  public async editMedia(
    @HttpUser() user: HttpUserPayload,
    @Body() body: HttpRestApiModelEditMediaBody,
    @Param('mediaId') mediaId: string
  ): Promise<CoreApiResponse<MediaUseCaseResponseDto>> {
    const adapter: EditMediaAdapter = await EditMediaAdapter.new({
      mediaId,
      executorId: user.id,
      name: body.name,
    });

    const editedMedia: MediaUseCaseResponseDto = await this.editMediaUseCase.execute(adapter);
    this.setFileStorageBasePath([editedMedia]);

    return CoreApiResponse.success(Code.SUCCESS.code, editedMedia);
  }

  @Get()
  @HttpAuth()
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiQuery({ type: HttpRestApiModelGetMediaListQuery })
  @ApiResponse({ status: HttpStatus.OK, type: HttpRestApiResponseMediaList })
  public async getMediaList(
    @Query() query: HttpRestApiModelGetMediaListQuery
  ): Promise<CoreApiResponse<MediaUseCaseResponseDto[]>> {
    const adapter: GetMediaListAdapter = await GetMediaListAdapter.new({
      executorId: query.executorId,
      offset: Number(query.offset ?? 0),
      limit: Number(query.limit ?? 10),
    });
    const medias: MediaUseCaseResponseDto[] = await this.getMediaListUseCase.execute(adapter);
    this.setFileStorageBasePath(medias);

    return CoreApiResponse.success(Code.SUCCESS.code, medias);
  }
}

import { MediaController } from '@application/api/http-rest/controller/media-controller';
import { CoreDITokens } from '@core/common/di/core-di-tokens';
import { EventBusPort } from '@core/common/port/message/event-bus-port';
import { MediaDITokens } from '@core/domain/media/di/media-di-tokens';
import { MediaFileStoragePort } from '@core/domain/media/port/persistence/media-file-storage-port';
import { MediaRepositoryPort } from '@core/domain/media/port/persistence/media-repository-port';
import { CreateMediaService } from '@core/features/media/create-media/create-media-service';
import { CreateMediaUseCase } from '@core/features/media/create-media/usecase/create-media-usecase';
import { EditMediaService } from '@core/features/media/edit-media/edit-media-service';
import { GetMediaListService } from '@core/features/media/get-media-list/get-media-list-service';
import { HandleGetMediaPreviewQueryService } from '@core/features/media/get-media-preview-query/handle-get-media-preview-query-service';
import { GetMediaService } from '@core/features/media/get-media/get-media-service';
import { RemoveMediaService } from '@core/features/media/remove-media/remove-media-service';
import { RemoveMediaUseCase } from '@core/features/media/remove-media/usecase/remove-media-usecase';
import { MinioMediaFileStorageAdapter } from '@infrastructure/adapter/persistence/media-file/minion-media-file-storage-adapter';
import { TypeOrmMediaRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/media/typeorm-media-repository-adapter';
import { NestWrapperGetMediaPreviewQueryHandler } from '@infrastructure/handler/media/nest-wrapper-get-media-preview-query-handler';
import { TransactionalUseCaseWrapper } from '@infrastructure/transactional/transactional-usecase-wrapper';
import { Module, Provider } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

const persistenceProviders: Provider[] = [
  {
    provide: MediaDITokens.MediaFileStorage,
    useClass: MinioMediaFileStorageAdapter,
  },
  {
    provide: MediaDITokens.MediaRepository,
    useFactory: (dataSource: DataSource) => new TypeOrmMediaRepositoryAdapter(dataSource),
    inject: [getDataSourceToken()],
  },
];

const useCaseProviders: Provider[] = [
  {
    provide: MediaDITokens.CreateMediaUseCase,
    useFactory: (mediaRepository: MediaRepositoryPort, mediaFileStorage: MediaFileStoragePort) => {
      const service: CreateMediaUseCase = new CreateMediaService(mediaRepository, mediaFileStorage);
      return new TransactionalUseCaseWrapper(service);
    },
    inject: [MediaDITokens.MediaRepository, MediaDITokens.MediaFileStorage],
  },
  {
    provide: MediaDITokens.GetMediaUseCase,
    useFactory: (mediaRepository: MediaRepositoryPort) => new GetMediaService(mediaRepository),
    inject: [MediaDITokens.MediaRepository],
  },
  {
    provide: MediaDITokens.EditMediaUseCase,
    useFactory: (mediaRepository: MediaRepositoryPort) => new EditMediaService(mediaRepository),
    inject: [MediaDITokens.MediaRepository],
  },
  {
    provide: MediaDITokens.GetMediaListUseCase,
    useFactory: (mediaRepository: MediaRepositoryPort) => new GetMediaListService(mediaRepository),
    inject: [MediaDITokens.MediaRepository],
  },
  {
    provide: MediaDITokens.RemoveMediaUseCase,
    useFactory: (mediaRepository: MediaRepositoryPort, eventBus: EventBusPort) => {
      const service: RemoveMediaUseCase = new RemoveMediaService(mediaRepository, eventBus);
      return new TransactionalUseCaseWrapper(service);
    },
    inject: [MediaDITokens.MediaRepository, CoreDITokens.EventBus],
  },
];

const handlerProviders: Provider[] = [
  NestWrapperGetMediaPreviewQueryHandler,
  {
    provide: MediaDITokens.GetMediaPreviewQueryHandler,
    useFactory: (mediaRepository: MediaRepositoryPort) => new HandleGetMediaPreviewQueryService(mediaRepository),
    inject: [MediaDITokens.MediaRepository],
  },
];

@Module({
  controllers: [MediaController],
  providers: [...persistenceProviders, ...useCaseProviders, ...handlerProviders],
})
export class MediaModule {}

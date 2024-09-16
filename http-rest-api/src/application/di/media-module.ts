import { MediaController } from '@application/api/http-rest/controller/media-controller';
import { MediaDITokens } from '@core/domain/media/di/media-di-tokens';
import { MediaFileStoragePort } from '@core/domain/media/port/persistence/media-file-storage-port';
import { MediaRepositoryPort } from '@core/domain/media/port/persistence/media-repository-port';
import { CreateMediaService } from '@core/features/media/create-media/create-media-service';
import { CreateMediaUseCase } from '@core/features/media/create-media/usecase/create-media-usecase';
import { GetMediaService } from '@core/features/media/get-media/get-media-service';
import { MinioMediaFileStorageAdapter } from '@infrastructure/adapter/persistence/media-file/minion-media-file-storage-adapter';
import { TypeOrmMediaRepositoryAdapter } from '@infrastructure/adapter/persistence/typeorm/repository/media/typeorm-media-repository-adapter';
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
];

@Module({
  controllers: [MediaController],
  providers: [...persistenceProviders, ...useCaseProviders],
})
export class MediaModule {}

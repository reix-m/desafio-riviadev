import { Media } from '@core/domain/media/entity/media';
import { MediaRepositoryPort } from '@core/domain/media/port/persistence/media-repository-port';
import { TypeOrmMediaMapper } from '@infrastructure/adapter/persistence/typeorm/entity/media/mapper/typeorm-media-mapper';
import { TypeOrmMedia } from '@infrastructure/adapter/persistence/typeorm/entity/media/typeorm-media';
import { DataSource, InsertResult, Repository } from 'typeorm';

export class TypeOrmMediaRepositoryAdapter extends Repository<TypeOrmMedia> implements MediaRepositoryPort {
  private readonly mediaAlias: string = 'media';

  private readonly excludeRemovedMediaClause: string = `"${this.mediaAlias}"."removedAt" IS NULL`;

  constructor(dataSource: DataSource) {
    super(TypeOrmMedia, dataSource.createEntityManager());
  }

  public async addMedia(media: Media): Promise<{ id: string }> {
    const ormMedia: TypeOrmMedia = TypeOrmMediaMapper.toOrmEntity(media);

    const insertResult: InsertResult = await this.createQueryBuilder()
      .insert()
      .into(TypeOrmMedia)
      .values(ormMedia)
      .execute();

    return {
      id: insertResult.identifiers[0].id,
    };
  }
}

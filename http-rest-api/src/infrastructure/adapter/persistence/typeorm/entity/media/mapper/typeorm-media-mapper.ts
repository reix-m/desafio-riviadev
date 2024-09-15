import { Media } from '@core/domain/media/entity/media';
import { FileMetadata } from '@core/domain/media/value-object/file-metadata';
import { TypeOrmMedia } from '@infrastructure/adapter/persistence/typeorm/entity/media/typeorm-media';

export class TypeOrmMediaMapper {
  public static toOrmEntity(domainMedia: Media): TypeOrmMedia {
    const ormMedia: TypeOrmMedia = new TypeOrmMedia();

    ormMedia.id = domainMedia.getId();
    ormMedia.ownerId = domainMedia.getOwnerId();
    ormMedia.name = domainMedia.getName();
    ormMedia.type = domainMedia.getType();
    ormMedia.relativePath = domainMedia.getMetadata().getRelativePath();
    ormMedia.size = domainMedia.getMetadata().getSize() as number;
    ormMedia.ext = domainMedia.getMetadata().getExt() as string;
    ormMedia.mimetype = domainMedia.getMetadata().getMimetype() as string;
    ormMedia.createdAt = domainMedia.getCreatedAt();
    ormMedia.updatedAt = domainMedia.getUpdatedAt() as Date;
    ormMedia.removedAt = domainMedia.getRemovedAt() as Date;

    return ormMedia;
  }

  public static toDomainEntity(ormMedia: TypeOrmMedia): Media {
    const metadata: FileMetadata = new FileMetadata({
      relativePath: ormMedia.relativePath,
      size: ormMedia.size,
      ext: ormMedia.ext,
      mimetype: ormMedia.mimetype,
    });

    const domainMedia: Media = new Media({
      ownerId: ormMedia.ownerId,
      name: ormMedia.name,
      type: ormMedia.type,
      metadata: metadata,
      id: ormMedia.id,
      createdAt: ormMedia.createdAt,
      updatedAt: ormMedia.updatedAt,
      removedAt: ormMedia.removedAt,
    });

    return domainMedia;
  }
}

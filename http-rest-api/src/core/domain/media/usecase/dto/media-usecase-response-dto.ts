import { MediaType } from '@core/common/enums/media-enums';
import { Nullable } from '@core/common/type/common-types';
import { Media } from '@core/domain/media/entity/media';
import { Exclude, Expose, plainToInstance } from 'class-transformer';

@Exclude()
export class MediaUseCaseResponseDto {
  @Expose()
  public id: string;

  @Expose()
  public ownerId: string;

  @Expose()
  public name: string;

  @Expose()
  public type: MediaType;

  public url: string;

  public createdAt: number;

  public updatedAt: Nullable<number>;

  public static newFromMedia(media: Media): MediaUseCaseResponseDto {
    const payload: Record<string, unknown> = {
      id: media.getId(),
      name: media.getName(),
      ownerId: media.getOwnerId(),
      type: media.getType(),
    };

    const dto: MediaUseCaseResponseDto = plainToInstance(MediaUseCaseResponseDto, payload);

    dto.url = media.getMetadata().getRelativePath();
    dto.createdAt = media.getCreatedAt().getTime();
    dto.updatedAt = media.getUpdatedAt()?.getTime() ?? null;

    return dto;
  }

  public static newListFromMedias(medias: Media[]): MediaUseCaseResponseDto[] {
    return medias.map(this.newFromMedia);
  }
}

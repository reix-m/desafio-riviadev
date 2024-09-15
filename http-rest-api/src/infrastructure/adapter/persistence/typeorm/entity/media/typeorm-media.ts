import { MediaType } from '@core/common/enums/media-enums';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('medias')
export class TypeOrmMedia {
  @PrimaryColumn()
  public id: string;

  @Column()
  public ownerId: string;

  @Column()
  public name: string;

  @Column()
  public type: MediaType;

  @Column()
  public relativePath: string;

  @Column()
  public size: number;

  @Column()
  public ext: string;

  @Column()
  public mimetype: string;

  @Column()
  public createdAt: Date;

  @Column()
  public updatedAt: Date;

  @Column()
  public removedAt: Date;
}

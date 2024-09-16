import { ProductCategory } from '@core/common/enums/product-enums';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('products')
export class TypeOrmProduct {
  @PrimaryColumn()
  public id: string;

  @Column()
  public ownerId: string;

  @Column()
  public imageId: string;

  @Column()
  public name: string;

  @Column()
  public description: string;

  @Column()
  public category: ProductCategory;

  @Column()
  public quantity: number;

  @Column()
  public createdAt: Date;

  @Column()
  public updatedAt: Date;

  @Column()
  public removedAt: Date;

  public owner: { id: string; firstName: string; lastName: string };
  public image?: { id: string; relativePath: string };
}

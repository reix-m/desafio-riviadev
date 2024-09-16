import { Product } from '@core/domain/product/entity/product';
import { ProductRepositoryPort } from '@core/domain/product/port/persistence/product-repository-port';
import { TypeOrmProduct } from '@infrastructure/adapter/persistence/typeorm/entity/product/typeorm-product';
import { DataSource, InsertResult, Repository, SelectQueryBuilder } from 'typeorm';
import { TypeOrmProductMapper } from '@infrastructure/adapter/persistence/typeorm/entity/product/mapper/typeorm-product-mapper';
import { TypeOrmUser } from '@infrastructure/adapter/persistence/typeorm/entity/user/typeorm-user';
import { TypeOrmMedia } from '@infrastructure/adapter/persistence/typeorm/entity/media/typeorm-media';
import { RepositoryFindOptions, RepositoryRemoveOptions } from '@core/common/persistence/repository-options';
import { Nullable } from '@core/common/type/common-types';
import { ProductCategory } from '@core/common/enums/product-enums';

export class TypeOrmProductRepositoryAdapter extends Repository<TypeOrmProduct> implements ProductRepositoryPort {
  private readonly productAlias: string = 'product';

  private readonly excludeRemovedProductClause: string = `"${this.productAlias}"."removedAt" IS NULL`;

  constructor(dataSource: DataSource) {
    super(TypeOrmProduct, dataSource.createEntityManager());
  }

  public async addProduct(product: Product): Promise<{ id: string }> {
    const ormProduct: TypeOrmProduct = TypeOrmProductMapper.toOrmEntity(product);

    const insertResult: InsertResult = await this.createQueryBuilder(this.productAlias)
      .insert()
      .into(TypeOrmProduct)
      .values(ormProduct)
      .execute();

    return { id: insertResult.identifiers[0].id };
  }

  public async findProduct(by: { id?: string }, options?: RepositoryFindOptions): Promise<Nullable<Product>> {
    let domainProduct: Nullable<Product> = null;

    const query: SelectQueryBuilder<TypeOrmProduct> = this.buildProductQueryBuilder();
    this.extendQueryWithByProperties(query, by);

    if (!options?.includeRemoved) {
      query.andWhere(this.excludeRemovedProductClause);
    }

    const ormProduct: Nullable<TypeOrmProduct> = await query.getOne();

    if (ormProduct) {
      domainProduct = TypeOrmProductMapper.toDomainEntity(ormProduct);
    }

    return domainProduct;
  }

  public async findProducts(
    by: { ownerId?: string; category?: ProductCategory },
    options?: RepositoryFindOptions
  ): Promise<Product[]> {
    const query: SelectQueryBuilder<TypeOrmProduct> = this.buildProductQueryBuilder();

    this.extendQueryWithByProperties(query, by);

    if (!options?.includeRemoved) {
      query.andWhere(this.excludeRemovedProductClause);
    }
    if (options?.limit) {
      query.limit(options.limit);
    }
    if (options?.offset) {
      query.offset(options.offset);
    }

    const ormProducts: TypeOrmProduct[] = await query.getMany();
    const domainProducts: Product[] = TypeOrmProductMapper.toDomainEntities(ormProducts);

    return domainProducts;
  }

  public async updateProduct(product: Product): Promise<void> {
    const ormProduct: TypeOrmProduct = TypeOrmProductMapper.toOrmEntity(product);
    await this.update(ormProduct.id, ormProduct);
  }

  public async removeProduct(product: Product, options?: RepositoryRemoveOptions): Promise<void> {
    await product.remove();
    const ormProduct: TypeOrmProduct = TypeOrmProductMapper.toOrmEntity(product);

    if (options?.disableSoftDeleting) {
      await this.delete(ormProduct);
    }
    if (!options?.disableSoftDeleting) {
      await this.update(ormProduct.id, ormProduct);
    }
  }

  private buildProductQueryBuilder(): SelectQueryBuilder<TypeOrmProduct> {
    return this.createQueryBuilder(this.productAlias)
      .select()
      .leftJoinAndMapOne(
        `${this.productAlias}.owner`,
        TypeOrmUser,
        'owner',
        `${this.productAlias}."ownerId" = owner.id`
      )
      .leftJoinAndMapOne(
        `${this.productAlias}.image`,
        TypeOrmMedia,
        'image',
        `${this.productAlias}."imageId" = image.id`
      );
  }

  private extendQueryWithByProperties(
    query: SelectQueryBuilder<TypeOrmProduct>,
    by?: { id?: string; ownerId?: string; category?: string }
  ): void {
    if (by?.id) {
      query.andWhere(`"${this.productAlias}"."id" = :id`, { id: by.id });
    }

    if (by?.ownerId) {
      query.andWhere(`"${this.productAlias}"."ownerId" = :ownerId`, { ownerId: by.ownerId });
    }

    if (by?.category) {
      query.andWhere(`"${this.productAlias}"."category" = :category`, { category: by.category });
    }
  }
}

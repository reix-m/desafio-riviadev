import { RepositoryFindOptions } from '@core/common/persistence/repository-options';
import { User } from '@core/domain/user/entity/user';
import { UserRepositoryPort } from '@core/domain/user/port/persistence/user-repository-port';
import { TypeOrmUserMapper } from '@infrastructure/adapter/persistence/typeorm/entity/user/mapper/typeorm-user-mapper';
import { TypeOrmUser } from '@infrastructure/adapter/persistence/typeorm/entity/user/typeorm-user';
import { DataSource, InsertResult, Repository, SelectQueryBuilder } from 'typeorm';

export class TypeOrmUserRepositoryAdapter extends Repository<TypeOrmUser> implements UserRepositoryPort {
  private readonly userAlias: string = 'user';

  private readonly excludeRemovedUserClause: string = `"${this.userAlias}"."removedAt" IS NULL`;

  constructor(dataSource: DataSource) {
    super(TypeOrmUser, dataSource.createEntityManager());
  }

  public async addUser(user: User): Promise<{ id: string }> {
    const ormUser: TypeOrmUser = TypeOrmUserMapper.toOrmEntity(user);

    const insertResult: InsertResult = await this.createQueryBuilder(this.userAlias)
      .insert()
      .into(TypeOrmUser)
      .values(ormUser)
      .execute();

    return { id: insertResult.identifiers[0].id };
  }

  public async countUsers(by?: { id?: string; email?: string }, options?: RepositoryFindOptions): Promise<number> {
    const query: SelectQueryBuilder<TypeOrmUser> = this.buildUserQueryBuilder();

    this.extendQueryWithByProperties(query, by);

    if (!options?.includeRemoved) {
      query.andWhere(this.excludeRemovedUserClause);
    }

    return query.getCount();
  }
  private extendQueryWithByProperties(
    query: SelectQueryBuilder<TypeOrmUser>,
    by?: { id?: string; email?: string }
  ): void {
    if (by?.id) {
      query.andWhere(`"${this.userAlias}"."id" = :id`, { id: by.id });
    }
    if (by?.email) {
      query.andWhere(`"${this.userAlias}"."email" = :email`, { email: by.email });
    }
  }

  private buildUserQueryBuilder(): SelectQueryBuilder<TypeOrmUser> {
    return this.createQueryBuilder(this.userAlias).select();
  }
}

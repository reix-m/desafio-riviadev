import { User } from '@core/domain/user/entity/user';
import { Password } from '@core/domain/user/value-object/password';
import { TypeOrmUser } from '@infrastructure/adapter/persistence/typeorm/entity/user/typeorm-user';

export class TypeOrmUserMapper {
  public static toOrmEntity(domainUser: User): TypeOrmUser {
    const ormUser: TypeOrmUser = new TypeOrmUser();

    ormUser.id = domainUser.getId();
    ormUser.firstName = domainUser.getFirstName();
    ormUser.lastName = domainUser.getLastName();
    ormUser.email = domainUser.getEmail();
    ormUser.password = domainUser.getPassword().getValue();
    ormUser.createdAt = domainUser.getCreatedAt();
    ormUser.updatedAt = domainUser.getUpdatedAt() as Date;
    ormUser.removedAt = domainUser.getRemovedAt() as Date;

    return ormUser;
  }

  public static toDomainEntity(ormUser: TypeOrmUser): User {
    const domainUser: User = new User({
      firstName: ormUser.firstName,
      lastName: ormUser.lastName,
      email: ormUser.email,
      password: new Password(ormUser.password),
      id: ormUser.id,
      createdAt: ormUser.createdAt,
      updatedAt: ormUser.updatedAt,
      removedAt: ormUser.removedAt,
    });

    return domainUser;
  }
}

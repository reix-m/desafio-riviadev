import { RepositoryFindOptions } from '@core/common/persistence/repository-options';
import { Nullable } from '@core/common/type/common-types';
import { User } from '@core/domain/user/entity/user';

export type UserRepositoryPort = {
  addUser(user: User): Promise<{ id: string }>;
  countUsers(by?: { id?: string; email?: string }, options?: RepositoryFindOptions): Promise<number>;
  findUser(by: { id?: string; email?: string }, options?: RepositoryFindOptions): Promise<Nullable<User>>;
};

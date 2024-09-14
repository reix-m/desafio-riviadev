import { RepositoryFindOptions } from '@core/common/persistence/repository-options';
import { User } from '@core/domain/user/entity/user';

export type UserRepositoryPort = {
  addUser(user: User): Promise<{ id: string }>;
  countUsers(by?: { id?: string; email?: string }, options?: RepositoryFindOptions): Promise<number>;
};

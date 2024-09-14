import { Password } from '@core/domain/user/value-object/password';

export type CreateUserEntityPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: Password;
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  removedAt?: Date;
};

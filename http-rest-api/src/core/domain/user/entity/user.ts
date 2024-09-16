import { Entity } from '@core/common/entity/entity';
import { RemovableEntity } from '@core/common/entity/removable-entity';
import { Nullable } from '@core/common/type/common-types';
import { CreateUserEntityPayload } from '@core/domain/user/entity/type/create-user-entity-payload';
import { Password } from '@core/domain/user/value-object/password';
import { IsDate, IsEmail, IsInstance, IsOptional, IsString } from 'class-validator';
import { randomUUID } from 'crypto';

export class User extends Entity<string> implements RemovableEntity {
  @IsString()
  private _firstName: string;

  @IsString()
  private _lastName: string;

  @IsEmail()
  private readonly _email: string;

  @IsInstance(Password)
  private _password: Password;

  @IsDate()
  private readonly _createdAt: Date;

  @IsOptional()
  @IsDate()
  private _updatedAt: Nullable<Date>;

  @IsOptional()
  @IsDate()
  private _removedAt: Nullable<Date>;

  public getFirstName(): string {
    return this._firstName;
  }

  public getLastName(): string {
    return this._lastName;
  }

  public getName(): string {
    return `${this._firstName} ${this._lastName}`;
  }

  public getEmail(): string {
    return this._email;
  }

  public getPassword(): Password {
    return this._password;
  }

  public getCreatedAt(): Date {
    return this._createdAt;
  }

  public getUpdatedAt(): Nullable<Date> {
    return this._updatedAt;
  }

  public getRemovedAt(): Nullable<Date> {
    return this._removedAt;
  }

  constructor(payload: CreateUserEntityPayload) {
    super();

    this._firstName = payload.firstName;
    this._lastName = payload.lastName;
    this._email = payload.email;
    this._password = payload.password;
    this._id = payload?.id ?? randomUUID();
    this._createdAt = payload?.createdAt ?? new Date();
    this._updatedAt = payload?.updatedAt ?? null;
    this._removedAt = payload?.removedAt ?? null;
  }

  public static async new(payload: CreateUserEntityPayload): Promise<User> {
    const user: User = new User(payload);
    await user.validate();

    return user;
  }

  public async remove(): Promise<void> {
    this._removedAt = new Date();
    await this.validate();
  }
}

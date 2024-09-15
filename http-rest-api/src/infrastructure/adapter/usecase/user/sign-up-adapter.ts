import { UseCaseValidatableAdapter } from '@core/common/adapter/usecase/usecase-validatable-adapter';
import { SignUpPort } from '@core/features/user/sign-up/port/sign-up-port';
import { Exclude, Expose, plainToInstance } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';

@Exclude()
export class SignUpAdapter extends UseCaseValidatableAdapter implements SignUpPort {
  @Expose()
  @IsString()
  public firstName: string;

  @Expose()
  @IsString()
  public lastName: string;

  @Expose()
  @IsEmail()
  public email: string;

  @Expose()
  @IsString()
  public password: string;

  public static async new(payload: SignUpPort): Promise<SignUpAdapter> {
    const adapter: SignUpAdapter = plainToInstance(SignUpAdapter, payload);
    await adapter.validate();

    return adapter;
  }
}

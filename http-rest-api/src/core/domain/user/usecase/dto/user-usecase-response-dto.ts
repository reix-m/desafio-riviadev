import { Exclude, Expose, plainToClass } from 'class-transformer';
import { User } from '@core/domain/user/entity/user';

@Exclude()
export class UserUseCaseResponseDto {
  @Expose()
  public id: string;

  @Expose()
  public firstName: string;

  @Expose()
  public lastName: string;

  @Expose()
  public email: string;

  public static newFromUser(user: User): UserUseCaseResponseDto {
    const userUseCaseResponse: UserUseCaseResponseDto = {
      id: user.getId(),
      firstName: user.getFirstName(),
      lastName: user.getLastName(),
      email: user.getEmail(),
    };

    return plainToClass(UserUseCaseResponseDto, userUseCaseResponse);
  }
}

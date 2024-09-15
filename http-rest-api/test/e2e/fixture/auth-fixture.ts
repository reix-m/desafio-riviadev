import { ApiServerConfig } from '@infrastructure/config/api-server-config';
import { sign } from 'jsonwebtoken';

export class AuthFixture {
  public static async loginUser(user: { id: string }): Promise<{ accessToken: string }> {
    const accessToken: string = sign({ id: user.id }, ApiServerConfig.AccessTokenSecret);
    return { accessToken };
  }
}

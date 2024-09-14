import { get } from 'env-var';

export class ApiServerConfig {
  public static readonly Host: string = get('API_HOST').required().asString();

  public static readonly Port: number = get('API_PORT').required().asPortNumber();
}

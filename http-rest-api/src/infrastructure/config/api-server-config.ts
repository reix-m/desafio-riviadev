import { get } from 'env-var';

export class ApiServerConfig {
  public static readonly Host: string = get('API_HOST').required().asString();

  public static readonly Port: number = get('API_PORT').required().asPortNumber();

  public static readonly LogEnable: boolean = get('API_LOG_ENABLE').required().asBool();

  public static readonly AccessTokenHeader: string = get('API_ACCESS_TOKEN_HEADER').required().asString();
}

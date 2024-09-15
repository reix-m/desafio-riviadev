import { get } from 'env-var';

export class ApiServerConfig {
  public static readonly Host: string = get('API_HOST').required().asString();

  public static readonly Port: number = get('API_PORT').required().asPortNumber();

  public static readonly LogEnable: boolean = get('API_LOG_ENABLE').required().asBool();

  public static readonly AccessTokenHeader: string = get('API_ACCESS_TOKEN_HEADER').required().asString();

  public static readonly AccessTokenSecret: string = get('API_ACCESS_TOKEN_SECRET').required().asString();

  public static readonly AccessTokenTTLInMinutes: number = get('API_ACCESS_TOKEN_TTL_IN_MINUTES').required().asInt();

  public static readonly SignInUsernameField: string = get('API_SIGN_IN_USERNAME_FIELD').required().asString();

  public static readonly SignInPasswordField: string = get('API_SIGN_IN_PASSWORD_FIELD').required().asString();
}

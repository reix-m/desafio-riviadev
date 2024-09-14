import { get } from 'env-var';

export class DatabaseConfig {
  public static readonly DbHost: string = get('DB_HOST').required().asString();

  public static readonly DbPort: number = get('DB_PORT').required().asPortNumber();

  public static readonly DbUsername: string = get('DB_USERNAME').required().asString();

  public static readonly DbPassword: string = get('DB_PASSWORD').required().asString();

  public static readonly DbName: string = get('DB_NAME').required().asString();

  public static readonly DbLogEnable: boolean = get('DB_LOG_ENABLE').required().asBool();
}

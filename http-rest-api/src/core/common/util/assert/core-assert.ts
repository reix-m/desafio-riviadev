import { Optional, Nullable } from '@core/common/type/common-types';

export class CoreAssert {
  public static isFalse(expression: boolean, exception: Error): void {
    if (expression) {
      throw exception;
    }
  }

  public static notEmpty<T>(value: Optional<Nullable<T>>, exception: Error): T {
    if (value === null || value === undefined) {
      throw exception;
    }
    return value;
  }
}

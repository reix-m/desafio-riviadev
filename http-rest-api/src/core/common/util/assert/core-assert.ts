export class CoreAssert {
  public static isFalse(expression: boolean, exception: Error): void {
    if (expression) {
      throw exception;
    }
  }
}

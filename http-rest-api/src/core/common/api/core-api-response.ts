import { Code } from '@core/common/code/code';
import { Nullable } from '@core/common/type/common-types';

export class CoreApiResponse<TData> {
  public readonly code: number;

  public readonly message: string;

  public readonly timestamp: number;

  public readonly data: Nullable<TData>;

  private constructor(code: number, message: string, data?: TData) {
    this.code = code;
    this.message = message;
    this.data = data ?? null;
    this.timestamp = Date.now();
  }

  public static success<TData>(code?: number, data?: TData, message?: string): CoreApiResponse<TData> {
    const resultCode: number = code ?? Code.SUCCESS.code;
    const resultMessage: string = message ?? Code.SUCCESS.message;

    return new CoreApiResponse(resultCode, resultMessage, data);
  }

  public static error<TData>(code?: number, message?: string, data?: TData): CoreApiResponse<TData> {
    const resultCode: number = code ?? Code.INTERNAL_ERROR.code;
    const resultMessage: string = message ?? Code.INTERNAL_ERROR.message;

    return new CoreApiResponse(resultCode, resultMessage, data);
  }
}

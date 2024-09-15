import { CoreApiResponse } from '@core/common/api/core-api-response';
import { Nullable } from '@core/common/type/common-types';
import { TestUtil } from '@test/common/test-util';

export class ResponseExpect {
  public static codeAndMessage(response: CoreApiResponse<unknown>, expected: { code: number; message: string }): void {
    expect(TestUtil.filterObject(response, ['code', 'message'])).toEqual(expected);
  }

  public static data(
    options: { response: CoreApiResponse<unknown>; passFields?: string[] },
    expected: Nullable<unknown>
  ): void {
    const toFilterObject = (object: object): unknown => {
      return options?.passFields?.length ? TestUtil.filterObject(object, options.passFields) : object;
    };

    const filteredData: unknown = Array.isArray(options.response.data)
      ? options.response.data.map((item) => toFilterObject(item))
      : toFilterObject(options.response.data as object);

    expect(filteredData).toEqual(expected);
  }
}

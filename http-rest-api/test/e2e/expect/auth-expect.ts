import { Code } from '@core/common/code/code';
import { ApiServerConfig } from '@infrastructure/config/api-server-config';
import { HttpStatus } from '@nestjs/common';
import { TestServer } from '@test/common/test-server';
import { ResponseExpect } from '@test/e2e/expect/response-expect';
import supertest from 'supertest';
import TestAgent from 'supertest/lib/agent';

export class AuthExpect {
  public static async unauthorizedError(
    endpoint: { path: string; method: 'post' | 'get' | 'put' | 'delete' },
    testServer: TestServer,
    accessToken?: string
  ): Promise<void> {
    const agent: TestAgent = supertest(testServer.serverApplication.getHttpServer());
    let response: supertest.Response;

    if (accessToken) {
      response = await agent[endpoint.method](endpoint.path)
        .set(ApiServerConfig.AccessTokenHeader, accessToken)
        .expect(HttpStatus.UNAUTHORIZED);
    } else {
      response = await agent[endpoint.method](endpoint.path).expect(HttpStatus.UNAUTHORIZED);
    }

    ResponseExpect.codeAndMessage(response.body, {
      code: Code.UNAUTHORIZED_ERROR.code,
      message: Code.UNAUTHORIZED_ERROR.message,
    });
    ResponseExpect.data({ response: response.body }, null);
  }
}

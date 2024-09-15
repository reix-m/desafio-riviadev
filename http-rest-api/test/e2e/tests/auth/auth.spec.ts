import { HttpJwtPayload } from '@application/api/http-rest/auth/type/http-auth-types';
import { Code } from '@core/common/code/code';
import { User } from '@core/domain/user/entity/user';
import { ApiServerConfig } from '@infrastructure/config/api-server-config';
import { HttpStatus } from '@nestjs/common';
import { TestServer } from '@test/common/test-server';
import { ResponseExpect } from '@test/e2e/expect/response-expect';
import { UserFixture } from '@test/e2e/fixture/user-fixture';
import { randomUUID } from 'crypto';
import { verify } from 'jsonwebtoken';
import supertest from 'supertest';

describe('Auth', () => {
  let testServer: TestServer;
  let userFixture: UserFixture;

  beforeAll(async () => {
    testServer = await TestServer.new();
    userFixture = UserFixture.new(testServer.testingModule);

    await testServer.serverApplication.init();
  });

  afterAll(async () => {
    if (testServer) {
      await testServer.serverApplication.close();
    }
  });

  describe('POST /auth/sign-in', () => {
    test('should sign in user successfully', async () => {
      const email: string = `${randomUUID()}@email.com`;
      const password: string = randomUUID();

      const user: User = await userFixture.insertUser({ email, password });

      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .post('/auth/sign-in')
        .send({ email, password })
        .expect(HttpStatus.OK);

      const tokenPayload: HttpJwtPayload = verify(
        response.body.data.accessToken,
        ApiServerConfig.AccessTokenSecret
      ) as HttpJwtPayload;

      ResponseExpect.codeAndMessage(response.body, { code: Code.SUCCESS.code, message: Code.SUCCESS.message });
      ResponseExpect.data({ response: response.body, passFields: ['id'] }, { id: user.getId() });

      expect(tokenPayload.id).toBe(user.getId());
    });

    test('should return "UNAUTHORIZED_ERROR" response when email is not correct', async () => {
      const email: string = `${randomUUID()}@email.com`;
      const password: string = randomUUID();

      await expectUnauthorizedOnSignIn(
        {
          email,
          password,
        },
        { email: `${randomUUID()}@email.com`, password },
        testServer,
        userFixture
      );
    });

    test('should return "UNAUTHORIZED_ERROR" response when password is not correct', async () => {
      const email: string = `${randomUUID()}@email.com`;
      const password: string = randomUUID();

      await expectUnauthorizedOnSignIn(
        {
          email,
          password,
        },
        { email, password: randomUUID() },
        testServer,
        userFixture
      );
    });
  });
});

async function expectUnauthorizedOnSignIn(
  correctCredentials: { email: string; password: string },
  wrongCredentials: { email: string; password: string },
  testServer: TestServer,
  userFixture: UserFixture
): Promise<void> {
  await userFixture.insertUser({ email: correctCredentials.email, password: correctCredentials.password });

  const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
    .post('/auth/sign-in')
    .send(wrongCredentials)
    .expect(HttpStatus.UNAUTHORIZED);

  ResponseExpect.codeAndMessage(response.body, {
    code: Code.UNAUTHORIZED_ERROR.code,
    message: Code.UNAUTHORIZED_ERROR.message,
  });
  ResponseExpect.data({ response: response.body }, null);
}

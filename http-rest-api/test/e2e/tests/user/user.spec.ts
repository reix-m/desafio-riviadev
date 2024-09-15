import { HttpRestApiModelSignUpBody } from '@application/api/http-rest/controller/documentation/user/http-rest-api-model-sign-up-body';
import { Code } from '@core/common/code/code';
import { Nullable } from '@core/common/type/common-types';
import { UserDITokens } from '@core/domain/user/di/user-di-tokens';
import { User } from '@core/domain/user/entity/user';
import { UserRepositoryPort } from '@core/domain/user/port/persistence/user-repository-port';
import { SignUpAdapter } from '@infrastructure/adapter/usecase/user/sign-up-adapter';
import { HttpStatus } from '@nestjs/common';
import { TestServer } from '@test/common/test-server';
import { ResponseExpect } from '@test/e2e/expect/response-expect';
import { UserFixture } from '@test/e2e/fixture/user-fixture';
import { randomUUID } from 'crypto';
import supertest from 'supertest';

describe('User', () => {
  let testServer: TestServer;
  let userFixture: UserFixture;
  let userRepository: UserRepositoryPort;

  beforeAll(async () => {
    testServer = await TestServer.new();
    userFixture = UserFixture.new(testServer.testingModule);

    userRepository = testServer.testingModule.get(UserDITokens.UserRepository);

    await testServer.serverApplication.init();
  });

  afterAll(async () => {
    if (testServer) {
      await testServer.serverApplication.close();
    }
  });

  describe('POST /users/sign-up', () => {
    test('should sign up user', async () => {
      const body: HttpRestApiModelSignUpBody = {
        firstName: randomUUID(),
        lastName: randomUUID(),
        email: `${randomUUID()}@mail.com`,
        password: randomUUID(),
      };

      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .post('/users/sign-up')
        .send(body)
        .expect(HttpStatus.CREATED);

      const createdUser: Nullable<User> = await userRepository.findUser({ email: body.email });

      const expectedData: Record<string, unknown> = {
        id: createdUser!.getId(),
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
      };

      expect(createdUser).toBeDefined();

      ResponseExpect.codeAndMessage(response.body, { code: Code.CREATED.code, message: Code.CREATED.message });
      ResponseExpect.data({ response: response.body }, expectedData);
    });

    test('should return "ENTITY_ALREADY_EXISTS_ERROR" response when user already exists', async () => {
      const body: HttpRestApiModelSignUpBody = {
        firstName: randomUUID(),
        lastName: randomUUID(),
        email: `${randomUUID()}@mail.com`,
        password: randomUUID(),
      };

      await userFixture.insertUser({ email: body.email });

      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .post('/users/sign-up')
        .send(body)
        .expect(HttpStatus.BAD_REQUEST);

      ResponseExpect.codeAndMessage(response.body, {
        code: Code.ENTITY_ALREADY_EXISTS_ERROR.code,
        message: 'User already exists.',
      });
      ResponseExpect.data({ response: response.body }, null);
    });

    test('should return "USE_CASE_PORT_VALIDATION_ERROR" response when body is not valid', async () => {
      const body: Record<string, unknown> = {
        firstName: 1223,
        lastName: undefined,
        email: 'invalid email',
        password: 11,
      };

      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .post('/users/sign-up')
        .send(body)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.data.context).toBe(SignUpAdapter.name);
      expect(response.body.data.errors.map((error: Record<string, unknown>) => error.property)).toEqual([
        'firstName',
        'lastName',
        'email',
        'password',
      ]);

      ResponseExpect.codeAndMessage(response.body, {
        code: Code.USE_CASE_PORT_VALIDATION_ERROR.code,
        message: Code.USE_CASE_PORT_VALIDATION_ERROR.message,
      });
    });
  });
});

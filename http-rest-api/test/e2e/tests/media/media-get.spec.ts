import { Code } from '@core/common/code/code';
import { MediaType } from '@core/common/enums/media-enums';
import { Media } from '@core/domain/media/entity/media';
import { User } from '@core/domain/user/entity/user';
import { GetMediaAdapter } from '@infrastructure/adapter/usecase/media/get-media-adapter';
import { ApiServerConfig } from '@infrastructure/config/api-server-config';
import { FileStorageConfig } from '@infrastructure/config/file-storage-config';
import { HttpStatus } from '@nestjs/common';
import { TestServer } from '@test/common/test-server';
import { TransactionalTestContext } from '@test/common/transactional-test-context';
import { AuthExpect } from '@test/e2e/expect/auth-expect';
import { ResponseExpect } from '@test/e2e/expect/response-expect';
import { AuthFixture } from '@test/e2e/fixture/auth-fixture';
import { MediaFixture } from '@test/e2e/fixture/media-fixture';
import { UserFixture } from '@test/e2e/fixture/user-fixture';
import { randomUUID } from 'crypto';
import supertest from 'supertest';

describe('Media.Get', () => {
  let testServer: TestServer;
  let userFixture: UserFixture;
  let mediaFixture: MediaFixture;
  let transactionalTestContext: TransactionalTestContext;

  beforeAll(async () => {
    testServer = await TestServer.new();

    userFixture = UserFixture.new(testServer.testingModule);
    mediaFixture = MediaFixture.new(testServer.testingModule);

    await testServer.serverApplication.init();

    transactionalTestContext = TransactionalTestContext.new(testServer.dbConnection);
  });

  afterAll(async () => {
    if (testServer) {
      await testServer.serverApplication.close();
    }
  });

  beforeEach(async () => {
    await transactionalTestContext.start();
  });

  afterEach(async () => {
    await transactionalTestContext.finish();
  });

  describe('GET /medias/{mediaId}', () => {
    test('should return media', async () => {
      const executor: User = await userFixture.insertUser({
        email: `${randomUUID()}@email.com`,
        password: randomUUID(),
      });
      const { accessToken } = await AuthFixture.loginUser({ id: executor.getId() });

      const media: Media = await mediaFixture.insertMedia({ ownerId: executor.getId() });

      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .get(`/medias/${media.getId()}`)
        .set(ApiServerConfig.AccessTokenHeader, accessToken)
        .expect(HttpStatus.OK);

      const expectedData: Record<string, unknown> = {
        id: media!.getId(),
        ownerId: executor.getId(),
        name: media.getName(),
        type: MediaType.Image,
        url: `${FileStorageConfig.BasePath}/${media!.getMetadata().getRelativePath()}`,
        createdAt: media!.getCreatedAt().getTime(),
        updatedAt: media!.getUpdatedAt()!.getTime(),
      };

      ResponseExpect.codeAndMessage(response.body, { code: Code.SUCCESS.code, message: Code.SUCCESS.message });
      ResponseExpect.data({ response: response.body }, expectedData);
    });

    test('should return "UNAUTHORIZED_ERROR" response when access token is not passed', async () => {
      const media: Media = await mediaFixture.insertMedia();
      await AuthExpect.unauthorizedError({ method: 'get', path: `/medias/${media.getId()}` }, testServer);
    });

    test('should return "UNAUTHORIZED_ERROR" response when access token is not valid', async () => {
      const media: Media = await mediaFixture.insertMedia();
      await AuthExpect.unauthorizedError({ method: 'get', path: `/medias/${media.getId()}` }, testServer, randomUUID());
    });

    test('should return "ENTITY_NOT_FOUND_ERROR" response when media not found', async () => {
      const executor: User = await userFixture.insertUser({
        email: `${randomUUID()}@email.com`,
        password: randomUUID(),
      });
      const { accessToken } = await AuthFixture.loginUser({ id: executor.getId() });

      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .get(`/medias/${randomUUID()}`)
        .set(ApiServerConfig.AccessTokenHeader, accessToken)
        .expect(HttpStatus.BAD_REQUEST);

      ResponseExpect.codeAndMessage(response.body, {
        code: Code.ENTITY_NOT_FOUND_ERROR.code,
        message: 'Media not found.',
      });
      ResponseExpect.data({ response: response.body }, null);
    });

    test('should return "USE_CASE_PORT_VALIDATION_ERROR" response when request id is not valid', async () => {
      const executor: User = await userFixture.insertUser({
        email: `${randomUUID()}@email.com`,
        password: randomUUID(),
      });
      const auth: { accessToken: string } = await AuthFixture.loginUser({ id: executor.getId() });

      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .get('/medias/not-uuid')
        .set(ApiServerConfig.AccessTokenHeader, auth.accessToken)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.data.context).toBe(GetMediaAdapter.name);
      expect(response.body.data.errors.map((error: Record<string, unknown>) => error.property)).toEqual(['mediaId']);

      ResponseExpect.codeAndMessage(response.body, {
        code: Code.USE_CASE_PORT_VALIDATION_ERROR.code,
        message: Code.USE_CASE_PORT_VALIDATION_ERROR.message,
      });
    });
  });
});

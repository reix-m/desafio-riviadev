import { Code } from '@core/common/code/code';
import { MediaType } from '@core/common/enums/media-enums';
import { Media } from '@core/domain/media/entity/media';
import { User } from '@core/domain/user/entity/user';
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

describe('Media.GetList', () => {
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

  describe('GET /medias', () => {
    test('should returns owner media list response when executorId query param is set', async () => {
      const executor: User = await userFixture.insertUser({
        email: `${randomUUID()}@email.com`,
        password: randomUUID(),
      });
      const { accessToken } = await AuthFixture.loginUser({ id: executor.getId() });

      const media: Media = await mediaFixture.insertMedia({ ownerId: executor.getId() });

      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .get('/medias')
        .set(ApiServerConfig.AccessTokenHeader, accessToken)
        .expect(HttpStatus.OK);

      const expectedMediaData: Record<string, unknown> = {
        id: media!.getId(),
        ownerId: executor.getId(),
        name: media.getName(),
        type: MediaType.Image,
        url: `${FileStorageConfig.BasePath}/${media!.getMetadata().getRelativePath()}`,
        createdAt: media!.getCreatedAt().getTime(),
        updatedAt: media!.getUpdatedAt()!.getTime(),
      };

      ResponseExpect.codeAndMessage(response.body, { code: Code.SUCCESS.code, message: Code.SUCCESS.message });
      ResponseExpect.data({ response: response.body }, [expectedMediaData]);
    });

    test('should return "UNAUTHORIZED_ERROR" response when access token is not passed', async () => {
      await AuthExpect.unauthorizedError({ method: 'get', path: '/medias' }, testServer);
    });

    test('should return "UNAUTHORIZED_ERROR" response access token is not valid', async () => {
      await AuthExpect.unauthorizedError({ method: 'get', path: '/medias' }, testServer, randomUUID());
    });

    test('should return empty array when media not found', async () => {
      const executor: User = await userFixture.insertUser({
        email: `${randomUUID()}@email.com`,
        password: randomUUID(),
      });
      const { accessToken } = await AuthFixture.loginUser({ id: executor.getId() });

      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .get('/medias')
        .set(ApiServerConfig.AccessTokenHeader, accessToken)
        .expect(HttpStatus.OK);

      ResponseExpect.codeAndMessage(response.body, { code: Code.SUCCESS.code, message: Code.SUCCESS.message });
      ResponseExpect.data({ response: response.body }, []);
    });
  });
});

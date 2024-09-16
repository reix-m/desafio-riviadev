import { Code } from '@core/common/code/code';
import { MediaType } from '@core/common/enums/media-enums';
import { Nullable } from '@core/common/type/common-types';
import { MediaDITokens } from '@core/domain/media/di/media-di-tokens';
import { Media } from '@core/domain/media/entity/media';
import { MediaRepositoryPort } from '@core/domain/media/port/persistence/media-repository-port';
import { User } from '@core/domain/user/entity/user';
import { CreateMediaAdapter } from '@infrastructure/adapter/usecase/media/create-media-adapter';
import { ApiServerConfig } from '@infrastructure/config/api-server-config';
import { FileStorageConfig } from '@infrastructure/config/file-storage-config';
import { HttpStatus } from '@nestjs/common';
import { TestServer } from '@test/common/test-server';
import { e2eAssetDirectory } from '@test/e2e/asset/e2e-asset-directory';
import { AuthExpect } from '@test/e2e/expect/auth-expect';
import { ResponseExpect } from '@test/e2e/expect/response-expect';
import { AuthFixture } from '@test/e2e/fixture/auth-fixture';
import { UserFixture } from '@test/e2e/fixture/user-fixture';
import { randomUUID } from 'crypto';
import { readFileSync } from 'fs';
import path from 'path';
import supertest from 'supertest';

describe('Media.Create', () => {
  let testServer: TestServer;
  let userFixture: UserFixture;

  let mediaRepository: MediaRepositoryPort;

  beforeAll(async () => {
    testServer = await TestServer.new();
    userFixture = UserFixture.new(testServer.testingModule);
    mediaRepository = testServer.testingModule.get(MediaDITokens.MediaRepository);
    await testServer.serverApplication.init();
  });

  afterAll(async () => {
    if (testServer) {
      await testServer.serverApplication.close();
    }
  });

  describe('POST /medias', () => {
    test('should create media', async () => {
      const filePath: string = path.resolve(e2eAssetDirectory, 'content/product.jpeg');

      const executorEmail: string = `${randomUUID()}@email.com`;
      const executorPassword: string = randomUUID();

      const executor: User = await userFixture.insertUser({ email: executorEmail, password: executorPassword });
      const auth: { accessToken: string } = await AuthFixture.loginUser({ id: executor.getId() });

      const mediaName: string = 'Product Image';
      const mediaType: MediaType = MediaType.Image;

      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .post('/medias')
        .attach('file', filePath)
        .query({ name: mediaName, type: mediaType })
        .set(ApiServerConfig.AccessTokenHeader, auth.accessToken)
        .expect(HttpStatus.CREATED);

      const createdMedia: Nullable<Media> = await mediaRepository.findMedia({ id: response.body.data.id });

      const expectedMediaData: Record<string, unknown> = {
        id: createdMedia!.getId(),
        ownerId: executor.getId(),
        name: mediaName,
        type: mediaType,
        url: `${FileStorageConfig.BasePath}/${createdMedia!.getMetadata().getRelativePath()}`,
        createdAt: createdMedia!.getCreatedAt().getTime(),
        updatedAt: null,
      };

      expect(createdMedia).toBeDefined();
      expect(createdMedia!.getMetadata().getSize()).toBe(readFileSync(filePath).length);
      expect(createdMedia!.getMetadata().getMimetype()).toBe('image/png');

      ResponseExpect.codeAndMessage(response.body, { code: Code.CREATED.code, message: Code.CREATED.message });
      ResponseExpect.data({ response: response.body }, expectedMediaData);
    });

    test('should return "UNAUTHORIZED_ERROR" response when access token is not passed', async () => {
      await AuthExpect.unauthorizedError({ method: 'post', path: '/medias' }, testServer);
    });

    test('should return "UNAUTHORIZED_ERROR" response when access token is not valid', async () => {
      await AuthExpect.unauthorizedError({ method: 'post', path: '/medias' }, testServer, randomUUID());
    });

    test('should return "USE_CASE_PORT_VALIDATION_ERROR" response when request data is not valid', async () => {
      const filePath: string = path.resolve(e2eAssetDirectory, 'content/product.jpeg');

      const executor: User = await userFixture.insertUser({
        email: `${randomUUID()}@email.com`,
        password: randomUUID(),
      });

      const auth: { accessToken: string } = await AuthFixture.loginUser({ id: executor.getId() });

      const invalidMediaType: string = 'INAVALID_MEDIA_TYPE';

      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .post('/medias')
        .attach('file', filePath)
        .query({ type: invalidMediaType })
        .set(ApiServerConfig.AccessTokenHeader, auth.accessToken)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.data.context).toBe(CreateMediaAdapter.name);
      expect(response.body.data.errors.map((error: Record<string, unknown>) => error.property)).toEqual(['type']);

      ResponseExpect.codeAndMessage(response.body, {
        code: Code.USE_CASE_PORT_VALIDATION_ERROR.code,
        message: Code.USE_CASE_PORT_VALIDATION_ERROR.message,
      });
    });
  });
});

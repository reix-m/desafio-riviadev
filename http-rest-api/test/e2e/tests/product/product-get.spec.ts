import { Code } from '@core/common/code/code';
import { ProductCategory } from '@core/common/enums/product-enums';
import { Product } from '@core/domain/product/entity/product';
import { ProductOwner } from '@core/domain/product/entity/product-owner';
import { User } from '@core/domain/user/entity/user';
import { GetProductAdapter } from '@infrastructure/adapter/usecase/product/get-product-adapter';
import { ApiServerConfig } from '@infrastructure/config/api-server-config';
import { HttpStatus } from '@nestjs/common';
import { TestServer } from '@test/common/test-server';
import { TransactionalTestContext } from '@test/common/transactional-test-context';
import { AuthExpect } from '@test/e2e/expect/auth-expect';
import { ResponseExpect } from '@test/e2e/expect/response-expect';
import { AuthFixture } from '@test/e2e/fixture/auth-fixture';
import { ProductFixture } from '@test/e2e/fixture/product-fixture';
import { UserFixture } from '@test/e2e/fixture/user-fixture';
import { randomUUID } from 'crypto';
import supertest from 'supertest';

describe('Product.Get', () => {
  let testServer: TestServer;
  let userFixture: UserFixture;
  let productFixture: ProductFixture;
  let transactionalTestContext: TransactionalTestContext;

  beforeAll(async () => {
    testServer = await TestServer.new();

    userFixture = UserFixture.new(testServer.testingModule);
    productFixture = ProductFixture.new(testServer.testingModule);

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

  describe('GET /products/{productId}', () => {
    test('should return product', async () => {
      const executor: User = await userFixture.insertUser({
        email: `${randomUUID()}@email.com`,
        password: randomUUID(),
      });
      const { accessToken } = await AuthFixture.loginUser({ id: executor.getId() });

      const product: Product = await productFixture.insertProduct({
        owner: executor,
        category: ProductCategory.House,
        quantity: 1,
      });

      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .get(`/products/${product.getId()}`)
        .set(ApiServerConfig.AccessTokenHeader, accessToken)
        .expect(HttpStatus.OK);

      const productOwner: ProductOwner = ProductFixture.userToProductOwner(executor);
      const expectedOwner: Record<string, unknown> = {
        id: productOwner.getId(),
        name: productOwner.getName(),
      };
      const expectedProductData: Record<string, unknown> = {
        id: product!.getId(),
        owner: expectedOwner,
        image: null,
        name: product.getName(),
        description: product.getDescription(),
        category: ProductCategory.House,
        quantity: product.getQuantity().getValue(),
        createdAt: product!.getCreatedAt().getTime(),
        updatedAt: product?.getUpdatedAt()?.getTime() ?? null,
      };

      ResponseExpect.codeAndMessage(response.body, { code: Code.SUCCESS.code, message: Code.SUCCESS.message });
      ResponseExpect.data({ response: response.body }, expectedProductData);
    });

    test('should return "UNAUTHORIZED_ERROR" response when access token is not passed', async () => {
      const owner: User = await userFixture.insertUser({ email: `${randomUUID()}@email.com`, password: randomUUID() });
      const product: Product = await productFixture.insertProduct({
        owner,
        category: ProductCategory.House,
        quantity: 1,
      });

      await AuthExpect.unauthorizedError({ method: 'get', path: `/products/${product.getId()}` }, testServer);
    });

    test('should return "UNAUTHORIZED_ERROR" response when access token is not valid', async () => {
      const owner: User = await userFixture.insertUser({
        email: `${randomUUID()}@email.com`,
        password: randomUUID(),
      });
      const product: Product = await productFixture.insertProduct({
        owner,
        category: ProductCategory.House,
        quantity: 1,
      });

      await AuthExpect.unauthorizedError(
        { method: 'get', path: `/products/${product.getId()}` },
        testServer,
        randomUUID()
      );
    });

    test('should return "USE_CASE_PORT_VALIDATION_ERROR" response when request id is not valid', async () => {
      const executor: User = await userFixture.insertUser({
        email: `${randomUUID()}@email.com`,
        password: randomUUID(),
      });
      const { accessToken } = await AuthFixture.loginUser({ id: executor.getId() });

      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .get(`/products/invalid-uuid`)
        .set(ApiServerConfig.AccessTokenHeader, accessToken)
        .expect(HttpStatus.BAD_REQUEST);

      expect(response.body.data.context).toBe(GetProductAdapter.name);
      expect(response.body.data.errors.map((error: Record<string, unknown>) => error.property)).toEqual(['productId']);

      ResponseExpect.codeAndMessage(response.body, {
        code: Code.USE_CASE_PORT_VALIDATION_ERROR.code,
        message: Code.USE_CASE_PORT_VALIDATION_ERROR.message,
      });
    });

    test('should return "ENTITY_NOT_FOUND_ERROR" when product not found', async () => {
      const executor: User = await userFixture.insertUser({
        email: `${randomUUID()}@email.com`,
        password: randomUUID(),
      });
      const { accessToken } = await AuthFixture.loginUser({ id: executor.getId() });

      const response: supertest.Response = await supertest(testServer.serverApplication.getHttpServer())
        .get(`/products/${randomUUID()}`)
        .set(ApiServerConfig.AccessTokenHeader, accessToken)
        .expect(HttpStatus.BAD_REQUEST);

      ResponseExpect.codeAndMessage(response.body, {
        code: Code.ENTITY_NOT_FOUND_ERROR.code,
        message: 'Product not found.',
      });
      ResponseExpect.data({ response: response.body }, null);
    });
  });
});
